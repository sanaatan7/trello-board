const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const { USERS, ORGANIZATIONS, BOARDS } = require("./db/inMemoryDb.js");
let {ISSUES} = require("./db/inMemoryDb.js")
const {
  authMiddleware,
  auth2Middleware,
  auth3Middleware,
  auth4MiddleWare,
  auth5MiddleWare,
} = require("./middleWare.js");

let userCount = 1;
let orgCount = 1;
let issuCount = 1;
let boardCount = 1;

const app = express();

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
  const userId = userExist?.id;
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

// token, orgId
app.get("/boards", authMiddleware, auth3Middleware, (req, res) => {
  const orgId = req.orgId;
  const boards = BOARDS.filter((board) => board.orgId === orgId);

  res.status(200).json({
    boards,
  });
});

//token,boardId, title
app.post("/issue", authMiddleware, auth4MiddleWare, (req, res) => {
  const title = req.body.title;
  const status = req.body.status;

  const boardId = req.boardId;
  const id = issuCount++;

  ISSUES.push({ id, title, status, boardId });

  res.status(200).json({
    message: "Issue is created successfully",
    BOARDS,
    ISSUES,
  });
});

//token, boardId, issueId, status
app.patch("/issue", authMiddleware, auth4MiddleWare, (req, res) => {
  const boardId = req.boardId;
  const issueId = Number(req.body.issueId);
  const status = req.body.status;
  const theIssue = ISSUES.find((i) => i.id === issueId);
  if (!theIssue) {
    res.status(404).json({
      message: "invalid issue",
    });
  }
  theIssue.status = status;
  res.status(200);
});

//token, boardId,
app.get("/issues", authMiddleware, auth4MiddleWare, (req, res) => {
  const boardId = req.boardId;
  const issues = ISSUES.filter((issue) => {
    return issue.boardId === boardId;
  });

  res.status(200).json({
    issues,
  });
});

app.delete("/issue", authMiddleware, auth5MiddleWare, (req, res) => {
  const issueId = req.issueId;
  console.log(issueId);

  const kept = ISSUES.filter((i) => i.id != issueId);
  ISSUES.length = 0;
  ISSUES.push(...kept);
  // console.log(ISSUES);
  res.status(200).json({
    ISSUES,
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
