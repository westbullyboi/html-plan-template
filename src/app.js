const input = document.querySelector("#name");
const title = document.querySelector("#greeting");

const render = (name) => {
  title.textContent = `こんにちは、${name || "ゲスト"}さん！`;
};

input.addEventListener("input", (e) => render(e.target.value.trim()));
render("");
