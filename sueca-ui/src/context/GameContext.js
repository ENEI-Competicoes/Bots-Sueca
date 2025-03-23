import React, { createContext, useState, useEffect, useCallback } from "react";
import { fetchGameState } from "../api/gameApi";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState({
        table: {},
        trump_suit: "",
        overall_points: { 1: 0, 2: 0 },
        round_points: { 1: 0, 2: 0 },
        play_id: null,
        game_over: null
    });

    const getGameState = useCallback(async () => {
        const data = await fetchGameState();
        if (data) setGameState(data);
    }, []);

    useEffect(() => {
        const interval = setInterval(getGameState, 500);
        return () => clearInterval(interval);
    }, [getGameState]);

    return (
        <GameContext.Provider value={{ gameState, setGameState }}>
            {children}
        </GameContext.Provider>
    );
};
