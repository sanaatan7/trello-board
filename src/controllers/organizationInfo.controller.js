const models = require("../db/models/index.model.js");

const orgInfo = async (req, res) => {
  const userId = req.userId;
  try {
    const userOrganizations = await models.organizationModel
      .find({
        $or: [{ admin: userId }, { members: userId }],
      })
      .select("_id orgTitle");
    res.status(200).json({
      userOrganizations,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = orgInfo;
