import "./App.css";
import GameBoardComponent from "./components/GameBoardComponent";
import React, { useEffect } from "react";

function App() {
    useEffect(() => {
        document.title = "WordSearch+";
    }, []);

    return (
        <>
            <h1 className="title">WordSearch+</h1>
            <GameBoardComponent/>
        </>
    );
}

export default App;
