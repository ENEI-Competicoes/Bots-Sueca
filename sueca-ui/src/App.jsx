import React, { useContext, useEffect, useState, useCallback } from "react";
import { GameProvider, GameContext } from "./context/GameContext.js";
import GameTable from "./components/GameTable.jsx";
import TrumpCard from "./components/TrumpCard.jsx";
import WinnerPopup from "./components/WinnerPopUp.jsx";
import RoundEndPopUp from "./components/RoundEndPopUp.jsx";
import { getImagePathENEILogo } from "./util/getImagePath.js";
import { fetchRenounceCounts } from "./api/gameApi.js";

const App = () => (
    <GameProvider>
        <MainAppContent />
    </GameProvider>
);

const MainAppContent = () => {
    const { gameState } = useContext(GameContext);
    const { overall_points, round_points, trump_suit, play_id: roundID, table, game_over} = gameState;

    const [winner, setWinner] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [roundEnd, setRoundEnd] = useState(false);
    const [renounceCounts, setRenounceCounts] = useState({});
    const [renouncePlayer, setRenouncePlayer] = useState(null);
    const [renouncedPlayer, setRenouncedPlayer] = useState(null);

    const getRenounceCounts = useCallback(async () => {
        const data = await fetchRenounceCounts();
        if (data) setRenounceCounts(data);
    }, []);

    useEffect(() => {
        getRenounceCounts();
    }, [roundID, getRenounceCounts]);

    useEffect(() => {
        if (gameOver) return;

        if (overall_points[1] >= 10) {
            setWinner("Equipa 1");
            setGameOver(true);
        } else if (overall_points[2] >= 10) {
            setWinner("Equipa 2");
            setGameOver(true);
        }

        if (roundID === 10 && Object.values(table).every((card) => card !== "")) {
            const winnerTeam = round_points[1] > round_points[2] ? "Equipa 1" : "Equipa 2";
            setWinner(winnerTeam);
            setTimeout(() => setRoundEnd(true), 1000);
        }

        let foundPlayer = null;
        console.log("table", table)
        Object.entries(table).forEach(([player, card]) => {
            console.log("carta", card)
            console.log("player", player)
            if (card !== "" && ["R1", "R2", "R3", "R4"].includes(card)) {
                foundPlayer = player;
                setRenouncedPlayer(card.replace(/R([1-4])/, "P$1"));
            }
        });

        if (foundPlayer) {
            setRenouncePlayer(foundPlayer);
            const winnerTeam = round_points[1] > round_points[2] ? "Equipa 1" : "Equipa 2";
            setWinner(winnerTeam);
            setTimeout(() => setRoundEnd(true), 1000);
        }


    }, [overall_points, gameOver, roundID, table, round_points, game_over]);

    useEffect(() => {
        if (!roundEnd) return;
        const timer = setTimeout(() => setRoundEnd(false), 2500);
        return () => clearTimeout(timer);
    }, [roundEnd]);

    const handleClosePopup = () => {
        setWinner(null);
        setRoundEnd(false);
        setRenouncePlayer(null);
    };

    return (
        <div className="bg-green-800 min-h-screen flex flex-col items-center justify-center">
            {roundEnd && <RoundEndPopUp winner={winner} renounceCounts={renounceCounts} renouncePlayer={renouncePlayer} renouncedPlayer={renouncedPlayer} />}

            {winner && gameOver && <WinnerPopup winner={winner} handleClosePopup={handleClosePopup} />}
            
            <div className="absolute top-2 left-2 w-1/6">
                <img src={getImagePathENEILogo()} alt="Cadeira" />
            </div>
            
            <div className="absolute top-2 right-2 shadow-xl">
                <TrumpCard trumpSuit={trump_suit} />
            </div>
            
            <div className="flex justify-center items-center w-full h-full">
                <GameTable overallPoints={overall_points} roundPoints={round_points} gameOver={gameOver} roundID={roundID} />
            </div>
        </div>
    );
};

export default App;
