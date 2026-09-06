import { useEffect, useState } from "react";
import { getGameData } from "#api/game-data";
import type { GameData } from "#data/schema";

export function MainBody() {
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        getGameData()
            .then(setGameData)
            .catch(setError);
    }, []);

    if (error) {
        return <div>Failed to load game data: {error.message}</div>;
    }

    if (!gameData) {
        return <div>Loading game data...</div>;
    }

    return (
        <div>
            <h1>Satisfactory Planner</h1>
            <div>Game data version: {gameData.version}</div>
            <div>Items: {Object.keys(gameData.items).length}</div>
            <div>Recipes: {Object.keys(gameData.recipes).length}</div>
            <div>Buildings: {Object.keys(gameData.buildings).length}</div>
            <div>Resources: {Object.keys(gameData.resources).length}</div>
        </div>
    );
}
