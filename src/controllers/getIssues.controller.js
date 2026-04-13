const { issueModel } = require("../db/models/index.model.js");

const getIssues = async (req, res) => {
  const { boardId } = req;
  const issues = await issueModel.find({ boardId: boardId }).select("_id title status");
  res.status(200).json({ issues });
};

module.exports = getIssues;
