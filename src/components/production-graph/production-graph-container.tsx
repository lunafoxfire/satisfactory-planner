import { useGameData } from "#hooks/use-game-data";
import { buildGraph } from "#lib/graph/graph";
import { useSolverStore } from "#lib/store/solver/store";
import { useMemo } from "react";
import { ProductionGraph } from "./production-graph";
import { ProductionError } from "./production-error";

export function ProductionGraphContainer() {
    const gameData = useGameData();
    const solveResult = useSolverStore((state) => state.result);

    const graph = useMemo(() => {
        return buildGraph(gameData, solveResult);
    }, [solveResult, gameData]);

    return (
        <main className="h-full w-full">
            <ProductionGraph
                graph={graph}
                className="absolute z-10 top-0 bottom-0 left-0 right-0"
            />
            <ProductionError
                className="absolute z-20 top-0 bottom-0 left-0 right-0"
            />
        </main>
    );
}
