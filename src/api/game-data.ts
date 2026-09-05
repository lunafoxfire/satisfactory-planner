import type { GameData } from "../data/types";

export async function getGameData(): Promise<GameData> {
    const response = await fetch("/api/game-data");

    if (!response.ok) {
        throw new Error(`Failed to load game data: ${response.status}`);
    }

    return response.json();
}
