const { boardModel } = require("../db/models/index.model.js");

const createBoard = async (req, res) => {
  const title = req.body.title;
  const orgId = req.orgId;
  await boardModel.create({ title, orgId });
  res.status(200).json({
    message: "Board created successfully",
  });
};

module.exports = createBoard;
