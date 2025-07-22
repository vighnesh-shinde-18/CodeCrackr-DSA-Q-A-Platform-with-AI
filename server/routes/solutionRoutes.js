const express = require("express");
const SolutionControllers = require("../controllers/SolutionControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const {
  getAllSolutions,
  getSolutionCount,
  getSolutionById,
  submitSolution,
  getUserSolutions,
  markSolutionAsAccepted
} = require("../controllers/SolutionControllers.js");


router.get("/solution-count",authMiddleware, getSolutionCount);
router.get("/",authMiddleware, getAllSolutions);
router.get("/:id", authMiddleware, getSolutionById);
router.post("/", authMiddleware, submitSolution);
router.get("/user-solutions", authMiddleware, getUserSolutions);
router.patch("/mark-accepted", authMiddleware, markSolutionAsAccepted);

module.exports =  router;