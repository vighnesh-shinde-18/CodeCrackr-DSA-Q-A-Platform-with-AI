const express = require("express");
const router = express.Router(); 
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const {
  registerUser,
  loginUser,
  logoutUser,
  generateAndSendOtp,
  validateAndResetPassword,
} = require("../controllers/authControllers");

router.post("/register", registerUser); 
router.post("/login", loginUser); 
router.post("/logout", logoutUser);
router.post("/send-otp", generateAndSendOtp);
router.post("/reset-password", validateAndResetPassword);



module.exports = router;
