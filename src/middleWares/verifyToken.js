const config = require("../config/config.js");
const jwt = require("jsonwebtoken");
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  
  if (!token) {
    res.status(401).json({
      message: "token not found",
    });
    return;
  }
  const decodedToken = jwt.verify(token, config.JWT_SECRET);
  req.userId = decodedToken.userId;
  next();
};

module.exports = verifyToken;
