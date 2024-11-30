import React from "react";
import GameBoardCellComponent from "./GameBoardCellComponent";

import "./GameBoardComponent.scss";


interface GameBoardComponentProps {
    board: string[][];
}

function buildBoardFromLetterMatrix(letterMatrix: string[][]) {
    return letterMatrix.map((row, rowIndex) => {
        return row.map((letter, columnIndex) => {
            return (
                <GameBoardCellComponent
                    key={ `${rowIndex}-${columnIndex}` }
                    locationX={ rowIndex }
                    locationY={ columnIndex }
                    letter={ letter }
                />
            );
        });
    });
}

function GameBoardComponent({ board }: GameBoardComponentProps) {
    return (
        <div className="board">
            {buildBoardFromLetterMatrix(board)}
        </div>
    );
}

export default GameBoardComponent;
