const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const Avatar = new Schema({
  href: String,
});

module.exports = model("Avatar", Avatar);
