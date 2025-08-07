const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password required for standard registration.' });
    }

    const existingUser = await User.findOne({ email });


    if (existingUser) {

      return res.status(409).json({ success: false, message: 'User already exists.' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });


    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });


  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  
  try {
    const { email, password } = req.body;
    
    
    if (!password && !req.body.isOAuth) {
      
      return res.status(400).json({ success: false, message: 'Password required for standard registration.' });
    }
    
    
    const user = await User.findOne({ email }).select('+password');
    
    
    
    if (!user) {
    
      return res.status(404).json({ success: false, message: 'Invalid credentials.' });
    }
  
    
    const isMatch = await bcrypt.compare(password, user.password);
  
    
    if (!isMatch) {
    
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    
    
    const token = generateToken(user);
    
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
     
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        },
        token
      }
    });
     

  } catch (error) {
    next(error);
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.generateAndSendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,       // your Gmail address
        pass: process.env.EMAIL_PASS,       // your generated App Password
      },
    });


    await transporter.sendMail({
      from: `"CodeCrackr Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    });

    return res.status(200).json({ message: "OTP sent to email." });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Server error sending OTP" });
  }
};


exports.validateAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: "Invalid email or OTP" });
    }
 
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordOTP = null; // Clear OTP
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error resetting password" });
  }
}