const dotenv = require("dotenv");
dotenv.config({
  path: "",
});

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env file");
}

if (!process.env.MONGOOSE_URI) {
  throw new Error("MONGOOSE_URI is not defined in .env file");
}

const config = {
  JWT_SECRET: process.env.JWT_SECRET,
  MONGOOSE_URI: process.env.MONGOOSE_URI,
};

module.exports = config;
