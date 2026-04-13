const organizationModel = require("../db/models/organization.model.js");

const verifyAdmin = async (req, res, next) => {
  const orgId = req.orgId;
  const userId = req.userId;
  console.log(userId);
  
  const organization = await organizationModel.findById(orgId);
  const adminId = organization.admin.toString();
  console.log(adminId);

  if (adminId != userId) {
    res.status(404).json({
      message: "You are not admin of this organization",
    });
    return;
  }
  next();
};

module.exports = verifyAdmin;
