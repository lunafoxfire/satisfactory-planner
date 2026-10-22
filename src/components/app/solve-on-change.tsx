import { useGameData } from "#hooks/use-game-data";
import { solve } from "#lib/solver/solver";
import { usePlannerStore } from "#lib/store/planner/store";
import { useSolverStore } from "#lib/store/solver/store";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function SolveOnChange() {
    const gameData = useGameData();

    // all of this is to avoid re-solving on factory name change
    const {
        targets,
        objective,
        input,
        recipes,
    } = usePlannerStore(
        useShallow((state) => ({
            targets: state.production.targets,
            objective: state.production.objective,
            input: state.input,
            recipes: state.recipes,
        })),
    );

    const setResult = useSolverStore((state) => state.setResult);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const plannerStore = usePlannerStore.getState();

            solve(gameData, {
                ...plannerStore,
                production: {
                    ...plannerStore.production,
                    targets,
                    objective,
                },
                input,
                recipes,
            }).then(setResult);
        }, 25);

        return () => clearTimeout(timeout);
    }, [gameData, targets, objective, input, recipes, setResult]);

    return null;
}
