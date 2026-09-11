import { GameDataSchema } from "#data/game-data-schema";

export async function getGameData() {
    const response = await fetch("/api/game-data");

    if (!response.ok) {
        throw new Error(`Failed to load game data: ${response.status}`);
    }

    return GameDataSchema.parse(await response.json());
}
