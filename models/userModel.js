const validator = require("validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: String,
    profile: String,
    authType: { type: String, required: true },
    verified: { type: Boolean, required: true },
  },
  { _id: true }
);

userSchema.statics.signup = async function (email, password, username) {
  // check field
  if (!email || !password || !username) throw Error("All field must be filled");

  // check if email valid
  if (!validator.isEmail(email)) throw Error("Email is not valid");

  const exists = await this.findOne({ email, authType: "password" });

  // check if email exists
  if (exists) throw Error("Email already exists!");

  // hash password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({
    email,
    password: hashedPassword,
    username,
    authType: "password",
    verified: false,
  });

  return user;
};

userSchema.statics.login = async function (email, password) {
  // check field
  if (!email || !password) throw Error("All field must be filled");

  // check if email valid
  if (!validator.isEmail(email)) throw Error("Email is not valid");

  const data = await this.findOne({ email, authType: "password" });

  // check if email exists
  if (!data) throw Error("Email not found");

  const compare = await bcrypt.compare(password, data.password);

  // check if password match
  if (!compare) throw Error("Password is incorrect");

  return data;
};

userSchema.statics.loginGoogle = async function (email, username, profile) {
  // check field
  if (!email || !username) throw Error("All field must be filled");

  // check if email valid
  if (!validator.isEmail(email)) throw Error("Email is not valid");

  const exists = await this.findOne({ email, authType: "google" });

  // check if email exists
  if (!exists) {
    const user = await this.create({
      email,
      username,
      profile,
      authType: "google",
      verified: true,
    });
    return user;
  }
  return exists;
};

module.exports = mongoose.model("User", userSchema);
