import "./App.scss";
import React, { useEffect, useState } from "react";

import GameBoardComponent from "./components/GameBoardComponent";
import { fillBoardWithRandomLetters, generateEmptyBoard, placeWordsOnBoard } from "./logic/GameBoard";
import WordListComponent from "./components/WordListComponent";
import GameControlsComponent from "./components/GameControlsComponent";

const wordlist = ["ALPHA", "BETA", "GAMMA", "OMEGA", "APPLE"];

function App() {
    const [board, setBoard] = useState(generateEmptyBoard());

    useEffect(() => {
        document.title = "WordSearch+";

        const newBoard = generateEmptyBoard();
        placeWordsOnBoard(newBoard, wordlist);
        fillBoardWithRandomLetters(newBoard);
        setBoard(newBoard);
    }, []);



    return (
        <>
            <h1 className="title">WordSearch+</h1>
            <div className="game-container">
                <div>
                    <GameBoardComponent board={board}/>
                </div>
                <div className="aux-container">
                    <WordListComponent wordList={wordlist}/>
                    <GameControlsComponent/>
                </div>
            </div>
        </>
    );
}

export default App;
