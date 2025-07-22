const Problem = require("../models/problemModel.js");
const Solution = require("../models/solutionModel.js");
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
    const problem = await Problem.findById(problemId).lean();

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.status(200).json({
      id: problem._id,
      title: problem.title,
      description: problem.description,
      topics: problem.topics,
      testCases: problem.testCases,
      user: problem.user,
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

    const existingProblems = await Problem.find().lean();

    const newCombined = `${title} ${description}`.toLowerCase();

    for (const p of existingProblems) {
      const existingCombined = `${p.title} ${p.description}`.toLowerCase();
      const similarity = stringSimilarity.compareTwoStrings(newCombined, existingCombined);


      if (similarity > 0.85) {
        return res.status(409).json({ error: "This problem seems similar to an existing one." });
      }
    }

    if (!title || !description || !Array.isArray(topics) || !Array.isArray(testCases)) {
      return res.status(400).json({ error: "All fields are required with valid format." });
    }

    const existing = await Problem.findOne({ title });
    if (existing) {
      return res.status(409).json({ error: "A problem with this title already exists." });
    }


    const latestProblem = await Problem.findOne().sort({ problemNumber: -1 })

    const newProblem = new Problem({
      title,
      description,
      topics,
      testCases,
      user: userId,
      problemNumber: latestProblem ? latestProblem.problemNumber + 1 : 1,
    });

    await newProblem.save();

    res.status(201).json({ message: "Problem uploaded successfully", problemId: newProblem._id });
    console.log("13")
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
      const p = sol.problem;
      const pid = p._id.toString();

      if (seen.has(pid)) continue;
      seen.add(pid);

      // ✅ Skip filtering if topic is "All" or not provided
      if (topic && topic !== "All" && !p.topics.includes(topic)) {
        continue;
      }

      // ✅ Filter by accepted status
      if (accepted && String(sol.accepted) !== accepted) {
        continue;
      }

      result.push({
        id: p._id,
        title: p.title,
        topics: p.topics,
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
      {
        $group: {
          _id: "$problem",
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = {};
    solutionCounts.forEach((entry) => {
      countMap[entry._id.toString()] = entry.count;
    });

    const enriched = problems.map((p) => ({
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

module.exports = {
  getProblemCount,
  getAllProblems,
  getProblemById,
  createProblem,
  getUserSolvedProblems,
  getUserUploadedProblems
};
