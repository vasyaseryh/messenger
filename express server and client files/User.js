const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const User = new Schema({
  username: { type: String },
  password: { type: String },
  avatar_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "avatars",
  },
  sms: [
    {
      him_name: String,
      // my_text: String,
      // him_text: String,
      obsh_text: String,
    },
  ],
});

module.exports = model("User", User);
