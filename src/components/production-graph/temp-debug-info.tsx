import { useGameData } from "#hooks/use-game-data";

export function TempDebugInfo() {
    const gameData = useGameData();

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
