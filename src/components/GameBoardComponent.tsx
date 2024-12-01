import React from "react";

import * as GameBoard from "../logic/GameBoard";
import GameBoardCellComponent from "./GameBoardCellComponent";

import "./GameBoardComponent.scss";
import {getCellValue} from "../logic/GameBoard";


interface GameBoardComponentProps {
    board: GameBoard.GameBoard;
}

function buildBoardCells(board: GameBoard.GameBoard): JSX.Element[][] {
    return board.board.map((row, rowIndex) => {
        return row.map((letter, columnIndex) => {
            return (
                <GameBoardCellComponent
                    key={ `${rowIndex}-${columnIndex}` }
                    row={ rowIndex }
                    col={ columnIndex }
                    val={ getCellValue(board, rowIndex, columnIndex) }
                />
            );
        });
    });
}

function GameBoardComponent({ board }: GameBoardComponentProps) {
    return (
        <div className="board">
            {buildBoardCells(board)}
        </div>
    );
}

export default GameBoardComponent;
