const { issueModel } = require("../db/models/index.model.js");

const updateIssue = async (req, res) => {
  const { issueId } = req.body;
  const { status } = req.body;
  console.log(issueId, status);
  await issueModel.findByIdAndUpdate(issueId, { status });
  res.status(200).json({ message: "Issue updated successfully" });
};

module.exports = updateIssue;