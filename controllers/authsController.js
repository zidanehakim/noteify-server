const randomstring = require("randomstring");
const Auths = require("../models/authsModel");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

const matchCode = async (req, res, next) => {
  const { email } = req.email;
  const { code } = req.body;

  const data = await Auths.findOne({ email });

  if (!data) res.status(400).json({ error: "No verification code" });

  const compare = code === data.code;
  const dataUser = await User.findOneAndUpdate(
    { email, verified: false },
    { $set: { verified: compare } },
    { new: true }
  );

  res.status(200).json({
    username: dataUser.username,
    email: dataUser.email,
    match: compare,
  });
};

const generateCode = async (req, res, next) => {
  const { email } = req.email;
  const code = randomstring.generate({
    length: 5,
    capitalization: "uppercase",
  });

  const data = await Auths.findOne({ email });

  if (data)
    await Auths.findOneAndUpdate({ email }, { $set: { code } }, { new: true });
  else await Auths.create({ email, code });

  const newData = await Auths.findOne({ email });

  const response = await sendEmailCode(code, email);

  res
    .status(200)
    .json({ mssg: `Message sent: %s", ${response.messageId}`, newData });
};

const generateUrl = async (req, res, next) => {
  const { email } = req.body;
  const url = randomstring.generate(32);

  const data = await Auths.findOne({ email });

  if (data)
    await Auths.findOneAndUpdate({ email }, { $set: { url } }, { new: true });
  else await Auths.create({ email, url });

  const newData = await Auths.findOne({ email });

  const response = await sendEmailUrl(url, email);

  res
    .status(200)
    .json({ mssg: `Message sent: %s", ${response.messageId}`, newData });
};

const sendEmailCode = async (code, email) => {
  // send mail with defined transport object
  try {
    const info = transporter.sendMail({
      from: { name: "Noteify", address: process.env.AUTH_EMAIL },
      to: email,
      subject: "Noteify - Request for authentication code",
      text: `Your verification code is ${code}, code only lasts for 10 minutes.`,
    });
    return info;
  } catch (error) {
    return error;
  }
};

const sendEmailUrl = async (url, email) => {
  // send mail with defined transport object
  try {
    const info = transporter.sendMail({
      from: { name: "Noteify", address: process.env.AUTH_EMAIL },
      to: email,
      subject: "Noteify - Request for reset password",
      html: `<p>Here is your reset password link <a href="https://noteify-io.netlify.app/reset-password?token=${url}">Click here</a> note that the link only valid for 10 minutes.</p>`,
    });
    return info;
  } catch (error) {
    return error;
  }
};

module.exports = { generateCode, matchCode, generateUrl };
