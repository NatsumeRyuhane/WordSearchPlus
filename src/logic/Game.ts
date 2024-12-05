import * as GameBoard from "./GameBoard";
import {Dispatch, SetStateAction} from "react";
import {Trie, buildTrie} from "./Trie";
import {getCellValue} from "./GameBoard";

// This script defines the function used to interact with the game, used both in handling player interactions
// and as a simple API for automatic solver
export function clickCell(targetLocation: [number, number],
                          [board, setBoard]: [GameBoard.GameBoard, Dispatch<SetStateAction<GameBoard.GameBoard>>],
                          [activePath, setActivePath]: [[number, number][], Dispatch<SetStateAction<[number, number][]>>],
                          [solutions, setSolutions]: [GameBoard.Solution[], Dispatch<SetStateAction<GameBoard.Solution[]>>]): void {

    let newBoard = {...board};
    let newActivePath = [...activePath];
    let newSolutions = [...solutions];

    // TODO: bugfix
    function calcHighlight(): void {
        newActivePath.forEach(([r, c]) => {
            const surroundings = [
                [r - 1, c - 1], [r - 1, c], [r - 1, c + 1],
                [r, c - 1],                     [r, c + 1],
                [r + 1, c - 1], [r + 1, c], [r + 1, c + 1]
            ].filter(([r, c]) => r >= 0 && r < newBoard.size && c >= 0 && c < newBoard.size);

            surroundings.forEach(([r, c]) => {
                newBoard = GameBoard.updateCellState(newBoard, r, c, GameBoard.CellStates.HIGHLIGHTED);
            });
        });
    }

    function commitChanges(): void {
        setBoard(newBoard);
        setActivePath(newActivePath);
        setSolutions(newSolutions);
    }


    function deselectCell(row: number, col: number): void {
        // check if this cell is part of a solution
        if (newSolutions.some(solution => solution.path.some(([r, c]) => r === row && c === col))) {
            // if it is, revert its state to IN_SOLUTION
            newBoard = GameBoard.updateCellState(newBoard, row, col, GameBoard.CellStates.IN_SOLUTION);
        } else {
            // otherwise, revert its state to NONE
            newBoard = GameBoard.updateCellState(newBoard, row, col, GameBoard.CellStates.NONE);
        }

        // remove it from the activePath
        newActivePath = newActivePath!.filter(([r, c]) => r !== row || c !== col);
    }

    function selectCell(row: number, col: number): void {
        newBoard = GameBoard.updateCellState(newBoard, row, col, GameBoard.CellStates.IN_PATH);
        newActivePath = newActivePath.concat([[row, col]]);
    }

    function updateSolution(): void {
        const activePathWord = GameBoard.getWordFromPath(newBoard, newActivePath);

        // see if the active path is a solution
        const isSolution = (newSolutions.find(solution => (solution.word === activePathWord && solution.path.length === 0)) !== undefined);

        if (isSolution) {
            newSolutions = newSolutions.map(solution => {
                if (solution.word === activePathWord) {
                    return {...solution, path: newActivePath};
                } else {
                    return solution;
                }
            });

            // mark the cells in the path as IN_SOLUTION
            for (const [r, c] of newActivePath) {
                newBoard = GameBoard.updateCellState(newBoard, r, c, GameBoard.CellStates.IN_SOLUTION);
            }

            clearSelection();
        }
    }

    function clearSelection() {
        // basically, clear the path
        newActivePath.forEach(
            ([r, c]) => {
                deselectCell(r, c);
            }
        );

    }

    const [row, col] = targetLocation;

    if (newActivePath.length === undefined || newActivePath.length === 0) {
        selectCell(row, col);
        commitChanges();
        return;
    }

    const [lastClickedRow, lastClickedCol] = newActivePath[newActivePath.length - 1];


    if (row === lastClickedRow && col === lastClickedCol) {
        deselectCell(row, col);
    } else if (Math.abs(row - lastClickedRow) <= 1 && Math.abs(col - lastClickedCol) <= 1) {
        // try to add this cell to the path

        // if the cell is already in path, let nothing happen
        if (newActivePath.some(([r, c]) => r === row && c === col)) return;

        // otherwise, add the cell to the path
        selectCell(row, col);
        updateSolution();

    } else {
        // if the cell is already in path, let nothing happen
        if (newActivePath.some(([r, c]) => r === row && c === col)) return;

        clearSelection();
    }

    commitChanges();
    return;
}

export function resetGame([board, setBoard]: [GameBoard.GameBoard, Dispatch<SetStateAction<GameBoard.GameBoard>>],
                          [activePath, setActivePath]: [[number, number][], Dispatch<SetStateAction<[number, number][]>>],
                          [solutions, setSolutions]: [GameBoard.Solution[], Dispatch<SetStateAction<GameBoard.Solution[]>>]): void {
    setActivePath([]);

    // clear the found solutions
    const s = solutions.map(solution => {
        // create a new solution, keep the words but clear the stored path
        return {...solution, path: []};
    });
    setSolutions(s);

    // reset the board
    const b = {
        ...board, board: board.board.map(row => row.map(cell => {
            return {...cell, state: GameBoard.CellStates.NONE};
        }))
    };
    setBoard(b);

}

export function autoSolve(board: GameBoard.GameBoard, solutions: GameBoard.Solution[]): [number, number][] {

    function getUnsolvedWordlist(): string[] {
        return solutions.filter(solution => !wordsFound.includes(solution.word)).map(solution => solution.word);
    }

    function buildTrieFromWordlist(wordlist): Trie {
        return buildTrie(wordlist);
    }

    function surroundingCells(cell: [number, number]): [number, number][] {
        const [row, col] = cell;
        return [
            [row - 1, col - 1] as [number, number], [row - 1, col] as [number, number], [row - 1, col + 1] as [number, number],
            [row, col - 1] as [number, number],                                         [row, col + 1] as [number, number],
            [row + 1, col - 1] as [number, number], [row + 1, col] as [number, number], [row + 1, col + 1] as [number, number]
        ].filter(([r, c]) => r >= 0 && r < board.size && c >= 0 && c < board.size);
    }

    const wordsFound = [];
    const totalWordCount = solutions.length;

    const cellClickOrder = []

    const root = [0, 0];

    function dfs(cell: [number, number], path: [number, number][]): void {
        let trie = buildTrieFromWordlist(getUnsolvedWordlist());

        cellClickOrder.push(cell);
        path.push(cell);

        const word = GameBoard.getWordFromPath(board, path);
        if (getUnsolvedWordlist().includes(word)) {
            wordsFound.push(word);
            console.log(`Found word: ${word}, solution: ${path}`);
            // update the tire to only focus on unfounded words
            trie = buildTrieFromWordlist(getUnsolvedWordlist());
            for (const c of path) {
                cellClickOrder.push(c);
            }
        }

        const nextChars = trie.nextChars(word);
        if (nextChars.length === 0) {
            cellClickOrder.push(cell);
            return;
        }

        for (const sc of surroundingCells(cell)) {
            const [r, c] = sc;
            if (nextChars.includes(getCellValue(board, r, c)) && !path.some(([pr, pc]) => pr === r && pc === c)) {
                dfs(sc, path.slice());
            }
        }

        cellClickOrder.push(cell);
        return;
    }


    while (getUnsolvedWordlist().length > 0 && root[0] < board.size) {
        dfs([root[0], root[1]], []);

        root[1]++;
        if (root[1] === board.size) {
            root[0]++;
            root[1] = 0;
        }
    }

    return cellClickOrder;
}