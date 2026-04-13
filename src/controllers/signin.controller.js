const dataModels = require("../db/models/index.model.js");
const config = require("../config/config.js");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const signinController = async (req, res) => {
  const { userName, password } = req.body;
  const cryptedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  try {
    const userExist = await dataModels.userModel.findOne({
      userName,
      password: cryptedPassword,
    });
    if (!userExist) {
      res.status(404).json({
        message: "User not exist signup first",
      });
      return;
    }
    const token = jwt.sign(
      {
        password: cryptedPassword,
        userId: userExist._id,
      },
      config.JWT_SECRET,
      { expiresIn: "9h" },
    );
    res.status(200).json({
      message: "Signin successfull",
      token,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = signinController;
