const WebSocket = require("ws");
const mongoose = require("mongoose");
const User = require("./User");
const wss = new WebSocket.Server({ port: 9000 });
const userSockets = {}; // Словарь сопоставляющий пользователя и его сокет

wss.on("connection", (ws) => {
  const url =
    "mongodb://127.0.0.1:27017/example2?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.10";
  const start = async () => {
    try {
      await mongoose.connect(url);
    } catch (e) {
      console.log(e);
    }
  };

  start();
  let userID; // Идентификатор сокета пользователя

  ws.on("message", (message) => {
    const { type } = JSON.parse(message);

    if (type === "register") {
      const { id } = JSON.parse(message);

      userID = id; // Сохраняем ассоциацию идентификатора пользователя
      userSockets[userID] = ws; // Привязываем сокет к пользователю
    } else {
      const { komy, text, id } = JSON.parse(message);

      sendToUser(komy, text, id);
    }
  });

  ws.on("close", () => {
    delete userSockets[userID]; // При отключении удаляем сокет пользователя из словаря
  });
});

async function sendToUser(komy, text, id) {
  const ws = userSockets[komy];
  if (ws) ws.send(text);
  console.log(komy, id, text);
  const user = await User.findOne({ username: id });
  let a = 0;
  let user_sms = user.sms;

  for (let i = 0; i < user.sms.length; i++) {
    if (user.sms[i].him_name == komy) {
      a = 1;
      user_sms[i].obsh_text += `(r){{!}}${text}{{!}}`;
    } else {
      a = 0;
    }
  }

  if (a == 0) {
    user_sms.push({
      him_name: komy,
      obsh_text: `(r){{!}}${text}{{!}}`,
    });
  }
  const user_update = await User.findOneAndUpdate(
    { username: id },
    { sms: user_sms }
  );

  const komy1 = await User.findOne({ username: komy });
  let b = 0;
  let komy1_sms = komy1.sms;

  for (let i = 0; i < komy1.sms.length; i++) {
    if (komy1.sms[i].him_name == id) {
      komy1_sms[i].obsh_text += `(l){{!}}${text}{{!}}`;
      b = 1;
    } else {
      b = 0;
    }
  }

  if (b == 0) {
    komy1_sms.push({
      him_name: id,
      obsh_text: `(l){{!}}${text}{{!}}`,
    });
  }
  const use_update = await User.findOneAndUpdate(
    { username: komy },
    { sms: komy1_sms }
  );
  // Отправляем сообщение через сокет пользователя
}
