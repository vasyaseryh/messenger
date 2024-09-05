document.querySelector(".inp_avatar").addEventListener("change", upload);
async function upload() {
  const body = new FormData();
  const file = document.querySelector(".inp_avatar").files[0];
  const TOKEN = localStorage.getItem("token");
  if (file) {
    body.append("logo", file);
    body.append("token", TOKEN);
    const response = await fetch("/main/upload", {
      method: "post",
      body,
    });
    const res = await response.json();
    console.log(res);
  } else {
    alert("Please select the file! ");
  }
}
