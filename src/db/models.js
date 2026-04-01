const mongoose = require("mongoose");

const usrSchema = new mongoose.Schema({
  userName: String,
  password: String,
});

const organizationsSchema = new mongoose.Schema({
  orgTitle: String,
  description: String,
  admin: String,
  members: Array,
  boards: Array,
});

const boardsSchema = new mongoose.Schema({
  title: String,
  orgId: String,
});
const issuesSchema = new mongoose.Schema({
  title: String,
  boardId: String,
  status: String,
});

const userModel = mongoose.model("users", usrSchema);
const organizationsModel = mongoose.model("organizations", organizationsSchema);
const boardsModel = mongoose.model("boards", boardsSchema);
const issuesModel = mongoose.model("issues", issuesSchema);

module.exports = {
  userModel,
  organizationsModel,
  boardsModel,
  issuesModel,
};
