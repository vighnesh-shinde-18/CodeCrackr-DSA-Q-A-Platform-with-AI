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
  markSolutionAsAccepted,
  toggleLikeSolution
} = require("../controllers/SolutionControllers.js");


router.get("/solution-count",authMiddleware, getSolutionCount);
router.get("/:id",authMiddleware, getAllSolutions);
router.post("/:id", authMiddleware, getSolutionById);
router.post("/", authMiddleware, submitSolution);
router.get("/user-solutions", authMiddleware, getUserSolutions);
router.patch("/mark-accepted/:id", authMiddleware, markSolutionAsAccepted);
router.patch("/like/:id", authMiddleware, toggleLikeSolution); 

module.exports =  router;