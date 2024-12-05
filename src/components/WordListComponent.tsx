import React, { useContext, useEffect, useState } from "react";
import "./WordListComponent.scss";
import { SolutionContext } from "../App";

function WordListComponent({ wordList }) {
    const [solutions, setSolutions] = useContext(SolutionContext);
    const [classNames, setClassNames] = useState<string[]>([]);

    useEffect(() => {
        const newClassNames = wordList.map(word => getClassName(word));
        setClassNames(newClassNames);
    }, [solutions, wordList]);

    const getClassName = (word) => {
        let className = "word-list-entry";
        if (solutions.find(solution => solution.word === word) && solutions.find(solution => solution.word === word).path.length > 0) {
            className += "-found";
        }
        return className;
    };

    return (
        <div className="word-list">
            <h2>Words to Find</h2>
            <ul>
                {wordList.map((word, index) => (
                    <li key={index} className={classNames[index]}>{word}</li>
                ))}
            </ul>
        </div>
    );
}

export default WordListComponent;