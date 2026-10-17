import { SectionCard } from "#components/section-card";
import type { GameData } from "#data/game-data-schema";
import { useGameData } from "#hooks/use-game-data";
import type { SolveResult } from "#lib/solver/solver";
import { useSolverStore } from "#lib/store/solver/store";
import { useMemo } from "react";

interface MaterialAmount {
    itemName: string;
    quantity: number;
}

interface MaterialRequirements {
    inputs: Record<string, MaterialAmount>;
    outputs: Record<string, MaterialAmount>;
}

function getMaterialRequirements(
    gameData: GameData,
    solveResult: SolveResult,
): MaterialRequirements {
    const requirements: MaterialRequirements = {
        inputs: {},
        outputs: {},
    };

    if (solveResult.status !== "success") return requirements;

    for (const [itemId, quantity] of Object.entries(solveResult.inputs)) {
        const item = gameData.items[itemId];
        if (!item) continue;

        requirements.inputs[itemId] = {
            itemName: item.name,
            quantity: (quantity),
        };
    }

    for (const [itemId, quantity] of Object.entries(solveResult.outputs)) {
        const item = gameData.items[itemId];
        if (!item) continue;

        requirements.outputs[itemId] = {
            itemName: item.name,
            quantity: (quantity),
        };
    }

    return requirements;
}

export function MaterialsTab() {
    const gameData = useGameData();
    const solveResult = useSolverStore((state) => state.result);

    const materialRequirements = useMemo(
        () => getMaterialRequirements(gameData, solveResult),
        [gameData, solveResult],
    );

    return (
        <div className="flex flex-col">
            <SectionCard
                title="Materials"
                description="Quick overview of your factory's inputs and outputs."
            >
                <ul className="flex flex-col gap-4">
                    <div className="border-t" />
                    <li className="flex flex-col">
                        <span className="font-extrabold text-lg">Inputs</span>
                        <ul>
                            {Object.entries(materialRequirements.inputs).map(([itemId, item]) => (
                                <li key={itemId} className="ml-2 border-l-2 pl-2">
                                    <span className="font-extrabold text-[0.7rem]">{item.itemName}: </span>
                                    <span className="text-[0.7rem]">{item.quantity.toLocaleString()} / min</span>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <div className="border-t" />

                    <li className="flex flex-col">
                        <span className="font-extrabold text-lg">Outputs</span>
                        <ul>
                            {Object.entries(materialRequirements.outputs).map(([itemId, item]) => (
                                <li key={itemId} className="ml-2 border-l-2 pl-2">
                                    <span className="font-extrabold text-[0.7rem]">{item.itemName}: </span>
                                    <span className="text-[0.7rem]">{item.quantity.toLocaleString()} / min</span>
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </SectionCard>
        </div>
    );
}
