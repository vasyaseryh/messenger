document.querySelector(".burger").addEventListener("click", () => {
  document.querySelector(".left_vidvig_div").classList.toggle("active");
  document.querySelector(".pustoy_div").classList.toggle("active");
});
document.querySelector(".pustoy_div").addEventListener("click", () => {
  document.querySelector(".left_vidvig_div").classList.remove("active");
  document.querySelector(".pustoy_div").classList.remove("active");
});
document.querySelector(".slider").addEventListener("mousedown", (e) => {
  let slider = document.querySelector(".slider").getBoundingClientRect();
  if (e.clientX > slider.right - 10 && e.clientX < slider.right + 100) {
    function dvig(e) {
      document.body.addEventListener("mouseup", () => {
        document.body.removeEventListener("mousemove", dvig);
      });
      console.log(e.clientX);
      document.querySelector(".slider").style.width = e.clientX + "px";
    }
    document.body.addEventListener("mousemove", dvig);
  }
});

//работают с иконками и картинкой
document.querySelector(".gif_glaz").onclick = () => {
  let r = document.querySelector(".img_avatar").src;
  console.log(r);
  document.querySelector("#fullpage").style.backgroundImage = `url(${r})`;
  document.querySelector("#fullpage").style.display = "block";
};
document.querySelector(".div_avatar_and_glaz_strelka").onmouseover = function (
  event
) {
  document.querySelector(".div_avatar").style.zIndex = "1";
  document.querySelector(".div_glaz_strelka").style.zIndex = "2";
};
document.querySelector(".div_avatar_and_glaz_strelka").onmouseout = function (
  event
) {
  document.querySelector(".div_glaz_strelka").style.zIndex = "1";
  document.querySelector(".div_avatar").style.zIndex = "2";
};
document.querySelector(".gif_strelka").onclick = () => {
  document.querySelector(".inp_avatar").click();
};
