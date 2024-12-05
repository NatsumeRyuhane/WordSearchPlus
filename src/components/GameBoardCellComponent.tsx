import React, {useContext, useEffect, useMemo, useState} from "react";

import "./GameBoardCellComponent.scss";

import * as GameBoard from "../logic/GameBoard";
import { GameBoardContext, ActivePathContext, SolutionContext, PlayerInputDisabledContext } from "../App";
import { clickCell } from "../logic/Game"

interface GameBoardCellComponentProps {
    row: number;
    col: number;
    val: string;
}

function GameBoardCellComponent({ row, col, val }: GameBoardCellComponentProps) {
    const [board, setBoard] = useContext(GameBoardContext);
    const [activePath, setActivePath] = useContext(ActivePathContext);
    const [solutions, setSolutions] = useContext(SolutionContext);
    const [playerInputDisabled, setPlayerInputDisabled] = useContext(PlayerInputDisabledContext);
    const [className, setClassName] = useState<string>("GameBoardCell");

    useEffect(() => {
        setClassName(getClassName());
    }, [board, activePath]);

    function handleClick() {
        if (playerInputDisabled) return;

        clickCell([row, col], [board, setBoard], [activePath, setActivePath], [solutions, setSolutions]);
    }

    function getClassName(): string {
        // base classname
        let className = "GameBoardCell";

        if (GameBoard.getCellState(board, row, col) === GameBoard.CellStates.NONE) {
            className += "";
        } else if (GameBoard.getCellState(board, row, col) === GameBoard.CellStates.IN_PATH) {
            className += " selected";
        } else if (GameBoard.getCellState(board, row, col) === GameBoard.CellStates.IN_SOLUTION) {
            className += " in-solution";
        } else if (GameBoard.getCellState(board, row, col) === GameBoard.CellStates.HIGHLIGHTED) {
            className += " highlighted";
        }

        return className;
    }

    return (
        <div
            className={className}
            onClick={handleClick}
        >
            <p>{val}</p>
        </div>
    );
}

export default GameBoardCellComponent;
