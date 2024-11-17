import React, { useEffect, useState } from "react";
import {
  generateEmptyBoard,
  placeWordsOnBoard,
  fillBoardWithRandomLetters,
} from "../logic/GameBoard";
import "./GameBoardComponent.css";

const wordsToFind = ["ALPHA", "BETA", "GAMMA", "OMEGA", "APPLE"];

function GameBoardComponent() {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    let newBoard = generateEmptyBoard();
    placeWordsOnBoard(newBoard, wordsToFind);
    fillBoardWithRandomLetters(newBoard);
    setBoard(newBoard);
  }, []);

  return (
    <div className="game-container">
      <h1 className="title">WordSearch+</h1>
      <div className="board-and-list-container">
        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((letter, colIndex) => (
                <div key={colIndex} className="cell">
                  {letter}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="word-list">
          <h2>Words to Find</h2>
          <ul>
            {wordsToFind.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GameBoardComponent;
