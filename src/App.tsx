import "./App.scss";
import React, { useEffect, useState } from "react";

import * as GameBoard from "./logic/GameBoard";
import GameBoardComponent from "./components/GameBoardComponent";
import WordListComponent from "./components/WordListComponent";
import GameControlsComponent from "./components/GameControlsComponent";

export const GameContext = React.createContext([]);
const wordlist = ["REACT", "ANGULAR", "VUE", "EMBER", "SVELTE"]

function App() {
    const [board, setBoard] = useState(GameBoard.initializeBoard(wordlist));

    useEffect(() => {
        document.title = "WordSearch+";
    }, []);

    return (
        <>
            <h1 className="title">WordSearch+</h1>
            <GameContext.Provider value={[board, setBoard]}>
                <div className="game-container">
                    <div>
                        <GameBoardComponent board={board}/>
                    </div>
                    <div className="aux-container">
                        <WordListComponent wordList={wordlist}/>
                        <GameControlsComponent/>
                    </div>
                </div>
            </GameContext.Provider>
        </>
    );
}

export default App;
