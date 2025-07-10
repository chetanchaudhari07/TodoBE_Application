const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  visibility: { type: String, enum: ["private", "public"], default: "private" }
}, { timestamps: true });

module.exports = mongoose.model("Todo", todoSchema);

