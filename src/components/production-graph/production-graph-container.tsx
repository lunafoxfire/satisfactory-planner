import { useGameData } from "#hooks/use-game-data";
import { buildGraph } from "#lib/graph/graph";
import { useSolverStore } from "#lib/store/solver/store";
import { useEffect } from "react";

export function ProductionGraphContainer() {
    const gameData = useGameData();
    const solveResult = useSolverStore((state) => state.result);

    useEffect(() => {
        console.clear();
        console.log(solveResult);
        const graph = buildGraph(gameData, solveResult);
        console.log(graph);
    }, [solveResult, gameData]);

    return null;
}
