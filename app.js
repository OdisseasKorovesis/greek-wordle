const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");
const messageDisplay = document.querySelector(".message-container");
let wordle = "";
let dictionary = "empty";

const getWordle = () => {
  const request = new XMLHttpRequest();
  request.open("GET", "./5LetterWordDictionary.json", false);
  request.send(null);
  const acquiredDictionary = JSON.parse(request.responseText);

  const randomIndex = Math.floor(
    Math.random() * acquiredDictionary.fiveLetterWords.length
  );

  wordle = acquiredDictionary.fiveLetterWords[randomIndex];
  dictionary = acquiredDictionary;
  console.log("Η λέξη είναι: " + wordle);
};

window.onload = getWordle;


const keys = [
  "Ε",
  "Ρ",
  "Τ",
  "Υ",
  "Θ",
  "Ι",
  "Ο",
  "Π",
  "Α",
  "Σ",
  "Δ",
  "Φ",
  "Γ",
  "Η",
  "Ξ",
  "Κ",
  "Λ",
  "Ζ",
  "Χ",
  "ENTER",
  "Ψ",
  "Ω",
  "Β",
  "Ν",
  "Μ",
  "<<",
];

const guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement("div");
  rowElement.setAttribute("id", "guess-row-" + guessRowIndex);
  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement("div");
    tileElement.setAttribute(
      "id",
      "guess-row-" + guessRowIndex + "-tile-" + guessIndex
    );
    tileElement.classList.add("tile");
    rowElement.append(tileElement);
  });
  tileDisplay.append(rowElement);
});

keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.textContent = key;
  buttonElement.setAttribute("id", key);
  buttonElement.addEventListener("click", () => handleClick(key));
  keyboard.append(buttonElement);
});

const handleClick = (key) => {
  if (key === "<<") {
    deleteLetter();
    return;
  }

  if (key === "ENTER") {
    checkRow();
    return;
  }

  addLetter(key);
};

const addLetter = (letter) => {
  if (isGameOver) {
    return;
  }

  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      "guess-row-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;
    tile.setAttribute("data", letter);
    currentTile++;
  }
};

const deleteLetter = () => {
  if (isGameOver) {
    return;
  }

  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      "guess-row-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = "";
    guessRows[currentRow][currentTile] = " ";
    tile.setAttribute("data", " ");
  }
};

const checkRow = () => {
  if (isGameOver) {
    return;
  }

  const guess = guessRows[currentRow].join("");

  if (currentTile > 4) {
    if (!dictionary.fiveLetterWords.includes(guess)) {
      showMessage("Η λέξη δεν είναι έγκυρη.");
      return;
    }

    flipTile();
    if (wordle === guess) {
      showMessage("Συγχαρητήρια!");
      isGameOver = true;
      return;
    } else {
      if (currentRow >= 5) {
        isGameOver = true;
        showMessage("Σας τελείωσαν οι προσπάθειες! Η λέξη ήταν: " + wordle);
      }
      if (currentRow < 5) {
        currentRow++;
        currentTile = 0;
      }
    }
  }
};

const showMessage = (message) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messageDisplay.append(messageElement);
  setTimeout(() => messageDisplay.removeChild(messageElement), 2000);
};

const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter);
  key.classList.add(color);
};

const flipTile = () => {
  const rowTiles = document.querySelector(
    "#guess-row-" + currentRow
  ).childNodes;
  let checkWordle = wordle;
  const guess = [];

  rowTiles.forEach((tile) => {
    guess.push({
      letter: tile.getAttribute("data"),
      color: "grey-overlay",
    });
  });

  guess.forEach((guess, index) => {
    if (guess.letter == wordle[index]) {
      guess.color = "green-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "yellow-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });
};
