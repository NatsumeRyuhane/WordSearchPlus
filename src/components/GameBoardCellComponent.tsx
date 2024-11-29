import React, { useEffect, useState } from "react";

import "./GameBoardCellComponent.css";

interface GameBoardCellComponentProps {
    locationX: number;
    locationY: number;
    letter: string;
}

enum CellState {
    NONE,
    SELECTED,
    HIGHLIGHTED,
    SOLUTION
}

function GameBoardCellComponent({ locationX, locationY, letter }: GameBoardCellComponentProps) {
    const [state, setState] = useState<CellState>(CellState.NONE);
    const x: number = locationX;
    const y: number = locationY;
    const val: string = letter;
    let inSolution: boolean = false;


    function handleClick() {
        console.log(`cell [${x}, ${y}]: ${val} clicked`);
        setState(CellState.SELECTED);
        // send an event to the parent component

    }

    function getClassnameByState() {
        const baseClassName = "GameBoardCell";
        let className = baseClassName;
        if (state == CellState.NONE) {
            className += "";
        } else if (state === CellState.SELECTED) {
            className += " selected";
        } else if (state === CellState.HIGHLIGHTED) {
            className += " highlighted";
        }

        return className;
    }

    return (
        <div
            className={getClassnameByState()}
            onClick={handleClick}
        >
            <p>{letter}</p>
        </div>
    );
}

export default GameBoardCellComponent;
