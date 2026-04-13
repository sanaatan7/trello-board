const organizationModel = require("../db/models/organization.model.js");

const removeMember = async (req, res) => {
  const orgId = req.orgId;
  const memberUserId = req.memberUserId;
  const isMember = req.isMember;
  if (!isMember) {
    res.status(404).json({
      message: "This user is not member of this organization",
    });
    return;
  }
  try {
    const organization = await organizationModel.findByIdAndUpdate(orgId, {
      $pull: { members: memberUserId },
    });
    res.status(200).json({
      message: "Member removed successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = removeMember;
