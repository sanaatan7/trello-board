const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors")
const authRouter = require("./routers/auth.router.js");
const frontendRouter = require("./routers/frontend.router.js");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(express.json());
app.use(cors())
app.use("/", frontendRouter);
app.use("/api/auth", authRouter);

module.exports = app;
