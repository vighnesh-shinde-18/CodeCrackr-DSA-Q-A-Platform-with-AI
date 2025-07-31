const express = require("express");
const router = express.Router();
const { returnUserProfileInfo, getUsersCount, getAllUserStats } = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, returnUserProfileInfo);
router.get("/user-count", authMiddleware, getUsersCount);
router.get("/stats", authMiddleware, getAllUserStats);

module.exports = router;
