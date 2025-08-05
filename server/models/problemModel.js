const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
});

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reportedAt: { type: Date, default: Date.now },
});

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    topics: [String],
    testCases: [testCaseSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reports: [reportSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", problemSchema);
