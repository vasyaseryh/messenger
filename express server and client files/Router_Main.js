const Router = require("express");
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { secret } = require("./config");
const router = new Router();
const User = require("./User");
const multer = require("multer");
const Avatar = require("./Avatar");
const path = require("path");

router.post("/poisk", async function (req, res) {
  let { value } = req.body;
  const user = await User.findOne({ username: value });

  if (user) {
    res.json({ name: value });
  }
});

router.post("/get_sms", async function (req, res) {
  let { username, him_name, obsh_text } = req.body;
  const user = await User.findOne({ username: username });
  for (let i = 0; i < user.sms.length; i++) {
    if (user.sms[i].him_name == him_name) {
      res.json({
        obsh_text: user.sms[i].obsh_text,
      });
      return false;
    }
  }
});
router.post("/ava", function (req, res) {
  async function run() {
    try {
      let { token } = req.body;
      console.log(token);

      let bob = jwt.verify(token, secret);
      const user = await User.findById(bob.id);

      const avatar = await Avatar.findById(user.avatar_id);
      let him_names = [];
      for (let i = 0; i < user.sms.length; i++) {
        him_names[i] = user.sms[i].him_name;
      }
      res.json({
        href: avatar.href,

        him_name: him_names,
      });
    } catch (err) {
      console.log(err);
    }
  }
  run().catch(console.error);
});

let uniqueSuffix;
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "main/img_for_avatar");
  },
  filename: function (req, file, cb) {
    uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

router.use(multer({ storage: storageConfig }).single("logo"));
router.post("/upload", function (req, res, next) {
  async function run() {
    try {
      let filedata = req.file;
      let token = req.body.token;

      let bob = jwt.verify(token, secret);
      let id = bob.id;

      const user = await User.findById(id);

      const avatar = await Avatar.findById(user.avatar_id);

      fs.unlink(avatar.href + ".png", (error) => {
        if (error) return console.log(error); // если возникла ошибка
        console.log("File deleted");
      });
      await Avatar.findByIdAndUpdate(user.avatar_id, {
        href: "img_for_avatar\\\\" + uniqueSuffix,
      });

      res.json({ id: id });
    } catch (err) {
      console.log(err);
    }
  }
  run().catch(console.error);
});
module.exports = router;
