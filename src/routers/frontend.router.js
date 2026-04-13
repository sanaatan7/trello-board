const express = require("express");
const path = require("path");
const frontendRouter = express.Router();

frontendRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

frontendRouter.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "signin.html"));
});

frontendRouter.get("/organizations", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "organization.html"));
});

frontendRouter.get("/board", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "board.html"));
});

frontendRouter.get("/issue", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "issues.html"));
});

module.exports = frontendRouter;
