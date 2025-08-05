// controllers/solutionController.js

const Problem = require("../models/problemModel.js");
const Solution = require("../models/solutionModel.js");
const User = require("../models/userModel.js");
const stringSimilarity = require("string-similarity");
const Reply = require("../models/replyModel.js")

// ✅ Get All Solutions for a Problem (with filters)
const getAllSolutions = async (req, res) => {
  try {
    const problemId = req.params.id;
    const userId = req.user.id;
    const { accepted, submittedByMe } = req.query;

    if (!problemId) {
      return res.status(400).json({ error: "Problem ID is required" });
    }

    const filter = { problem: problemId };
    if (accepted === "true") filter.accepted = true;
    if (accepted === "false") filter.accepted = false;
    if (submittedByMe === "true" && userId) filter.user = userId;

    const solutions = await Solution.find(filter)
      .populate("user", "username")
      .lean();

    const formatted = solutions.map((sol) => {
      const liked = sol.likes?.some((uid) => uid.toString() === userId);
      const reported = sol.reports?.some((r) => r.user.toString() === userId);

      return {
        id: sol._id,
        username: sol.user?.username || "Unknown User",
        userId: sol.user?._id || "",
        explanation: sol.explanation,
        code: sol.code,
        language: sol.language,
        accepted: sol.accepted || false,
        createdAt: sol.createdAt,
        likesCount: sol.likes?.length || 0,
        liked,
        reportCount: sol.reports?.length || 0,
        reported,
        replyCount: sol.replies?.length || 0,
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching solutions:", error);
    res.status(500).json({ error: "Server Error" });
  }
};


// ✅ Get Total Solution Count (for stats)
const getSolutionCount = async (req, res) => {
  try {
    const count = await Solution.countDocuments();
    res.status(200).json({ totalSolutions: count });
  } catch (error) {
    console.error("Error fetching solution count:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ Get a Specific Solution by ID

const getSolutionById = async (req, res) => {
  try {
    const solutionId = req.params.id;
    const userId = req.user.id;

    const solution = await Solution.findById(solutionId)
      .populate("user", "username")
      .populate("problem", "title")
      .lean();

    if (!solution) {
      return res.status(404).json({ error: "Solution not found" });
    }

    const liked = solution.likes?.some((uid) => uid.toString() === userId);
    const reported = solution.reports?.some((uid) => uid.toString() === userId);

    // 🔹 Get all replies for this solution, with username of replier
    const replies = await Reply.find({ solution: solutionId })
      .populate("user", "username")
      .lean();

    const formattedReplies = replies.map((r) => ({
      id: r._id,
      reply: r.reply,
      username: r.user?.username || "Unknown",
      createdAt: r.createdAt,
    }));

    res.status(200).json({
      id: solution._id,
      problemId: solution.problem?._id,
      problemTitle: solution.problem?.title,
      username: solution.user?.username || "Unknown",
      code: solution.code,
      language: solution.language,
      explanation: solution.explanation,
      accepted: solution.accepted,
      createdAt: solution.createdAt,
      likesCount: solution.likes?.length || 0,
      liked,
      reportCount: solution.reports?.length || 0,
      reported,
      replyCount: replies.length,
      replies: formattedReplies,
    });
  } catch (error) {
    console.error("Error fetching solution by ID:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
 


const submitSolution = async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemId, code, explanation, language } = req.body;

    if (!problemId || !code || !explanation || !language) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    const existingSolutions = await Solution.find({ problem: problemId, user: userId });

    for (const sol of existingSolutions) {
      const similarity = stringSimilarity.compareTwoStrings(
        `${sol.code} ${sol.explanation}`.toLowerCase(),
        `${code} ${explanation}`.toLowerCase()
      );

      if (similarity > 0.85) {
        return res.status(409).json({
          error: "You already submitted a similar solution to this problem.",
        });
      }
    }

    const newSolution = new Solution({
      problem: problemId,
      user: userId,
      code,
      language,
      explanation,
      accepted: false,
    });

    await newSolution.save();

    res.status(201).json({
      message: "Solution submitted successfully",
      solutionId: newSolution._id,
    });
  } catch (error) {
    console.error("Error submitting solution:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getUserSolutions = async (req, res) => {
  try {
    const userId = req.user._id;

    const solutions = await Solution.find({ user: userId })
      .populate("problem", "title")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = solutions.map((sol) => ({
      id: sol._id,
      problemId: sol.problem?._id,
      problemTitle: sol.problem?.title || "Untitled Problem",
      code: sol.code,
      language: sol.language,
      explanation: sol.explanation,
      accepted: sol.accepted,
      createdAt: sol.createdAt,
      likesCount: sol.likes?.length || 0,
      liked,
      reportCount: sol.reports?.length || 0,
      reported,
      replyCount: sol.replies?.length || 0,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching user solutions:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

const markSolutionAsAccepted = async (req, res) => {
  try {
    const userId = req.user.id;
    const solutionId = req.params.id;

    const solution = await Solution.findById(solutionId);

    if (!solution) {
      return res.status(404).json({ error: "Solution not found." });
    }

    const problem = await Problem.findById(solution.problem);

    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    if (problem.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not authorized to accept a solution for this problem." });
    }

    await Solution.updateMany(
      { problem: solution.problem, accepted: true },
      { $set: { accepted: false } }
    );

    solution.accepted = true;
    await solution.save();

    res.status(200).json({ message: "Solution marked as accepted successfully." });
  } catch (error) {
    console.error("Error accepting solution:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ Toggle like on a solution
const toggleLikeSolution = async (req, res) => {
  try {
    const userId = req.user.id;
    const solutionId = req.params.id;

    const solution = await Solution.findById(solutionId);
    if (!solution) {
      return res.status(404).json({ error: "Solution not found." });
    }

    const alreadyLiked = solution.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      solution.likes.pull(userId);
    } else {
      // Like
      solution.likes.push(userId);
    }

    await solution.save();

    res.status(200).json({
      message: alreadyLiked ? "Like removed." : "Solution liked!",
      likesCount: solution.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

const toggleReportSolution = async (req, res) => {
  try {
    const userId = req.user.id;
    const solutionId = req.params.id;

    const solution = await Solution.findById(solutionId);
    if (!solution) {
      return res.status(404).json({ error: "Solution not found." });
    }

    const reportIndex = solution.reports.findIndex(
      (r) => r.user.toString() === userId
    );

    if (reportIndex !== -1) {
      // User already reported → unreport
      solution.reports.splice(reportIndex, 1);
      await solution.save();
      return res.status(200).json({ message: "Solution unreported successfully." });
    }

    // Add new report
    solution.reports.push({ user: userId });
    await solution.save();

    return res.status(200).json({ message: "Solution reported successfully." });
  } catch (error) {
    console.error("Error reporting/unreporting solution:", error);
    res.status(500).json({ error: "Server Error" });
  }
};


const replyToSolution = async (req, res) => {
  try {
    const userId = req.user.id;  // assuming verifyToken middleware sets req.user
    const  solutionId  = req.params.id; // ✅ Get from route param
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Reply text is required." });
    }

    const solution = await Solution.findById(solutionId);
    if (!solution) {
      return res.status(404).json({ error: "Solution not found." });
    }

    const newReply = new Reply({
      solution: solutionId,
      user: userId,
      reply: text,
    });

    await newReply.save();

    return res.status(201).json({ message: "Reply added successfully." });
  } catch (error) {
    console.error("Error replying to solution:", error);
    res.status(500).json({ error: "Server Error" });
  }
};




const deleteSolution = async (req, res) => {
  try {
    const userId = req.user.id;
    const solutionId = req.params.id;

    console.log(req.user);

    const solution = await Solution.findById(solutionId);
    if (!solution) {
      return res.status(404).json({ error: "Solution not found." });
    }

 

    await solution.deleteOne();

    res.status(200).json({ message: "Solution deleted successfully." });
  } catch (error) {
    console.error("Error deleting solution:", error);
    res.status(500).json({ error: "Server Error" });
  }
};


module.exports = {
  getAllSolutions,
  getSolutionCount,
  getSolutionById,
  submitSolution,
  getUserSolutions,
  markSolutionAsAccepted,
  toggleLikeSolution,
  toggleReportSolution,
  replyToSolution,
  deleteSolution
};


