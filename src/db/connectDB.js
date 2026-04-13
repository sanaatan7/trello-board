const mongoose = require("mongoose");
const config = require("../config/config.js");
async function connectDB() {
  try {
    await mongoose.connect(config.MONGOOSE_URI);
    console.log("DB connected successfull");
  } catch (error) {
    console.log("connection Failed", error.message);
  }
}

module.exports = connectDB;
