import React, { useEffect, useState } from "react";
import { fillBoardWithRandomLetters, generateEmptyBoard, placeWordsOnBoard } from "../logic/GameBoard";
import GameBoardCellComponent from "./GameBoardCellComponent";
import "./GameBoardComponent.css";

const wordsToFind = ["ALPHA", "BETA", "GAMMA", "OMEGA", "APPLE"];

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

function GameBoardComponent() {
    const [board, setBoard] = useState([]);

    useEffect(() => {
        const newBoard = generateEmptyBoard();
        placeWordsOnBoard(newBoard, wordsToFind);
        fillBoardWithRandomLetters(newBoard);
        setBoard(newBoard);
    }, []);

    return (
        <div className="game-container">
            <div className="board-and-list-container">
                <div className="board">
                    {buildBoardFromLetterMatrix(board)}
                </div>
                <div className="word-list">
                    <h2>Words to Find</h2>
                    <ul>
                        { wordsToFind.map((word, index) => (<li key={ index }>{ word }</li>)) }
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default GameBoardComponent;
