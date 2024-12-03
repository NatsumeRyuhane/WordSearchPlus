import * as GameBoard from "./GameBoard";
import {Dispatch, SetStateAction} from "react";

// This script defines the function used to interact with the game, used both in handling player interactions
// and as a simple API for automatic solver
export function clickCell(targetLocation: [number, number],
                          [board, setBoard]: [GameBoard.GameBoard, Dispatch<SetStateAction<GameBoard.GameBoard>>],
                          [activePath, setActivePath]: [[number, number][], Dispatch<SetStateAction<[number, number][]>>],
                          [solutions, setSolutions]: [GameBoard.Solution[], Dispatch<SetStateAction<GameBoard.Solution[]>>]): void {

    let newBoard = {...board};
    let newActivePath = [...activePath];
    let newSolutions = [...solutions];

    function commitChanges(): void {
        setBoard(newBoard);
        setActivePath(newActivePath);
        setSolutions(newSolutions);
    }

    console.log(`Clicked cell ${GameBoard.getCellValue(newBoard, targetLocation[0], targetLocation[1])} at ${targetLocation}`);
    console.log(`Active path: ${JSON.stringify(newActivePath)} length: ${newActivePath.length}`);


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
                    return { ...solution, path: newActivePath };
                } else {
                    return solution;
                }
            });

            // mark the cells in the path as IN_SOLUTION
            for (const [r, c] of newActivePath) {
                newBoard = GameBoard.updateCellState(newBoard, r, c, GameBoard.CellStates.IN_SOLUTION);
            }

            // clear the active path
            newActivePath = [];
        }
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
        commitChanges();
        return;
    } else if (Math.abs(row - lastClickedRow) <= 1 && Math.abs(col - lastClickedCol) <= 1) {
        // try to add this cell to the path

        // if the cell is already in path, let nothing happen
        if (newActivePath.some(([r, c]) => r === row && c === col)) return;

        // otherwise, add the cell to the path
        selectCell(row, col);
        updateSolution();
        commitChanges();
        return;
    } else {
        // if the cell is not adjacent to the last cell, deselect each cell in the path
        // basically, clear the path
        newActivePath.forEach(
            ([r, c]) => {
                console.log(`Deselecting cell at ${r}, ${c}`);
                deselectCell(r, c);
            }
        );

        commitChanges();
        return;
    }
}

export function resetGame([board, setBoard]: [GameBoard.GameBoard, Dispatch<SetStateAction<GameBoard.GameBoard>>],
                           [activePath, setActivePath]: [[number, number][], Dispatch<SetStateAction<[number, number][]>>],
                           [solutions, setSolutions]: [GameBoard.Solution[], Dispatch<SetStateAction<GameBoard.Solution[]>>]): void {
    setActivePath([]);

    // clear the found solutions
    const s = solutions.map(solution => {
        // create a new solution, keep the words but clear the stored path
        return { ...solution, path: [] };
    });
    setSolutions(s);

    // reset the board
    const b = {
        ...board, board: board.board.map(row => row.map(cell => {
            if (cell.state === GameBoard.CellStates.IN_PATH) {
                return {...cell, state: GameBoard.CellStates.NONE};
            } else {
                return cell;
            }
        }))
    };
    setBoard(b);

}