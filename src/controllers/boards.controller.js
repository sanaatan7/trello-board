const { boardModel } = require("../db/models/index.model.js");

const boards = async (req, res) => {
  const orgId = req.orgId;
  const boards = await boardModel.find({ orgId: orgId });
  res.status(200).json({
    boards,
  });
};

module.exports = boards;
