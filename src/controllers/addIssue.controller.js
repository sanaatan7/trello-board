const { issueModel } = require("../db/models/index.model.js");

const addIssue = async (req, res) => {
  const { title } = req.body;
  const { boardId } = req;
  await issueModel.create({ title, boardId });
  res.status(200).json({ message: "Issue created successfully" });
};

module.exports = addIssue;
