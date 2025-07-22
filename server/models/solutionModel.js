

const mongoose = require("mongoose");

const solutionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
  code: { type: String, required: true },
language: { type: String, default: "javascript" },
  explanation: { type: String },
  accepted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports =  mongoose.model("Solution", solutionSchema);
