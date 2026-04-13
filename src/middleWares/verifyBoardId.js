const { boardModel } = require("../db/models/index.model.js");

const verifyBoardId = async (req, res, next) => {
  const boardId = req.query.boardId?.replace(/^"|"$/g, "");
  const orgId = req.orgId;
  try {
    const board = await boardModel.findById(boardId);
    if (!board) {
      res.status(404).json({
        message: "Board not found",
      });
      return;
    }
    if (board.orgId.toString() !== orgId) {
      res.status(404).json({
        message: "Board not found",
      });
      return;
    }
    req.boardId = boardId;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
    next();
  }
};

module.exports = verifyBoardId;
