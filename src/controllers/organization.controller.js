const dataModels = require("../db/models/index.model.js");

const org = async (req, res) => {
  const orgTitle = req.body.orgTitle;
  const description = req.body.description;
  const admin = req.userId;
  try {
    const findOrg = await dataModels.organizationModel.findOne({ orgTitle });
    if (findOrg) {
      res.status(404).json({
        message: "Organization already exists",
      });
      return;
    }
    await dataModels.organizationModel.create({ orgTitle, description, admin });
    res.status(200).json({
      message: "Organization created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = org;
