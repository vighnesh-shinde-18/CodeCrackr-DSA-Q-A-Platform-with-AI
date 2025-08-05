const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    solution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Solution",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reply: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reply", replySchema);
