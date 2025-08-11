// routes/codeRoutes.js
const express = require("express");
const { runCode } = require("../controllers/compilerController");

const router = express.Router();
router.post("/run", runCode);

module.exports = router;
