import React, { useState, useContext } from "react";

import "./GameBoardCellComponent.css";

import * as GameBoard from "../logic/GameBoard";
import { GameContext } from "../App";

interface GameBoardCellComponentProps {
    row: number;
    col: number;
    val: string;
}

function GameBoardCellComponent({ row, col, val }: GameBoardCellComponentProps) {
    const [board, setBoard] = useContext(GameContext);
    const [state, setState] = useState<GameBoard.CellStates>(GameBoard.CellStates.NONE);
    let isInSolution: boolean = false;


    function handleClick() {
        console.log(`cell [${row}, ${col}]: ${val} clicked`);
        if (GameBoard.getCellState(board, row, col) === GameBoard.CellStates.NONE) {
            setBoard(GameBoard.updateCellState(board, row, col, GameBoard.CellStates.IN_PATH));
        } else if (state === GameBoard.CellStates.IN_PATH) {
            setBoard(GameBoard.updateCellState(board, row, col, GameBoard.CellStates.NONE));
        }

        setState(GameBoard.getCellState(board, row, col));
    }

    function getClassnameByState() {
        const baseClassName = "GameBoardCell";
        let className = baseClassName;
        if (state == GameBoard.CellStates.NONE) {
            className += "";
        } else if (state === GameBoard.CellStates.IN_PATH) {
            className += " selected";
        } else if (state === GameBoard.CellStates.HIGHLIGHTED) {
            className += " highlighted";
        }

        return className;
    }

    return (
        <div
            className={getClassnameByState()}
            onClick={handleClick}
        >
            <p>{val}</p>
        </div>
    );
}

export default GameBoardCellComponent;
