const dataModels = require("../db/models/index.model.js");
const verifyUserId = async (req, res, next) => {
    const userId = req.userId;
    const user = await dataModels.userModel.findById(userId);
    if(!user){
        res.status(404).json({
            message: "malified token",
        });
        return;
    }
    next();
};

module.exports = verifyUserId;
