const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const authsModel = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    code: String,
    url: String,
    createdAt: {
      type: Date,
      expires: "10m",
      default: Date.now,
    },
  },
  { _id: true }
);

module.exports = mongoose.model("Auths", authsModel);
