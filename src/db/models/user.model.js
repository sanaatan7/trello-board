const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "UserName is required"],
    unique: [true, "UserName already exists"],
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
