const dataModels = require("../db/models/index.model.js");
const crypto = require("crypto");

const signupController = async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  try {
    const findUser = await dataModels.userModel.findOne({ userName });
    if (findUser) {
      res.status(404).json({
        message: "User already exist",
      });
      return;
    }
    const cryptedPassword = crypto.createHash("sha256").update(password).digest("hex");
    await dataModels.userModel.create({ userName, password: cryptedPassword });
    res.status(200).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error(signUp)",
    });
  }
};

module.exports = signupController;
