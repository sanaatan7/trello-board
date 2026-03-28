const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const { USERS, ORGANIZATIONS, BOARDS, ISSUES } = require("./db/inMemoryDb.js");
const {
  authMiddleware,
  auth2Middleware,
  auth3Middleware,
} = require("./middleWare.js");

let userCount = 1;
let orgCount = 1;
let issuCount = 1;
let boardCount = 1;

const app = express();

// app.use(express.static(path.join(__dirname, "frontend")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/signup", (req, res) => {
  const uName = req.body.userName;
  const passW = req.body.password;
  const findUser = USERS.find((u) => u.userName === uName);
  if (findUser) {
    res.status(404).json({
      message: "Invalid user name",
    });
    return;
  }

  const id = `${uName}${userCount++}`;
  const userName = uName;
  const password = passW;
  USERS.push({ id, userName, password });
  res.status(200).json({
    message: "Successfully signup!!",
    USERS,
  });
});

app.post("/signin", (req, res) => {
  const uName = req.body.userName;
  const passW = req.body.password;

  const userExist = USERS.find(
    (u) => u.userName === uName && u.password === passW,
  );
  const userId = userExist.id;
  if (!userExist) {
    res.status(404).json({
      message: "User not exist signup first",
    });
    return;
  }

  const token = jwt.sign(
    {
      userId: userId,
    },
    process.env.JWT_SECRET,
  );
  res.status(200).json({
    message: "Signin successfull",
    token,
  });
});

//AUTHENTICATED ROUTE
//token, orgtitle, description
app.post("/organization", authMiddleware, (req, res) => {
  const orgTitle = req.body.orgTitle;
  const description = req.body.description;
  const admin = req.userId;
  const members = [];
  const id = orgCount++;
  ORGANIZATIONS.push({ id, orgTitle, description, admin, members });
  res.status(200).json({
    message: "Org created successfully!!",
    ORGANIZATIONS,
    id: orgCount - 1,
  });
});

//token, orgid, userName
app.post(
  "/add-member-to-organization",
  authMiddleware,
  auth2Middleware,
  (req, res) => {
    const isMember = req.isMember;
    const organization = req.org;
    const memberUserId = req.memberUserId;
    if (isMember) {
      res.status(404).json({
        message: "This user is already  existed member ",
      });
      return;
    }

    organization.members.push(memberUserId);

    res.status(200).json({
      Message: "New member added",
    });
  },
);

//token, orgid, title

app.post("/board", authMiddleware, auth3Middleware, (req, res) => {
  const title = req.body.title;
  const id = boardCount++;
  const orgId = req.orgId;
  BOARDS.push({ id, title, orgId });
  res.status(200).json({
    message: "Board is created",
  });
});

//token,boardId, title
app.post("/issue", authMiddleware, (req, res) => {
  const userId = req.userId;
  const boardId = Number(req.body.boardId);
  const title = req.body.title;
  const id = issuCount++;

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
  ISSUES.push({ id, title, boardId });

  res.status(200).json({
    message: "Issue is created successfully",
    BOARDS,
    ISSUES,
  });
});

// token, orgId
app.get("/boards", authMiddleware, auth3Middleware, (req, res) => {
  const orgId = req.orgId;
  const boards = BOARDS.filter((board) => board.orgId === orgId);

  res.status(200).json({
    boards,
  });
});

//token, boardId,
app.get("/issues", authMiddleware, (req, res) => {
  const userId = req.userId;
  const boardId = Number(req.query?.boardId);
  if (!boardId) {
    res.status(404).json({
      Message: "Missing board Id ",
    });
  }

  const orgId = BOARDS.find((b) => b.id === boardId).orgId;

  const organization = ORGANIZATIONS.find((o) => o.id === orgId);

  const verifyUser =
    organization.admin === userId || organization.members?.includes(userId);

  if (!verifyUser) {
    res.status(404).json({
      message: "User isn't admin or member of the org to fetch issues",
    });
    return;
  }

  const issues = ISSUES.filter((issue) => {
    return issue.boardId === boardId;
  });

  res.status(200).json({
    issues,
  });
});

app.get("/org-info", authMiddleware, (req, res) => {
  const userId = req.userId;
  const userOrganizations = ORGANIZATIONS.filter(
    (o) => o.admin === userId || o.members.includes(userId),
  );
  res.status(200).json({
    userOrganizations,
  });
});

//Delete
// token, memberUserName, orgId
app.delete("/remove-member", authMiddleware, auth2Middleware, (req, res) => {
  const isMember = req.isMember;
  const organization = req.org;
  const memberUserId = req.memberUserId;
  if (!isMember) {
    res.status(404).json({
      message: "This user is not member ",
    });
    return;
  }
  organization.members = organization.members.filter((m) => m != memberUserId);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "signin.html"));
});

app.get("/organizations", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "organization.html"));
});

app.get("/board", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "board.html"));
});

app.get("/issue", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "issues.html"));
});

module.exports = app;
