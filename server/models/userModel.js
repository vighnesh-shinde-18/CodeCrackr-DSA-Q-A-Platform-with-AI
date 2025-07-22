const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
    required: function () {
      return !this.googleId;  // Or similar check
    },
  },
  resetPasswordOTP: {
    type: String,
    default: null,
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
