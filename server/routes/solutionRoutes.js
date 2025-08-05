const express = require("express"); 
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware.js");

const {
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
} = require("../controllers/SolutionControllers.js");

const router = express.Router(); 

router.get("/solution-count", authMiddleware, getSolutionCount);

router.get("/problem/:id", authMiddleware, getAllSolutions);

router.get("/:id", authMiddleware, getSolutionById); 
 
router.post("/", authMiddleware, submitSolution);
 
router.get("/user-solutions", authMiddleware, getUserSolutions);
 
router.patch("/accept/:id", authMiddleware, markSolutionAsAccepted);
 
router.patch("/like/:id", authMiddleware, toggleLikeSolution);
 
router.patch("/report/:id", authMiddleware, toggleReportSolution);
 
router.post("/reply/:id", authMiddleware, replyToSolution);

router.delete("/:id", authMiddleware,adminMiddleware, deleteSolution); 

module.exports = router;
