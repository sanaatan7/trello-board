const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Issue title is required"],
    trim: true,
    lowercase: true,
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "boards",
  },
  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo",
  },
});

const issueModel = mongoose.model("issues", issueSchema);

module.exports = issueModel;
