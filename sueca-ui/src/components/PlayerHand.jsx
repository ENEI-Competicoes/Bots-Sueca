import React, { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { fetchPlayerCards } from "../api/gameApi.js";

const PlayerHand = ({ playerId, vertical = false, gameOver }) => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        let intervalId;

        const updatePlayerCards = async () => {
            const fetchedCards = await fetchPlayerCards(playerId);
            if (fetchedCards) {
                setCards(fetchedCards);
            }

        };

        if (!gameOver) {
            updatePlayerCards();
            intervalId = setInterval(updatePlayerCards, 500);
        }

        return () => clearInterval(intervalId);
    }, [playerId, gameOver]);

    const splitCards = () => {
        const half = Math.ceil(cards.length / 2);
        return [cards.slice(0, half), cards.slice(half)];
    };

    const [row1, row2] = splitCards();

    return (
        <div
            className={`flex ${
                vertical ? "flex-row space-x-2" : "flex-col space-y-4"
            } items-center justify-center`}
        >
            {vertical ? (
                <>
                    <div className="flex flex-col space-y-2">
                        {row1.map((card, idx) => (
                            <div
                                key={idx}
                                className="w-12 h-16 rounded-lg shadow-md flex items-center justify-center"
                            >
                                <Card cardIdentifier={card} />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col space-y-2">
                        {row2.map((card, idx) => (
                            <div
                                key={idx}
                                className="w-12 h-16 rounded-lg shadow-md flex items-center justify-center"
                            >
                                <Card cardIdentifier={card} />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="flex space-x-2">
                        {cards.map((card, idx) => (
                            <div
                                key={idx}
                                className="w-12 h-16 rounded-lg shadow-md flex items-center justify-center"
                            >
                                <Card cardIdentifier={card} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default PlayerHand;