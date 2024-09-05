window.onload = async () => {
  const TOKEN = localStorage.getItem("token");
  if (TOKEN) {
    console.log(TOKEN);
    const response = await fetch("/auth/prove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ token: TOKEN }),
    });
    const data = await response.json();
    let location = data.location;
    let name = data.name;

    let inp_avtoriz1 = document.querySelector(".inp_avtoriz1");
    let inp_avtoriz2 = document.querySelector(".inp_avtoriz2");
    inp_avtoriz1.value = name;
    inp_avtoriz2.value = "***";
    inp_avtoriz2.addEventListener("keyup", (e) => {
      if (
        e.keyCode == 13 &&
        inp_avtoriz1.value == name &&
        inp_avtoriz2.value == "***"
      ) {
        window.location.href =
          "http://localhost:4000/" + data.location + `?TOKEN=${TOKEN}`;
      }
    });
  }
};

let inp_avtoriz2 = document.querySelector(".inp_avtoriz2");
inp_avtoriz2.addEventListener("keyup", async (e) => {
  if (e.keyCode == 13) {
    let inp_avtoriz1 = document.querySelector(".inp_avtoriz1").value;
    let inp_avtoriz2 = document.querySelector(".inp_avtoriz2").value;
    let user = {
      username: inp_avtoriz1,
      password: inp_avtoriz2,
    };
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    console.log(data.message);
    if (data.token) {
      console.log(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
    }
  }
});
let p_avtoriz1 = document.querySelector(".p_avtoriz1");
p_avtoriz1.onclick = () => {
  document.querySelector(".registr").style.display = "flex";
};
let p_registr1 = document.querySelector(".p_registr1");
p_registr1.onclick = async () => {
  let inp_registr1 = document.querySelector(".inp_registr1").value;
  let inp_registr2 = document.querySelector(".inp_registr2").value;
  let user = {
    username: inp_registr1,
    password: inp_registr2,
  };

  const response = await fetch("/auth/registr", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  console.log(data.message);
};
