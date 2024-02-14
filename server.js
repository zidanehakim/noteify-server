require("dotenv").config();

const cors = require("cors");
const express = require("express");
const allTasksRoutes = require("./routes/allTasksRouter");
const userRoutes = require("./routes/userRouter");
const authsRouter = require("./routes/authsRouter");
const mongoose = require("mongoose");

// Express app
const app = express();

app.use(express.json());
app.use(cors({ origin: "https://noteify-io.netlify.app", credentials: true }));

app.use("/planner", allTasksRoutes);
app.use("/users", userRoutes);
app.use("/authentication", authsRouter);

// connect to db
mongoose.connect(process.env.MONGO_URI);

// Listen for requests
app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("listening on port 4000");
});
