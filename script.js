let list = [];
let word = "";

let board = document.getElementById("board");
let msg = document.getElementById("msg");
let btn = document.getElementsByClassName("reset")[0];

let row = 0;
let col = 0;
let guess = "";

async function loadWords() {
  let res = await fetch(
    "https://raw.githubusercontent.com/tabatkins/wordle-list/main/words"
  );
  let text = await res.text();
  list = text.split("\n");
}

function pickWord() {
  word = list[Math.floor(Math.random() * list.length)];
}

function build() {
  board.innerHTML = "";
  for (let i = 0; i < 30; i++) {
    let d = document.createElement("div");
    d.className = "tile";
    board.appendChild(d);
  }
}

async function clear() {
  row = 0;
  col = 0;
  guess = "";
  msg.textContent = "";
  pickWord();
  build();
  document.body.focus();
}

async function start() {
  await loadWords();
  pickWord();
  build();
}

start();



window.addEventListener("keydown", e => {
  if (!word) return;

  if (e.ctrlKey && e.key === "Enter") {
    clear();
    return;
  }

  if (row === 6) return;

  if (e.key === "Backspace" && col > 0) {
    col--;
    guess = guess.slice(0, -1);
    board.children[row * 5 + col].textContent = "";
  }

  if (e.key === "Enter" && guess.length === 5) {
    check();
    return;
  }

  if (/^[a-z]$/.test(e.key) && col < 5) {
    board.children[row * 5 + col].textContent = e.key;
    guess += e.key;
    col++;
  }
});

function check() {
  let temp = word.split("");

  for (let i = 0; i < 5; i++) {
    let t = board.children[row * 5 + i];
    if (guess[i] === word[i]) {
      t.classList.add("green");
      temp[i] = "";
    }
  }

  for (let i = 0; i < 5; i++) {
    let t = board.children[row * 5 + i];
    if (!t.classList.contains("green")) {
      if (temp.includes(guess[i])) {
        t.classList.add("yellow");
        temp[temp.indexOf(guess[i])] = "";
      } else {
        t.classList.add("gray");
      }
    }
  }

  if (guess === word) {
    msg.textContent = "You win 🧠";
    row = 6;
    setTimeout(clear, 5000);
    return;
  }

  row++;
  col = 0;
  guess = "";

  if (row === 6) {
    msg.textContent = "Word was: " + word;
    setTimeout(clear, 2500);
  }
}
