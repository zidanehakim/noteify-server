const express = require("express");
const {
  generateCode,
  matchCode,
  generateUrl,
} = require("../controllers/authsController");
const requireAuth = require("../middleware/requireAuth");
const cookieParser = require("cookie-parser");

const router = express.Router();

// Cookie handler
router.use(cookieParser());

// POST
router.post("/generate-url", generateUrl);

// Check token authorization and get _id
router.use(requireAuth);

// POST
router.post("/match-code", matchCode);

// POST
router.post("/generate-code", generateCode);

module.exports = router;
