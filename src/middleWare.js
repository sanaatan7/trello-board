const jwt = require("jsonwebtoken");
const { USERS, ORGANIZATIONS } = require("./db/inMemoryDb");

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
  const orgId = req.body.orgId;
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
  console.log(memberExist);
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
      orgId
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
module.exports = { auth2Middleware, authMiddleware, auth3Middleware };
