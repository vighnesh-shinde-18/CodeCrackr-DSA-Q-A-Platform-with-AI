const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reportedAt: { type: Date, default: Date.now },
});

const solutionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    code: { type: String, required: true },
    language: { type: String, default: "javascript" },
    explanation: { type: String },
    accepted: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reports: [reportSchema], // optional report structure
    // ⛔️ REMOVE embedded replySchema (you're using Reply model instead)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Solution", solutionSchema);
