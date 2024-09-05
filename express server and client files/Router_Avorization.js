const Router = require("express");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { secret } = require("./config");
const User = require("./User");
const router = new Router();
const Avatar = require("./Avatar");

const generateToken = (id, username, password) => {
  const payload = {
    id,
    username,
    password,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};
router.post("/registr", function (req, res) {
  async function run() {
    try {
      let { username, password } = req.body;

      const results = await User.findOne({ username: username });

      if (results) {
        return res.json({ message: "Такой пользователь уже есть" });
      }

      const hashPassword = bcryptjs.hashSync(password, 7);
      const avatar = new Avatar({
        href: "img_for_avatar\\\\first_img",
      });
      await avatar.save();
      const user = new User({
        username: username,
        password: hashPassword,
        avatar_id: avatar._id,
      });

      await user.save();

      res.json({ message: "Пользователь успешно зарегестрирован" });
    } catch (err) {
      console.log(err);
    }
  }
  run().catch(console.error);
});
router.post("/login", function (req, res) {
  async function run() {
    try {
      let { username, password } = req.body;

      const user = await User.findOne({ username: username });
      console.log(user);
      if (!user) {
        return res.json({ message: "Пользователь не найден" });
      }
      const validPassword = bcryptjs.compareSync(password, user.password);
      if (!validPassword) {
        return res.json({ message: "Неверный пароль" });
      }

      const token = generateToken(user._id, user.username, user.password);
      console.log(token);

      return res.json({ token: token, username: user.username });
    } catch (err) {
      console.log(err);
    }
  }
  run().catch(console.error);
});
router.post("/prove", function (req, res) {
  async function run() {
    try {
      let token = req.body.token;

      let bob = jwt.verify(token, secret);
      let name = bob.username;

      res.json({ name: name, location: "main" });
    } catch (err) {
      console.log(err);
    }
  }
  run().catch(console.error);
});

module.exports = router;
