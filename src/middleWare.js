const jwt = require("jsonwebtoken");
const { USERS, ORGANIZATIONS, BOARDS, ISSUES } = require("./db/inMemoryDb");

function authMiddleware(req, res, next) {
  const token = req.headers?.authorization;
  if (!token) {
    res.status(404).json({
      Message: "Token not found",
    });
    return;
  }
  const userId = jwt.verify(token, process.env.JWT_SECRET).userId;

  const userExists = USERS.find((u) => u.id === userId);
  if (!userExists) {
    res.status(404).json({
      message: "Malified token",
    });
    return;
  }
  req.userId = userId;
  next();
}

function auth2Middleware(req, res, next) {
  const userId = req.userId;
  const orgId = Number(req.body.orgId);
  const memberUserName = req.body.memberUserName;

  const organization = ORGANIZATIONS.find((u) => u.id === orgId);

  if (!organization || organization.admin != userId) {
    res.status(404).json({
      message: "Either the org isn't exist or You aren't admin of this org",
    });
    return;
  }
  const memberUser = USERS.find((u) => u.userName === memberUserName);
  if (!memberUser) {
    res.status(404).json({
      message: "User not exist",
    });
    return;
  }

  const memberExist = organization.members.includes(memberUser.id);
  req.isMember = memberExist;
  req.org = organization;
  req.memberUserId = memberUser.id;
  next();
}

function auth3Middleware(req, res, next) {
  const userId = req.userId;
  const orgId = Number(req.headers.orgid);
  // console.log(orgId);

  const theOrganization = ORGANIZATIONS.find((o) => o.id === orgId);

  if (!theOrganization) {
    res.status(404).json({
      message: "ORganization isn't exists",
      orgId,
    });
    return;
  }

  const access =
    theOrganization.members.includes(userId) ||
    theOrganization.admin === userId;

  if (!access) {
    res.status(404).json({
      message: "Bad request! ==> Access denied",
    });
    return;
  }
  req.orgId = orgId;
  next();
}

const auth4MiddleWare = (req, res, next) => {
  const boardId = Number(req.query?.boardId);
  const userId = req.userId;
  const findBoard = BOARDS.find((b) => b.id === boardId);
  if (!findBoard) {
    res.status(404).json({
      message: "Board doesn't exists",
    });
    return;
  }

  const boardOrg = ORGANIZATIONS.find((o) => o.id === findBoard.orgId);
  if (!boardOrg) {
    res.status(404).json({
      message: "Invalid Organization",
    });
    return;
  }
  const isUserOrAdmin =
    boardOrg.admin === userId || boardOrg.members.includes(userId);

  if (!isUserOrAdmin) {
    res.status(404).json({
      message: "Not an user or admin of the org",
    });
    return;
  }

  req.boardId = boardId;
  next();
};

function auth5MiddleWare(req, res, next) {
  const userId = req.userId;
  const issueId = Number(req.query.issueId);
  // const theIssue = ISSUES.find((i) => i.id === issueId);
  // const theBoard = theIssue.boardId
  const findBoard = BOARDS.find(
    (b) => b.id === ISSUES.find((i) => i.id === issueId)?.boardId,
  );
  if (!findBoard) {
    res.status(404).json({
      message: "Board doesn't exists",
    });
    return;
  }

  const boardOrg = ORGANIZATIONS.find((o) => o.id === findBoard.orgId);
  if (!boardOrg) {
    res.status(404).json({
      message: "Invalid Organization",
    });
    return;
  }
  const isUserOrAdmin = boardOrg.admin === userId;

  if (!isUserOrAdmin) {
    res.status(404).json({
      message: "Not an admin of the org",
    });
    return;
  }

  req.issueId = issueId;
  next();
}

module.exports = {
  auth2Middleware,
  authMiddleware,
  auth3Middleware,
  auth4MiddleWare,
  auth5MiddleWare,
};
