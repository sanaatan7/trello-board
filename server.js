const app = require("./src/app.js");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./src/db/connectDB.js");

connectDB();

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});