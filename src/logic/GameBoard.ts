// Description:
// words are placed in meaningful patterns such as horizontal, vertical, diagonal, circular paths
// Then fill the empty spaces with random letters

export enum CellStates {
    NONE, IN_PATH, HIGHLIGHTED, IN_SOLUTION
}

export enum CellPlacementDirections {
    HORIZONTAL, VERTICAL, DIAGONAL, CIRCULAR
}

interface BoardCell {
    val: string
    state: CellStates
}

export interface GameBoard {
    size: number,
    board: BoardCell[][]
}

export function getCellValue(board: GameBoard, row: number, col: number): string | undefined {
    return board.board[row][col].val;
}

export function getCellState(board: GameBoard, row: number, col: number): CellStates | undefined {
    return board.board[row][col].state;
}

// Update the state of a cell in the board, returns a new board for react to update
export function updateCellState(board: GameBoard, row: number, col: number, state: CellStates): GameBoard {
    return {
        ...board, board: board.board.map((r, i) => r.map((c, j) => {
            if (i === row && j === col) {
                return {...c, state};
            } else {
                return c;
            }
        }))
    }
}

function overwriteCellValue(board: GameBoard, row: number, col: number, val: string): void {
    if (row < 0 || row >= board.size || col < 0 || col >= board.size) return;

    board.board[row][col].val = val;
}

export function copyBoard(board: GameBoard): GameBoard {
    return {
        size: board.size,
        board: board.board.map((row) => row.map((cell) => ({...cell})))
    }
}

export function initializeBoard(words: string[], size: number = 10): GameBoard {
    console.trace();
    const board = generateEmptyBoard(size);
    placeWordsOnBoard(board, words);
    fillBoardWithRandomLetters(board);
    return board;
}

function generateEmptyBoard(size: number = 10): GameBoard {
    const board = [];
    for (let i = 0; i < size; i++) {
        board.push(new Array(size));
        for (let j = 0; j < size; j++) {
            board[i][j] = {val: "", state: CellStates.NONE};
        }
    }
    return {size, board};
}

function placeWordsOnBoard(board: GameBoard, words: string[]): void {
    console.trace();
    words.forEach((word) => {
        let placed = false;

        while (!placed) {
            const direction = // select a random direction
                Math.floor(Math.random() * 4) as CellPlacementDirections;

            const startRow = Math.floor(Math.random() * board.size);
            const startCol = Math.floor(Math.random() * board.size);

            if (canPlaceWord(board, word, startRow, startCol, direction)) {
                placeWord(board, word, startRow, startCol, direction);
                placed = true;
            }
        }
    });
}

function canPlaceWord(board: GameBoard, word: string, row: number, col: number, direction: CellPlacementDirections): boolean {
    if (direction === CellPlacementDirections.HORIZONTAL) {
        if (col + word.length > board.size) return false;
        for (let i = 0; i < word.length; i++) {
            if (getCellValue(board, row, col + i) !== "") return false;
        }
    } else if (direction === CellPlacementDirections.VERTICAL) {
        if (row + word.length > board.size) return false;
        for (let i = 0; i < word.length; i++) {
            if (getCellValue(board, row + i, col) != "") return false;
        }
    } else if (direction === CellPlacementDirections.DIAGONAL) {
        if (row + word.length > board.size || col + word.length > board.size) return false;
        for (let i = 0; i < word.length; i++) {
            if (getCellValue(board, row + i, col + i) !== "") return false;
        }
    } else if (direction === CellPlacementDirections.CIRCULAR) {
        return canPlaceCircular(board, word, row, col);
    }
    return true;
}

function placeWord(board: GameBoard, word: string, row: number, col: number, direction: CellPlacementDirections): void {
    if (direction === CellPlacementDirections.HORIZONTAL) {
        for (let i = 0; i < word.length; i++) {
            overwriteCellValue(board, row, col + i, word[i]);
        }
    } else if (direction === CellPlacementDirections.VERTICAL) {
        for (let i = 0; i < word.length; i++) {
            overwriteCellValue(board, row + i, col, word[i]);
        }
    } else if (direction === CellPlacementDirections.DIAGONAL) {
        for (let i = 0; i < word.length; i++) {
            overwriteCellValue(board, row + i, col + i, word[i]);
        }
    } else if (direction === CellPlacementDirections.CIRCULAR) {
        placeCircular(board, word, row, col);
    }
}

// Check if a word can be placed in a circular path
function canPlaceCircular(board: GameBoard, word: string, row: number, col: number): boolean {
    const length = word.length;
    const maxRow = row + length;
    const maxCol = col + length;

    if (maxRow > board.size || maxCol > board.size || row < 0 || col < 0) {
        return false;
    }

    // Check circular boundary: Top row, right column, bottom row, left column
    for (let i = 0; i < length; i++) {
        // Top row
        if (col + i < board.size && getCellValue(board, row, col + i) !== "") return false;
        // Right column
        if (row + i < board.size && getCellValue(board, row + i, maxCol - 1) !== "") return false;
        // Bottom row
        if (maxRow - 1 < board.size && getCellValue(board, maxRow - 1, maxCol - 1 - i) !== "") return false;
        // Left column
        if (maxRow - 1 - i >= 0 && getCellValue(board, maxRow - 1 - i, col) !== "") return false;
    }
    return true;
}

// Place a word in a circular path
function placeCircular(board: GameBoard, word: string, row: number, col: number): void {
    const length = word.length;

    for (let i = 0; i < length; i++) {
        // Top row
        if (col + i < board.size) overwriteCellValue(board, row, col + i, word[i]);
        // Right column
        else if (row + i < board.size) overwriteCellValue(board, row + i, col + length - 1, word[i]);
        // Bottom row
        else if (col + length - 1 - i >= 0) overwriteCellValue(board, row + length - 1, col + length - 1 - i, word[i]);
        // Left column
        else overwriteCellValue(board, row + length - 1 - i, col, word[i]);
    }
}

export function fillBoardWithRandomLetters(board: GameBoard): void {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let row = 0; row < board.size; row++) {
        for (let col = 0; col < board.size; col++) {
            if (getCellValue(board, row, col) === "") {
                overwriteCellValue(board, row, col, alphabet[Math.floor(Math.random() * alphabet.length)]);
            }
        }
    }
}
