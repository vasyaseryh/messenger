export async function poisk() {
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
    document.querySelector(".dont_know").addEventListener("click", some_func);
  }
}
