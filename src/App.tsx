import "./App.scss";
import React, { useEffect, useState } from "react";

import * as GameBoard from "./logic/GameBoard";
import * as Game from "./logic/Game";
import GameBoardComponent from "./components/GameBoardComponent";
import WordListComponent from "./components/WordListComponent";
import GameControlsComponent from "./components/GameControlsComponent";

export const GameBoardContext = React.createContext([]);
export const PlayerInputDisabledContext = React.createContext([]);
export const ActivePathContext = React.createContext([]);

export const SolutionContext = React.createContext([]);


const wordlist = ["REACT", "ANGULAR", "VUE", "EMBER", "SVELTE", "JQUERY", "BACKBONE", "POLYMER", "AURELIA", "METEOR"].sort();


function App() {
    const [board, setBoard] = useState(() => GameBoard.initializeBoard(wordlist));
    const [playerInputDisabled, setPlayerInputDisabled] = useState(false);

    const [activePath, setActivePath] = useState<[number, number][]>([]);
    const [solutions, setSolutions] = useState<GameBoard.Solution[]>([]);

    useEffect(() => {
        document.title = "WordSearch+";

        const s = []
        wordlist.forEach(word => {
            s.push({word, path: []});
        });
        setSolutions(s);
    }, []);

    return (
        <>
            <h1 className="title">WordSearch+</h1>
            <GameBoardContext.Provider value={[board, setBoard]}>
            <SolutionContext.Provider value={[solutions, setSolutions]}>
            <PlayerInputDisabledContext.Provider value={[playerInputDisabled, setPlayerInputDisabled]}>
            <ActivePathContext.Provider value={[activePath, setActivePath]}>
                <div className="game-container">
                    <div>
                        <GameBoardComponent board={board}/>
                    </div>
                    <div className="aux-container">
                        <WordListComponent wordList={wordlist}/>
                        <GameControlsComponent/>
                    </div>
                </div>
            </ActivePathContext.Provider>
            </PlayerInputDisabledContext.Provider>
            </SolutionContext.Provider>
            </GameBoardContext.Provider>
        </>
    );
}

export default App;
