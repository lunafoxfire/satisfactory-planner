import { useGameData } from "#hooks/use-game-data";
import { solve } from "#lib/solver/solver";
import { usePlannerStore } from "#lib/store/planner/store";
import { useSolverStore } from "#lib/store/solver/store";
import { useEffect } from "react";


export function SolveOnChange() {
    const gameData = useGameData();
    const plannerStore = usePlannerStore((state) => state);
    const setResult = useSolverStore((state) => state.setResult);

    useEffect(() => {
        const debounceTimer = 25;
        const timeout = setTimeout(() => {
            solve(gameData, plannerStore).then(setResult);
        }, debounceTimer);

        return () => clearTimeout(timeout);
    }, [gameData, plannerStore, setResult]);

    return null;
}
