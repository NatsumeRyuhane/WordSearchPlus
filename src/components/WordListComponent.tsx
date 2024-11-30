import React from "react";
import "./WordListComponent.css";

function WordListComponent({wordList}) {
    return (
        <div className="word-list">
            <h2>Words to Find</h2>
            <ul>
                {wordList.map((word, index) => {
                    return <li key={index}>{word}</li>;
                })}
            </ul>
        </div>
    );
}

export default WordListComponent;