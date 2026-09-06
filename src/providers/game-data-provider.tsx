import {
    createContext,
    type PropsWithChildren,
    useEffect,
    useState,
} from "react";
import { getGameData } from "#api/game-data";
import type { GameData } from "#data/schema";

interface GameDataContextValue {
    gameData: GameData;
}

export const GameDataContext = createContext<GameDataContextValue | null>(null);

export function GameDataProvider({ children }: PropsWithChildren) {
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
        <GameDataContext.Provider value={{ gameData }}>
            {children}
        </GameDataContext.Provider>
    );
}
