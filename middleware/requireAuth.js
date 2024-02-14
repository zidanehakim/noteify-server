const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  // verify authentication
  const userCookie = req.cookies.user;

  if (!userCookie)
    return res.status(401).json({ error: "Please login for access" });

  try {
    const { token } = JSON.parse(userCookie);
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }).select("_id");
    req.email = await User.findOne({ _id }).select("email");

    next();
  } catch (err) {
    res.status(401).json({ error: "Authorization token required" });
  }
};

module.exports = requireAuth;
