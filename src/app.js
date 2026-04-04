const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");

const {
  authMiddleware,
  auth2Middleware,
  auth3Middleware,
  auth4MiddleWare,
  auth5MiddleWare,
} = require("./middleWare.js");

const connectDB = require("./db/connectDB.js");
const {
  userModel,
  organizationsModel,
  boardsModel,
  issuesModel,
} = require("./db/models.js");

const app = express();
connectDB();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/signup", async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  try {
    const findUser = await userModel.findOne({ userName });

    if (findUser) {
      res.status(404).json({
        message: "Invalid user name",
      });
      return;
    }

    await userModel.create({ userName, password });
    res.status(200).json({
      message: "Successfully signup!!",
    });
  } catch (error) {
    console.log("Error", error.message);
  }
});

app.post("/signin", async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  const userExist = await userModel.findOne({ userName, password });
  if (!userExist) {
    res.status(404).json({
      message: "User not exist signup first",
    });
    return;
  }

  const userId = userExist?._id.toString();
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
app.post("/organization", authMiddleware, async (req, res) => {
  const orgTitle = req.body.orgTitle;
  const description = req.body.description;
  const admin = req._id;
  await organizationsModel.create({ orgTitle, description, admin });
  res.status(200).json({
    message: "Org created successfully!!",
  });
});

app.get("/org-info", authMiddleware, async (req, res) => {
  const userId = req._id;
  const userOrganizations = await organizationsModel.find({
    $or: [{ admin: userId }, { members: userId }],
  });
  res.status(200).json({
    userOrganizations,
  });
});
//token, orgid, userName
app.post(
  "/add-member-to-organization",
  authMiddleware,
  auth2Middleware,
  async (req, res) => {
    const isMember = req.isMember;
    const orgId = req.orgId;
    const memberUserId = req.memberUserId;
    if (isMember) {
      res.status(404).json({
        message: "  existed member ",
      });
      return;
    }

    await organizationsModel.updateOne(
      { _id: orgId },
      { $push: { members: memberUserId } },
    );

    res.status(200).json({
      Message: "New member added",
    });
  },
);

// token, memberUserName, orgId
app.patch(
  "/remove-member",
  authMiddleware,
  auth2Middleware,
  async (req, res) => {
    const isMember = req.isMember;
    const orgId = req.orgId;
    const memberUserId = req.memberUserId;
    if (!isMember) {
      res.status(404).json({
        message: "This user is not member ",
      });
      return;
    }

    try {
      const organization = await organizationsModel.findById({ _id: orgId });
      organization.members = organization.members.filter(
        (m) => m != memberUserId,
      );
      await organization.save();
      res.status(200).json({
        message: `member with id:  ${memberUserId} removed`,
      });
    } catch (error) {
      console.log(error.message);
    }
  },
);

//token, orgid, title

app.post("/board", authMiddleware, auth3Middleware, async (req, res) => {
  const title = req.body.title;
  const orgId = req.orgId;

  await boardsModel.create({ title, orgId });
  const rawBoard = await boardsModel.findOne({ orgId: orgId, title: title });
  const board = rawBoard._id?.toString();
  await organizationsModel.findByIdAndUpdate(orgId, {
    $push: {
      boards: board,
    },
  });
  res.status(200).json({
    message: "Board is created",
  });
});

// token, orgId
app.get("/boards", authMiddleware, auth3Middleware, async (req, res) => {
  const orgId = req.orgId;
  const boards = await boardsModel.find({ orgId: orgId });
  res.status(200).json({
    boards,
  });
});

//token,boardId, title
app.post("/issue", authMiddleware, auth4MiddleWare, async (req, res) => {
  const title = req.body.title;
  const status = req.body.status;

  const boardId = req.boardId;

  await issuesModel.create({ title, boardId, status });

  res.status(200).json({
    message: "Issue is created successfully",
  });
});

//token, boardId, issueId, status
app.patch("/issue", authMiddleware, auth4MiddleWare, async (req, res) => {
  const issueId = req.body.issueId?.replace(/^"|"$/g, "");
  const status = req.body.status;
  const theIssue = await issuesModel.findById(issueId);
  if (!theIssue) {
    res.status(404).json({
      message: "invalid issue",
    });
    return;
  }
  theIssue.status = status;
  await theIssue.save();
  res.status(200).json({
    message: "Issue status updated",
  });
});

//token, boardId,
app.get("/issues", authMiddleware, auth4MiddleWare, async (req, res) => {
  const boardId = req.boardId;
  const issues = await issuesModel.find({ boardId: boardId });

  res.status(200).json({
    issues,
  });
});

app.delete("/issue", authMiddleware, auth5MiddleWare, async (req, res) => {
  const issueId = req.issueId;

  await issuesModel.findByIdAndDelete(issueId);
  res.status(200).json({});
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
