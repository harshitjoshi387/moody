const jwt = require("jsonwebtoken");
const blacklistModel = require("../model/blacklist.model");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.JWT_SECRECT ||
  process.env.JWT_SECRET_KEY;

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "token not provided",
    });
  }

  const isTokenBlacklisted = await blacklistModel.findOne({ token });
  if (isTokenBlacklisted) {
    return res.status(401).json({
      message: "invalid token",
    });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "invalid token",
    });
  }
}

module.exports = authUser;
