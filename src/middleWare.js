const jwt = require("jsonwebtoken");
const {
  userModel,
  organizationsModel,
  boardsModel,
  issuesModel,
} = require("./db/models");

async function authMiddleware(req, res, next) {
  const token = req.headers?.authorization?.replace(/^"|"$/g, "");
  if (!token) {
    res.status(404).json({
      Message: "Token not found",
    });
    return;
  }
  const _id = jwt.verify(token, process.env.JWT_SECRET).userId;

  const userExists = await userModel.findOne({ _id });
  if (!userExists) {
    res.status(404).json({
      message: "Malified token",
    });
    return;
  }
  req._id = _id;
  next();
}

async function auth2Middleware(req, res, next) {
  const _id = req._id;
  const orgId = req.body.orgId;
  const memberUserName = req.body.memberUserName;

  const memberUser = await userModel.findOne({ userName: memberUserName });

  if (!memberUser) {
    res.status(404).json({
      message: "User not exist",
    });
    return;
  }

  const organization = await organizationsModel.findOne({
    _id: orgId,
    admin: _id,
  });

  if (!organization) {
    res.status(404).json({
      message: "Either the org isn't exist or You aren't admin of this org",
    });
    return;
  }

  let memberExist = organization.members.includes(memberUser._id.toString());

  req.isMember = memberExist;
  req.orgId = orgId;
  req.memberUserId = memberUser._id.toString();
  next();
}

async function auth3Middleware(req, res, next) {
  const _id = req._id;
  const rawOrgId = req.headers.orgid;
  const orgId = rawOrgId?.replace(/^"|"$/g, "");

  if (!orgId) {
    res.status(404).json({
      message: "Can't find orgId ",
    });
    return;
  }

  const theOrganization = await organizationsModel.findById(orgId).lean();

  if (!theOrganization) {
    res.status(404).json({
      message: "ORganization isn't exists",
      orgId,
    });
    return;
  }

  const access =
    theOrganization.admin === _id || theOrganization.members.includes(_id);

  if (!access) {
    res.status(404).json({
      message: "Bad request! ==> Access denied",
    });
    return;
  }
  req.orgId = orgId;
  next();
}

const auth4MiddleWare = async (req, res, next) => {
  const boardId = req.query?.boardId.replace(/^"|"$/g, "");
  const userId = req._id;
  const findBoard = await boardsModel.findById({ _id: boardId });
  if (!findBoard) {
    res.status(404).json({
      message: "Board doesn't exists",
    });
    return;
  }

  const boardOrg = await organizationsModel.findById({
    _id: findBoard.orgId,
  });
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

async function auth5MiddleWare(req, res, next) {
  const userId = req._id;
  const issueId = req.query.issueId.replace(/^"|"$/g, "");
  const theissue = await issuesModel.findById(issueId);
  const theBoard = await boardsModel.findById(theissue.boardId);
  
  if (!theBoard) {
    res.status(404).json({
      message: "Board doesn't exists",
    });
    return;
  }

  const boardOrg = await organizationsModel.findById(theBoard.orgId);
  if (!boardOrg) {
    res.status(404).json({
      message: "Invalid Organization",
    });
    return;
  }
  const isUserOrAdmin = (await boardOrg.admin) === userId;

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
