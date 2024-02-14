const express = require("express");
const { getTasks, updateTasks } = require("../controllers/allTasksController");
const requireAuth = require("../middleware/requireAuth");
const cookieParser = require("cookie-parser");

const router = express.Router();

// Cookie handler
router.use(cookieParser());

// Check token authorization and get _id
router.use(requireAuth);

// GET
router.get("/", getTasks);

// POST

// UPDATE
router.put("/", updateTasks);

// DELETE
// router.delete("/:id", createAllTasks);

module.exports = router;
