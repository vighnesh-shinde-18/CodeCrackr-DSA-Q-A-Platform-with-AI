const Problem = require("../models/problemModel.js");
const Solution = require("../models/solutionModel.js");
const reply = require("../models/replyModel.js")
const stringSimilarity = require("string-similarity");

// GET: All Problems (with filters: topic, accepted, replied)
const getAllProblems = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, accepted, replied } = req.query;

    const problemFilter = topic ? { topics: topic } : {};
    const problems = await Problem.find(problemFilter).lean();
    const userSolutions = await Solution.find({ user: userId }).lean();

    const statusMap = {};
    userSolutions.forEach((sol) => {
      const pid = sol.problem.toString();
      if (!statusMap[pid]) {
        statusMap[pid] = { replied: true, accepted: sol.accepted || false };
      } else if (sol.accepted) {
        statusMap[pid].accepted = true;
      }
    });

    const filtered = problems.filter((p) => {
      const pid = p._id.toString();
      const s = statusMap[pid] || { replied: false, accepted: false };
      const matchReplied = replied ? String(s.replied) === replied : true;
      const matchAccepted = accepted ? String(s.accepted) === accepted : true;
      return matchReplied && matchAccepted;
    });

    const enriched = filtered.map((p) => {
      const pid = p._id.toString();
      return {
        id: p._id,
        title: p.title,
        topics: p.topics,
        replied: statusMap[pid]?.replied || false,
        accepted: statusMap[pid]?.accepted || false,

      };
    });

    res.status(200).json(enriched);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// GET: Problem Count
const getProblemCount = async (req, res) => {
  try {
    const count = await Problem.countDocuments();
    res.status(200).json({ totalProblems: count });
  } catch (error) {
    console.error("Error fetching problem count:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// GET: Problem by ID
const getProblemById = async (req, res) => {
  try {
    const problemId = req.params.id;

    const problem = await Problem.findById(problemId)
      .populate("user", "username") // ✅ populate uploader's username
      .lean();

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.status(200).json({
      id: problem._id,
      title: problem.title,
      description: problem.description,
      topics: problem.topics,
      testCases: problem.testCases,
      username: problem.user?.username || "Unknown", // ✅ include username
      userId: problem.user._id
    });
  } catch (error) {
    console.error("Error fetching problem by ID:", error);
    res.status(500).json({ error: "Server Error" });
  }
};


// POST: Create a new problem
const createProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, topics, testCases } = req.body;

    if (!title || !description || !Array.isArray(topics) || !Array.isArray(testCases)) {
      return res.status(400).json({ error: "All fields are required with valid format." });
    }

    const existingProblems = await Problem.find().lean();
    const newCombined = `${title} ${description}`.toLowerCase();

    for (const p of existingProblems) {
      const existingCombined = `${p.title} ${p.description}`.toLowerCase();
      const similarity = stringSimilarity.compareTwoStrings(newCombined, existingCombined);

      if (similarity > 0.85) {
        return res.status(409).json({ error: "This problem seems similar to an existing one." });
      }
    }

    const existing = await Problem.findOne({ title });
    if (existing) {
      return res.status(409).json({ error: "A problem with this title already exists." });
    }

    const newProblem = new Problem({
      title,
      description,
      topics,
      testCases,
      user: userId
    });

    await newProblem.save();

    res.status(201).json({ message: "Problem uploaded successfully", problemId: newProblem._id });
  } catch (error) {
    console.error("Error creating problem:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// GET: Solved problems by user
const getUserSolvedProblems = async (req, res) => {
  try {
    const userId = req.user.id;
    const { topic, accepted } = req.body;

    const userSolutions = await Solution.find({ user: userId }).populate("problem").lean();

    const seen = new Set();
    const result = [];

    for (const sol of userSolutions) {
      const problem = sol.problem;
      if (!problem) continue;

      const problemId = problem._id.toString();
      if (seen.has(problemId)) continue;
      seen.add(problemId);

      if (topic && topic !== "All" && !problem.topics.includes(topic)) continue;
      if (accepted === true && !sol.accepted) continue;
      if (accepted === false && sol.accepted) continue;

      result.push({
        id: problem._id,
        title: problem.title,
        topics: problem.topics,
        accepted: sol.accepted,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching user's solved problems:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// GET: Uploaded problems by user
const getUserUploadedProblems = async (req, res) => {
  try {
    const userId = req.user.id;
    const { topic } = req.body;

    const filter = { user: userId };
    if (topic) filter.topics = topic;

    const problems = await Problem.find(filter).lean();
    const problemIds = problems.map(p => p._id);

    const solutionCounts = await Solution.aggregate([
      { $match: { problem: { $in: problemIds } } },
      { $group: { _id: "$problem", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    solutionCounts.forEach(entry => {
      countMap[entry._id.toString()] = entry.count;
    });

    const enriched = problems.map(p => ({
      id: p._id,
      title: p.title,
      topics: p.topics,
      description: p.description,
      createdAt: p.createdAt,
      solutionCount: countMap[p._id.toString()] || 0,
    }));

    return res.status(200).json(enriched);
  } catch (error) {
    console.error("Error fetching uploaded problems:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

// PATCH: Report or unreport a question
const toggleReportQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.id;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    const reportIndex = problem.reports.findIndex(r => r.user.toString() === userId);

    if (reportIndex !== -1) {
      problem.reports.splice(reportIndex, 1);
      await problem.save();
      return res.status(200).json({ message: "Problem unreported successfully." });
    }

    problem.reports.push({ user: userId });
    await problem.save();

    res.status(200).json({ message: "Problem reported successfully." });
  } catch (error) {
    console.error("Error reporting problem:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// DELETE: Delete a problem (Admin only)
const deleteQuestion = async (req, res) => {
  try {
    const problemId = req.params.id;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    await Solution.deleteMany({ problem: problem._id });
    await problem.deleteOne();

    res.status(200).json({ message: "Problem and associated solutions deleted successfully." });
  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  getProblemCount,
  getAllProblems,
  getProblemById,
  createProblem,
  getUserSolvedProblems,
  getUserUploadedProblems,
  toggleReportQuestion,
  deleteQuestion,
};
