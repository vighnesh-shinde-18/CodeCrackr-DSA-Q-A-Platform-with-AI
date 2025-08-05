const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");

const {
  getProblemCount,
  getAllProblems,
  getProblemById,
  createProblem,
  getUserSolvedProblems,
  getUserUploadedProblems,
  deleteQuestion,
  toggleReportQuestion
} = require("../controllers/ProblemControllers.js");

const router = express.Router();
 
router.get("/problem-count", authMiddleware, getProblemCount);
 
router.get("/", authMiddleware, getAllProblems);
 
router.get("/:id", authMiddleware, getProblemById);
 
router.post("/", authMiddleware, createProblem);
 
router.post("/solved", authMiddleware, getUserSolvedProblems);
 
router.post("/uploaded", authMiddleware, getUserUploadedProblems);
 
router.patch("/report/:id", authMiddleware, toggleReportQuestion);
 
router.delete("/:id", authMiddleware, adminMiddleware, deleteQuestion);

module.exports = router;
