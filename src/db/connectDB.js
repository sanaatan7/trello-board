const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGOOSE_URI);
    console.log("DB connected successfull");
  } catch (error) {
    console.log("connection Failed", error.message);
  }
}

module.exports = connectDB;
