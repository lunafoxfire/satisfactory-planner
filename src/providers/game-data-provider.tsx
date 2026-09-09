import {
    createContext,
    type PropsWithChildren,
    useEffect,
    useState,
} from "react";
import { getGameData } from "#api/game-data";
import type { GameData } from "#data/schema";
import { usePlannerStore } from "#lib/store/planner/store";

interface GameDataContextValue {
    gameData: GameData;
}

export const GameDataContext = createContext<GameDataContextValue | null>(null);

export function GameDataProvider({ children }: PropsWithChildren) {
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const initResources = usePlannerStore((state) => state.initInputResources);
    const initRecipes = usePlannerStore((state) => state.initRecipes);

    useEffect(() => {
        getGameData()
            .then((gameData) => {
                setGameData(gameData);
                initResources(gameData);
                initRecipes(gameData);
            })
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
