import React, { useContext } from "react";
import { GameContext } from "../context/GameContext.js";
import Card from "../components/Card.jsx"

const TableCards = () => {
    const { gameState } = useContext(GameContext);

    const table = gameState?.table || {};

    const cardPositions = {
        P1: "left-0 top-1/2 transform -translate-x-1/6 -translate-y-1/2",
        P3: "right-0 top-1/2 transform translate-x-1/6 -translate-y-1/2",
        P4: "top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/6",
        P2: "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/6",
    };

    return (
        <div className="relative w-full h-full">
            {Object.entries(table).map(([player, card], index) => (
                <div
                    key={index}
                    className={`absolute ${cardPositions[player]} transition-transform duration-1000 ease-in-out`}
                >
                     <div
                        className={`w-12 h-16 flex items-center justify-center text-black`}
                    >
                        <Card cardIdentifier={card} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TableCards;
