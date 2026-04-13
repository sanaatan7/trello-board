const { organizationModel } = require("../db/models/index.model.js");

const addMemberToOrganization = async (req, res) => {
  const isMember = req.isMember;
  const orgId = req.orgId;
  const memberUserId = req.memberUserId;

  if (isMember) {
    res.status(404).json({
      message: "  existed member ",
    });
    return;
  }

  await organizationModel.updateOne(
    { _id: orgId },
    { $addToSet: { members: memberUserId } },
  );

  res.status(200).json({
    Message: "New member added",
  });
};

module.exports = addMemberToOrganization;
