// routes/problemRoutes.js

const  express =  require("express");
const ProblemControllers = require("../controllers/ProblemControllers.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

const {
  getProblemCount,
  getAllProblems,
  getProblemById,
  createProblem,
  getUserSolvedProblems,
  getUserUploadedProblems
} = require("../controllers/ProblemControllers.js");

router.get("/problem-count", authMiddleware, getProblemCount);
router.get("/", authMiddleware, getAllProblems);
router.get("/:id", authMiddleware, getProblemById);
router.post("/", authMiddleware, createProblem);
router.post("/solved", authMiddleware, getUserSolvedProblems);
router.post("/uploaded", authMiddleware, getUserUploadedProblems);

module.exports = router;
