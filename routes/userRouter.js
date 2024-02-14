const express = require("express");
const cookieParser = require("cookie-parser");
const {
  forgotUser,
  loginUser,
  signupUser,
  logoutUser,
  resetPasswordGet,
  resetPasswordPost,
  validateCookie,
  loginGoogleUser,
} = require("../controllers/userController");

const router = express.Router();

router.use(cookieParser());

// FORGOT PASSWORD user
router.post("/forgot-password", forgotUser);

// LOGIN user
router.post("/login", loginUser);

// SIGNUP user
router.post("/signup", signupUser);

// LOGOUT user
router.get("/logout", logoutUser);

// GET RESET PASSWORD user
router.get("/reset-password", resetPasswordGet);

// POST RESET PASSWORD user
router.post("/reset-password", resetPasswordPost);

// LOGOUT user
router.get("/validatecookie", validateCookie);

// LOGIN GOOGLE (LOGIN IF EXISTS, IF NOT SIGNUP) user
router.post("/logingoogle", loginGoogleUser);

module.exports = router;
