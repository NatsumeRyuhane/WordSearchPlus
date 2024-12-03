import React, {useContext, useEffect, useMemo, useState} from "react";

import "./GameBoardCellComponent.scss";

import * as GameBoard from "../logic/GameBoard";
import { GameBoardContext, ActivePathContext, SolutionContext } from "../App";
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
    const [state, setState] = useState<GameBoard.CellStates>(GameBoard.getCellState(board, row, col));

    useEffect(() => {
        setState(GameBoard.getCellState(board, row, col));
    }, [board]);

    function handleClick() {
        clickCell([row, col], [board, setBoard], [activePath, setActivePath], [solutions, setSolutions]);
    }

    const className = useMemo(() => {
        // base classname
        let className = "GameBoardCell";

        if (state === GameBoard.CellStates.NONE) {
            className += "";
        } else if (state === GameBoard.CellStates.IN_PATH) {
            className += " selected";
        } else if (state === GameBoard.CellStates.HIGHLIGHTED) {
            className += " highlighted";
        } else if (state === GameBoard.CellStates.IN_SOLUTION) {
            className += " in-solution";
        }
        return className;
    }, [state]);

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
