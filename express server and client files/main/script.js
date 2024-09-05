// import { poisk } from "./posik_in_bd_and_otobraj_name.js";

//ДЕЛАТЬ ЗАМЕНУ LOCALHOST ИНАЧЕ ПРИ ПОВТОРНОЙ ЛОГИНИЗАЦИИ ВСЕ РУХНЕТ
//первая функция для сокета
let my_func1;
//вторая функция для сокета
let my_func2;
let value;

let komy = "";
let username = "";
let obsh_text = "";
function inp_otpravka() {
  console.log("DDDDD");
  let inp = document.createElement("input");
  inp.className = "inp_for_otpravka";

  inp.addEventListener("change", () => {
    console.log("DDDDD");
    let p = document.createElement("p");

    value = inp.value;
    p.innerHTML = value;

    p.className = "p_my_sms";

    document.querySelector(".second_big_div").append(p);

    my_func2();
  });
  document.querySelector(".second_big_div").append(inp);
}
//функция для отображения боковой панели и инпута
function some_func(e) {
  console.log("DDDDDDDDDDDDDDDDDDDDDDDDDD");
  func_sms(e);
  inp_otpravka(e);
}
//осуществляет поиск в базе данных

async function poisk() {
  let value = document.querySelector(".poisk").value;

  let a = { value: value };
  const response = await fetch("/main/poisk", {
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(a),
  });
  const res = await response.json();

  if (res.name) {
    console.log(res.name);
    let div = document.createElement("div");
    komy = res.name;
    div.innerHTML = res.name;
    div.style.backgroundColor = "white";
    div.style.width = "100%";
    div.className = "dont_know";

    document.querySelector(".second_big_div").append(div);
    document.querySelector(".dont_know").addEventListener("click", (e) => {
      document.querySelector(
        ".second_big_div"
      ).className += ` ${e.target.innerHTML}`;
      e.target.remove();
      some_func();
    });
  }
}

document.querySelector(".poisk").addEventListener("change", poisk);

//тут я остановился!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//при нажатии на блоки с именами появляется переписка
async function func_sms(e) {
  let a = { username: username, him_name: komy };

  const response = await fetch("/main/get_sms", {
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(a),
  });
  const res = await response.json();

  while (document.querySelector(".second_big_div").children[1]) {
    document.querySelector(".second_big_div").children[1].remove();
  }

  function add_p(param, text) {
    let p = document.createElement("p");
    p.className = param;
    p.innerHTML = text;
    document.querySelector(".second_big_div").append(p);
  }
  let obsh_text = res.obsh_text.split("{{!}}");
  console.log(obsh_text);

  for (let i = 0; i < obsh_text.length; i++) {
    if (obsh_text[i] == "(l)") {
      let text = obsh_text[i + 1];

      add_p("p_him_sms", text);
    } else if (obsh_text[i] == "(r)") {
      let text = obsh_text[i + 1];
      add_p("p_my_sms", text);
    }
  }
}
// socket
let connection = new WebSocket("ws://localhost:9000");

connection.onopen = async function (e) {
  username = localStorage.getItem("username");
  my_func1 = () => {
    let user = {
      type: "register",
      id: username,
    };

    connection.send(JSON.stringify(user));
  };
  my_func1();
  my_func2 = () => {
    console.log(value);
    let user = {
      type: "not_r",
      komy: komy,
      text: value,
      id: username,
    };

    connection.send(JSON.stringify(user));
  };

  connection.onmessage = (event) => {
    let second_class_of_second_big_div =
      document.querySelector(".second_big_div").className;
    if (second_class_of_second_big_div.split(" ").length == 2) {
      let p = document.createElement("p");
      p.innerHTML = event.data;
      obsh_text += "(l) " + event.data + " ";
      p.className = "p_him_sms";
      document.querySelector(".second_big_div").append(p);
    }
  };
};

window.onload = async () => {
  const TOKEN = localStorage.getItem("token");

  console.log(TOKEN);
  let a = { token: TOKEN };
  const response = await fetch("/main/ava", {
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(a),
  });
  const res = await response.json();
  console.log(res.him_name);
  for (let i = 0; i < res.him_name.length; i++) {
    let div = document.createElement("div");
    div.className = "divs_komy";
    div.innerHTML = res.him_name[i];
    div.addEventListener("click", (e) => {
      document.querySelector(
        ".second_big_div"
      ).className += ` ${e.target.innerHTML}`;
      komy = e.target.innerHTML;
      some_func();
    });
    document.querySelector(".slider").append(div);
  }

  let href = res.href.split("\\")[2];
  console.log(href);
  document.querySelector(".img_avatar").src = "img_for_avatar/" + href + ".png";
};
