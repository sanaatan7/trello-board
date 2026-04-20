const dataModels = require("../db/models/index.model.js");
const config = require("../config/config.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const z = require("zod");

const signinSchema = z.object({
  userName: z.string().min(3),
  password: z.string().min(8),
});
const signinController = async (req, res) => {
  const { data, success, error } = signinSchema.safeParse(req.body);
  if (!success) {
    res.status(404).json({
      message: `incorrect input`,
      error: JSON.parse(error),
    });
    return;
  }
  const { userName, password } = data;
  try {
    const userExist = await dataModels.userModel
      .findOne({
        userName,
      })
      .select("_id password");
    if (!userExist) {
      res.status(404).json({
        message: "User not exist signup first",
      });
      return;
    }
    const checkPassword = bcrypt.compare(password, userExist.password);
    if (!checkPassword) {
      res.status(404).json({
        message: "Wrong credentials",
      });
      return;
    }
    const token = jwt.sign(
      {
        password: userExist.password,
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
