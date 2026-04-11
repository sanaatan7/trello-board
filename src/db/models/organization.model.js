const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  orgTitle: {
    type: String,
    required: [true, "Organization title is required"],
    unique: [true, "Organization title already exists"],
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  boards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "boards",
    },
  ],
});

const organizationModel = mongoose.model("organizations", organizationSchema);

module.exports = organizationModel;