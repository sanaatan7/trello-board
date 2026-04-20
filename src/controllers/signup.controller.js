const dataModels = require("../db/models/index.model.js");
const bcrypt = require("bcrypt");
const z = require("zod");

const signupSchema = z.object({
  userName: z.string().min(3),
  password: z.string().min(8),
});
const signupController = async (req, res) => {
  const { data, success, error } = signupSchema.safeParse(req.body);
  if (!success) {
    res.status(404).json({
      message: `incorrect input`,
      error: JSON.parse(error),
    });
    return;
  }
  const userName = data.userName;
  const password = data.password;
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
