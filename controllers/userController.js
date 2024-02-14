const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Auths = require("../models/authsModel");
const bcrypt = require("bcrypt");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const forgotUser = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email, authType: "password" });

  res.status(200).json({ user });
};

const loginUser = async (req, res, next) => {
  const { email, password, rememberme } = req.body;

  try {
    const user = await User.login(email, password);

    // create a jwt token
    const token = createToken(user._id);
    const payload = {
      username: user.username,
      email,
      token,
      verified: user.verified,
    };

    res.cookie("user", JSON.stringify(payload), {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: rememberme
        ? 1000 * 60 * 60 * 24 * 365 /* 1 year in ms persist cookie */
        : null,
    });

    // Send response
    res
      .status(200)
      .json({ username: user.username, email, verified: user.verified });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const signupUser = async (req, res, next) => {
  const { email, password, username } = req.body;

  try {
    const user = await User.signup(email, password, username);

    // create a jwt token
    const token = createToken(user._id);
    const payload = {
      username: user.username,
      email,
      token,
      verified: user.verified,
    };

    res.cookie("user", JSON.stringify(payload), {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    // Send response
    res
      .status(200)
      .json({ username: user.username, email, verified: user.verified });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginGoogleUser = async (req, res, next) => {
  const { email, username, profile, rememberme } = req.body;

  try {
    const user = await User.loginGoogle(email, username, profile);

    // create a jwt token
    const token = createToken(user._id);
    const payload = { username: user.username, email, token, verified: true };

    res.cookie("user", JSON.stringify(payload), {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: rememberme
        ? 1000 * 60 * 60 * 24 * 365 /* 1 year in ms persist cookie */
        : null,
    });

    // Send response
    res.status(200).json({
      username: user.username,
      email,
      verified: user.verified,
      profile,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const logoutUser = (req, res) => {
  // Clear the session cookie in the response
  res.clearCookie("user", {
    httpOnly: true,

    secure: true,
    domain: "noteify-server.onrender.com",
    path: "/",
  });

  // Send a response indicating successful logout
  res.status(200).json({ message: "Logout successful" });
};

const resetPasswordGet = async (req, res) => {
  const url = req.query.token;
  const data = await Auths.findOne({ url });

  // Check if auths is available
  if (data) res.status(200).json({ exists: true });
  else res.status(400).json({ exists: false });
};

const resetPasswordPost = async (req, res) => {
  const { password } = req.body;

  const url = req.query.token;
  const data = await Auths.findOne({ url });

  try {
    // Check if auths is still available
    if (!data) throw new Error("Time expired, please re-sent link");

    const user = await User.findOne({
      email: data.email,
      authType: "password",
    });

    // Compare whether the password is the same as the old one
    const compare = await bcrypt.compare(password, user.password);
    if (compare) throw new Error("Password cant't be the same as the old one");

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Find user in database and update password
    await User.findOneAndUpdate(
      { email: data.email, authType: "password" },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    // Delete auth after changing password
    Auths.deleteOne({ url });

    res.status(200).json({ mssg: "Success changing new password" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const validateCookie = (req, res) => {
  // Retrieve authentication cookie from request
  const userCookie = req.cookies.user;

  // Check if authentication cookie exists
  if (!userCookie) {
    return res.status(401).json({ error: "Authentication cookie missing" });
  }

  try {
    // Decode the authentication cookie value (assuming it's a JSON string)
    const cookieData = JSON.parse(userCookie);

    // Check if the cookie has an expiration date
    if (cookieData.expires) {
      const expirationDate = new Date(cookieData.expires);

      // Check if the cookie has expired
      if (expirationDate < new Date()) {
        return res.status(401).json({ error: "Authentication cookie expired" });
      }
    }

    // If the cookie is valid and not expired
    res.status(200).json({
      username: cookieData.username,
      email: cookieData.email,
      verified: cookieData.verified,
    });
  } catch (error) {
    // If decoding fails or the cookie data is invalid
    res.status(401).json({ error: "Invalid authentication cookie" });
  }
};

module.exports = {
  forgotUser,
  loginUser,
  signupUser,
  resetPasswordGet,
  resetPasswordPost,
  logoutUser,
  validateCookie,
  loginGoogleUser,
};
