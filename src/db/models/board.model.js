const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Board title is required"],
    trim: true,
    lowercase: true,
    unique: [true, "Board title already exists"],
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "organizations",
  },
  issues: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "issues",
    },
  ],
});

const boardModel = mongoose.model("boards", boardSchema);

module.exports = boardModel;
