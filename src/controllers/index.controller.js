const signup = require("./signup.controller.js");
const signin = require("./signin.controller.js");
const org = require("./organization.controller.js");
const orgInfo = require("./organizationInfo.controller.js");
const addMemberToOrganization = require("./addMemberToOrganization.js");
const removeMember = require("./removeMember.js");
const createBoard = require("./createBoard.js");
const boards = require("./boards.controller.js");
const addIssue = require("./addIssue.controller.js");
const getIssues = require("./getIssues.controller.js");
const updateIssue = require("./updateIssue.controller.js");
const removeIssue = require("./removeIssue.controller.js");
const indexController = {
  signup,
  signin,
  org,
  orgInfo,
  addMemberToOrganization,
  removeMember,
  createBoard,
  boards,
  addIssue,
  getIssues,
  updateIssue,
  removeIssue,
};

module.exports = indexController;
