const express = require("express");
const authRouter = express.Router();
const {
  verifyToken,
  verifyUserId,
  verifyOrgId,
  verifyMemberUserId,
  verifyAdmin,
  memberOrAdmin,
  verifyBoardId,
  findIssue,
} = require("../middleWares/index.middleware.js");
const {
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
} = require("../controllers/index.controller.js");

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/org", verifyToken, verifyUserId, org);
authRouter.get("/org-info", verifyToken, verifyUserId, orgInfo);

authRouter.post(
  "/add-member-to-organization",
  verifyToken,
  verifyUserId,
  verifyOrgId,
  verifyMemberUserId,
  addMemberToOrganization,
);

authRouter.post(
  "/remove-member",
  verifyToken,
  verifyUserId,
  verifyOrgId,
  verifyMemberUserId,
  verifyAdmin,
  removeMember,
);

authRouter.post(
  "/board",
  verifyToken,
  verifyUserId,
  verifyOrgId,
  verifyAdmin,
  createBoard,
);

authRouter.get(
  "/boards",
  verifyToken,
  verifyUserId,
  verifyOrgId,
  memberOrAdmin,
  boards,
);

authRouter.post(
  "/issue",
  verifyToken,
  verifyUserId,
  verifyOrgId,
  verifyBoardId,
  verifyAdmin,
  addIssue,
);

authRouter.get(
  "/issues",
  verifyToken,
  verifyUserId,
  verifyOrgId,
  verifyBoardId,
  memberOrAdmin,
  getIssues,
);

authRouter.patch(
  "/issue",
  verifyToken,
  verifyUserId,
  verifyOrgId,
  verifyBoardId,
  findIssue,
  memberOrAdmin,
  updateIssue,
);

authRouter.delete(
  "/issue",
  verifyToken,
  verifyUserId,
  verifyOrgId,
  verifyBoardId,
  verifyAdmin,
  findIssue,
  removeIssue,
);

module.exports = authRouter;
