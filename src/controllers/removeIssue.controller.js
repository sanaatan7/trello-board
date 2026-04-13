const { issueModel } = require("../db/models/index.model.js");

const removeIssue = async (req, res) => {
  const { issueId } = req.query;
  await issueModel.findByIdAndDelete(issueId);
  res.status(200).json({ message: "Issue deleted successfully" });
};

module.exports = removeIssue;