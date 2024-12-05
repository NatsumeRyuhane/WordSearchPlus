import React, {useContext, useEffect, useRef} from "react";

import "./GameControlsComponent.css";
import { autoSolve, clickCell, resetGame } from "../logic/Game";
import { GameBoardContext, ActivePathContext, SolutionContext, PlayerInputDisabledContext } from "../App";

function GameControlsComponent() {
    const [board, setBoard] = useContext(GameBoardContext);
    const [activePath, setActivePath] = useContext(ActivePathContext);
    const [solutions, setSolutions] = useContext(SolutionContext);
    const [playerInputDisabled, setPlayerInputDisabled] = useContext(PlayerInputDisabledContext);

    const boardRef = useRef(board);
    const activePathRef = useRef(activePath);
    const solutionsRef = useRef(solutions);
    const timeoutsRef = useRef<number[]>([]);

    useEffect(() => {
        boardRef.current = board;
        activePathRef.current = activePath;
        solutionsRef.current = solutions;
    }, [board, activePath, solutions, playerInputDisabled]);

    function autoSolveBtnOnClick() {
        setPlayerInputDisabled(true);

        const cellClickOrder = autoSolve(board, solutions);
        resetGame([boardRef.current, setBoard], [activePathRef.current, setActivePath], [solutionsRef.current, setSolutions]);

        // simulate the clicks, make 100ms delay between each click
        cellClickOrder.forEach((cell, index) => {
            const timeoutId = setTimeout(() => {
                clickCell(
                    [cell[0], cell[1]],
                    [boardRef.current, setBoard],
                    [activePathRef.current, setActivePath],
                    [solutionsRef.current, setSolutions]);
            }, 250 * index);
            timeoutsRef.current.push(timeoutId);
        });
    }

    function resetGameBtnOnClick() {
        console.log("Reset Game button clicked");
        // cancel unfinished autoSolve
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];

        setPlayerInputDisabled(false);
        resetGame([boardRef.current, setBoard], [activePathRef.current, setActivePath], [solutionsRef.current, setSolutions]);
    }

    return (
        <div className="game-controls">
            {playerInputDisabled ? <button onClick={resetGameBtnOnClick}>Reset Game</button> : <button onClick={autoSolveBtnOnClick}>Auto Solve</button>}
        </div>
    );
}

export default GameControlsComponent;