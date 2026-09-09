import { useGameData } from "#hooks/use-game-data";
import { buildGraph } from "#lib/graph/graph";
import { useSolverStore } from "#lib/store/solver/store";
import { useMemo } from "react";
import { ProductionGraph } from "./production-graph";

export function ProductionGraphContainer() {
    const gameData = useGameData();
    const solveResult = useSolverStore((state) => state.result);

    const graph = useMemo(() => {
        return buildGraph(gameData, solveResult);
    }, [solveResult, gameData]);

    return (
        <ProductionGraph graph={graph} />
    );
}
