const dataModels = require("../db/models/index.model.js");
const bcrypt = require("bcrypt");

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
    const hashedPassword = await bcrypt.hash(password, 10);
    await dataModels.userModel.create({ userName, password: hashedPassword });
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
