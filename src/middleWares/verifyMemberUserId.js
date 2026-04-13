const { userModel, organizationModel } = require("../db/models/index.model.js");

const verifyMemberUserId = async (req, res, next) => {
  const memberUserName = req.body.memberUserName?.replace(/^"|"$/g, "");
  try {
    const user = await userModel.findOne({ userName: memberUserName });
    if (!user) {
      res.status(404).json({
        message: "memberUserName not found",
      });
      return;
    }
    const isMember = await organizationModel.findOne({
      _id: req.orgId,
      members: user._id,
    });
    if (!isMember) {
      req.isMember = false;
    } else {
      req.isMember = true;
    }
    req.memberUserId = user._id;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = verifyMemberUserId;
