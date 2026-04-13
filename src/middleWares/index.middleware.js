const verifyToken = require("./verifyToken.js");
const verifyUserId = require("./verifyUserId.js");
const verifyOrgId = require("./verifyOrgId.js");
const verifyMemberUserId = require("./verifyMemberUserId.js");
const verifyAdmin = require("./verifyAdmin.js");
const memberOrAdmin = require("./memberOrAdmin.js");
const verifyBoardId = require("./verifyBoardId.js");
const findIssue = require("./findIssue.js");
const indexMiddleware = {
  verifyToken,
  verifyUserId,
  verifyOrgId,
  verifyMemberUserId,
  verifyAdmin,
  memberOrAdmin,
  verifyBoardId,
  findIssue,
};

module.exports = indexMiddleware;
