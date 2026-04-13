const { organizationModel } = require("../db/models/index.model");

const memberOrAdmin = async (req, res, next) => {
  const orgId = req.orgId;
  const userId = req.userId;
  const organization = await organizationModel.findById(orgId);
  const admin = organization.admin;
  const members = organization.members;
  if (admin != userId && !members.includes(userId)) {
    res.status(404).json({
      message: "You are not authorized to perform this action",
    });
    return;
  }
  next();
};

module.exports = memberOrAdmin;
