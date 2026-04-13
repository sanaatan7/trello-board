const { issueModel } = require("../db/models/index.model.js");

const findIssue = async (req, res, next) => {
  let issueId = req.body?.issueId?.replace(/^"|"$/g, "");
  if (!issueId) {
    issueId = req.query?.issueId?.replace(/^"|"$/g, "");
  }
  try {
    const issue = await issueModel.findById(issueId);
    if (!issue) {
      res.status(404).json({
        message: "Issue not found",
      });
      return;
    }
    req.issue = issue;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
    next();
  }
};

module.exports = findIssue;
