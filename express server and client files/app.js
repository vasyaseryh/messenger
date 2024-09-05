const express = require("express");
const mongoose = require("mongoose");
const Router_Avorization = require("./Router_Avorization");
const Router_Main = require("./Router_Main");
const jwt = require("jsonwebtoken");
const { secret } = require("./config");
const multer = require("multer");
const path = require("path");
const User = require("./User");
const Avatar = require("./Avatar");

const url =
  "mongodb://127.0.0.1:27017/example2?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.10";

const start = async () => {
  try {
    await mongoose.connect(url);
    app.listen(4000);
  } catch (e) {
    console.log(e);
  }
};

start();
const app = express();

app.use("/img", express.static(__dirname + "/img"));
app.use("/img_for_avatar", express.static(__dirname + "/img_for_avatar"));
app.use("/index", express.static(__dirname + "/index"));
app.use("/main", express.static(__dirname + "/main"));
app.use(express.static(__dirname + "/"));
app.use(express.json());
app.get("/", (req, res) => {
  res.redirect("/auth");
});
app.get(
  "/auth",

  (_, response) => {
    response.sendFile(__dirname + "/index/index.html");
  }
);
app.use("/auth", Router_Avorization);

app.get("/main", function (req, res) {
  async function run() {
    try {
      let token = req.query.TOKEN;

      let bob = jwt.verify(token, secret);

      res.sendFile(__dirname + "/main/main.html");
    } catch (err) {
      res.status(403).json({ message: "У вас нет доступа" });
      console.log(err);
    }
  }
  run().catch(console.error);
});
app.use("/main", Router_Main);
