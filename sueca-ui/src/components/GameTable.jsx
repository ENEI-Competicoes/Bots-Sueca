import React, { useEffect, useState } from "react";
import PlayerHand from "./PlayerHand.jsx";
import Table from "./Table.jsx";
import { fetchBotNames } from "../api/gameApi.js";

const GameTable = ({ overallPoints, roundPoints, gameOver, roundID }) => {
    const players = ["P1", "P2", "P3", "P4"]; // Ordem dos jogadores

    const [botNames, setBotNames] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            const data = await fetchBotNames();
            if (data && isMounted) {
                setBotNames(data);
            } else {
                setTimeout(fetchData, 5000);
            }
        };

        fetchData();

        return () => { isMounted = false; };
    }, []);

    return (
        <div className="relative w-full min-h-screen">
            {/* Jogador 1 (Esquerda) */}
            <div className="absolute inset-y-0 left-2 flex items-center">
                <PlayerHand playerId={players[0]} vertical gameOver={gameOver}/>
            </div>

            {/* Jogador 3 (Direita) */}
            <div className="absolute inset-y-0 right-2 flex items-center justify-end">
                <PlayerHand playerId={players[2]} vertical gameOver={gameOver}/>
            </div>

            {/* Jogador 4 (Topo) */}
            <div className="absolute inset-x-0 top-2 left-0 right-0 flex items-center justify-center">
                <PlayerHand playerId={players[3]} gameOver={gameOver}/>
            </div>

            {/* Jogador 2 (Fundo) */}
            <div className="absolute inset-x-0 bottom-2 flex items-end justify-center">
                <PlayerHand playerId={players[1]} gameOver={gameOver}/>
            </div>

            {/* Mesa no centro */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Table 
                    overallPoints={overallPoints} 
                    roundPoints={roundPoints} 
                    roundID={roundID} 
                    p1Name={botNames?.P1 || "Unknown"} 
                    p2Name={botNames?.P2 || "Unknown"} 
                    p3Name={botNames?.P3 || "Unknown"} 
                    p4Name={botNames?.P4 || "Unknown"} 
                />
            </div>
        </div>
    );
};

export default GameTable;
