// routes/codeRoutes.js
const express = require("express");
const { runCode } = require("../controllers/compilerController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/run",authMiddleware, runCode);

module.exports = router;
