// Description:
// words are placed in meaningful patterns such as horizontal, vertical, diagonal, circular paths
// Then fill the empty spaces with random letters
const BOARD_SIZE = 10;

export function generateEmptyBoard() {
  const board = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    board.push(new Array(BOARD_SIZE).fill(""));
  }
  return board;
}

export function placeWordsOnBoard(board, words) {
  const directions = ["horizontal", "vertical", "diagonal", "circular"];

  words.forEach((word) => {
    let placed = false;

    while (!placed) {
      const direction =
        directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * BOARD_SIZE);
      const startCol = Math.floor(Math.random() * BOARD_SIZE);

      if (canPlaceWord(board, word, startRow, startCol, direction)) {
        placeWord(board, word, startRow, startCol, direction);
        placed = true;
      }
    }
  });
}

function canPlaceWord(board, word, row, col, direction) {
  if (direction === "horizontal") {
    if (col + word.length > BOARD_SIZE) return false;
    for (let i = 0; i < word.length; i++) {
      if (board[row][col + i] !== "") return false;
    }
  } else if (direction === "vertical") {
    if (row + word.length > BOARD_SIZE) return false;
    for (let i = 0; i < word.length; i++) {
      if (board[row + i][col] !== "") return false;
    }
  } else if (direction === "diagonal") {
    if (row + word.length > BOARD_SIZE || col + word.length > BOARD_SIZE)
      return false;
    for (let i = 0; i < word.length; i++) {
      if (board[row + i][col + i] !== "") return false;
    }
  } else if (direction === "circular") {
    return canPlaceCircular(board, word, row, col);
  }
  return true;
}

function placeWord(board, word, row, col, direction) {
  if (direction === "horizontal") {
    for (let i = 0; i < word.length; i++) {
      board[row][col + i] = word[i];
    }
  } else if (direction === "vertical") {
    for (let i = 0; i < word.length; i++) {
      board[row + i][col] = word[i];
    }
  } else if (direction === "diagonal") {
    for (let i = 0; i < word.length; i++) {
      board[row + i][col + i] = word[i];
    }
  } else if (direction === "circular") {
    placeCircular(board, word, row, col);
  }
}

// Check if a word can be placed in a circular path
function canPlaceCircular(board, word, row, col) {
  const length = word.length;
  const maxRow = row + length;
  const maxCol = col + length;

  if (maxRow > BOARD_SIZE || maxCol > BOARD_SIZE || row < 0 || col < 0) {
    return false;
  }

  // Check circular boundary: Top row, right column, bottom row, left column
  for (let i = 0; i < length; i++) {
    // Top row
    if (col + i < BOARD_SIZE && board[row][col + i] !== "") return false;
    // Right column
    if (row + i < BOARD_SIZE && board[row + i][maxCol - 1] !== "") return false;
    // Bottom row
    if (maxRow - 1 < BOARD_SIZE && board[maxRow - 1][maxCol - 1 - i] !== "")
      return false;
    // Left column
    if (maxRow - 1 - i >= 0 && board[maxRow - 1 - i][col] !== "") return false;
  }
  return true;
}

// Place a word in a circular path
function placeCircular(board, word, row, col) {
  const length = word.length;

  for (let i = 0; i < length; i++) {
    // Top row
    if (col + i < BOARD_SIZE) board[row][col + i] = word[i];
    // Right column
    else if (row + i < BOARD_SIZE) board[row + i][col + length - 1] = word[i];
    // Bottom row
    else if (col + length - 1 - i >= 0)
      board[row + length - 1][col + length - 1 - i] = word[i];
    // Left column
    else board[row + length - 1 - i][col] = word[i];
  }
}

export function fillBoardWithRandomLetters(board) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === "") {
        board[row][col] = alphabet.charAt(
          Math.floor(Math.random() * alphabet.length)
        );
      }
    }
  }
}
