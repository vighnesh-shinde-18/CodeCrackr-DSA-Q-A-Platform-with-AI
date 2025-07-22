const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
});

const problemSchema = new mongoose.Schema(
  {
    problemNumber: {
      type: Number,
      unique: true,
    },
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    topics: [String],
    testCases: [testCaseSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Correct CommonJS export
module.exports = mongoose.model("Problem", problemSchema);
