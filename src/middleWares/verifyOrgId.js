const { org } = require("../controllers/index.controller.js");
const organizationModel = require("../db/models/organization.model.js");

const verifyOrgId = async (req, res, next) => {
  let orgId = req.body?.orgId?.replace(/^"|"$/g, "");
  if (!orgId) {
    orgId = req.query?.orgId?.replace(/^"|"$/g, "");
  }
  if (!orgId) {
    res.status(400).json({
      message: "Organization ID is required",
    });
    return;
  }
  try {
    const org = await organizationModel.findById(orgId);
    if (!org) {
      res.status(404).json({
        message: "Organization not found",
      });
      return;
    }
    req.orgId = orgId;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = verifyOrgId;
