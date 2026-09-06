import { useContext } from "react";
import { GameDataContext } from "#providers/game-data-provider";

export function useGameData() {
    const context = useContext(GameDataContext);

    if (!context) {
        throw new Error(
            "useGameData must be used within a GameDataProvider",
        );
    }

    return context.gameData;
}
