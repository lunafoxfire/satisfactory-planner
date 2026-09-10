import { SectionCard } from "#components/section-card";
import type { GameData } from "#data/schema";
import { useGameData } from "#hooks/use-game-data";
import type { SolveResult } from "#lib/solver/solver";
import { useSolverStore } from "#lib/store/solver/store";
import { Fragment, useMemo } from "react";

interface BuildRequirements {
    buildings: Record<string, BuildingRequirements>;
    totalMaterials: Record<string, MaterialAmount>;
}

interface BuildingRequirements {
    buildingName: string;
    count: number;
    materials: Record<string, MaterialAmount>;
}

interface MaterialAmount {
    itemName: string;
    quantity: number;
}

function getBuildRequirements(gameData: GameData, solveResult: SolveResult): BuildRequirements {
    const buildRequirements: BuildRequirements = {
        buildings: {},
        totalMaterials: {},
    };
    if (solveResult.status !== "success") return buildRequirements;

    let mergedRecipes = solveResult.recipes;
    const waterItemKey = "Desc_Water_C";
    const waterExtractorKey = "Desc_WaterPump_C";
    const waterUse = solveResult.inputs[waterItemKey] ?? 0;
    if (waterUse > 0) {
        mergedRecipes = {
            ...mergedRecipes,
        };
        mergedRecipes[waterItemKey] = waterUse / 120;
    }

    for (const [recipeId, multiplier] of Object.entries(mergedRecipes)) {
        let buildingId = "";

        if (recipeId === waterItemKey) {
            buildingId = waterExtractorKey;
        }
        else {
            const recipe = gameData.recipes[recipeId];
            if (!recipe) continue;
            buildingId = recipe.producedIn;
        }

        const building = gameData.buildings[buildingId];
        if (!building) continue;

        if (!buildRequirements.buildings[buildingId]) {
            buildRequirements.buildings[buildingId] = {
                buildingName: building.name,
                count: 0,
                materials: {}
            };
        }
        const buildingRequirements = buildRequirements.buildings[buildingId];

        const buildingCount = Math.ceil(multiplier);
        buildingRequirements.count += buildingCount;

        for (const { itemId, quantity } of building.buildCost) {
            const item = gameData.items[itemId];
            if (!item) continue;
            if (!buildingRequirements.materials[itemId]) {
                buildingRequirements.materials[itemId] = {
                    itemName: item.name,
                    quantity: 0,
                };
            }
            if (!buildRequirements.totalMaterials[itemId]) {
                buildRequirements.totalMaterials[itemId] = {
                    itemName: item.name,
                    quantity: 0,
                };
            }
            buildingRequirements.materials[itemId].quantity += quantity * buildingCount;
            buildRequirements.totalMaterials[itemId].quantity += quantity * buildingCount;
        }
    }

    return buildRequirements;
}

export function BuildingsTab() {
    const gameData = useGameData();
    const solveResult = useSolverStore((state) => state.result);

    const buildRequirements: BuildRequirements = useMemo(
        () => getBuildRequirements(gameData, solveResult),
        [gameData, solveResult],
    );

    return (
        <div className="flex flex-col">
            <SectionCard
                title="Building Costs"
                description="Per-building breakdown of materials needed to build your factory."
            >
                <ul className="flex flex-col gap-4">
                    {Object.entries(buildRequirements.buildings).map(([buildingId, buildingRequirements]) => (
                        <Fragment key={buildingId}>
                            <div className="border-t" />
                            <li className="flex flex-col">
                                <div>
                                    <span className="font-extrabold text-lg">{buildingRequirements.buildingName}</span>
                                    <span className="text-[0.67rem]"> x{buildingRequirements.count.toLocaleString()}</span>
                                </div>
                                <ul>
                                    {Object.entries(buildingRequirements.materials).map(([itemId, item]) => (
                                        <li key={itemId} className="ml-2 border-l-2 pl-2">
                                            <span className="font-extrabold text-[0.7rem]">{item.itemName}</span>
                                            <span className="text-[0.7rem]"> x{item.quantity.toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </Fragment>
                    ))}

                    <div className="border-t" />
                    <li className="flex flex-col">
                        <div>
                            <span className="font-extrabold text-lg">Total Build Cost</span>
                        </div>
                        <ul>
                            {Object.entries(buildRequirements.totalMaterials).map(([itemId, item]) => (
                                <li key={itemId} className="ml-2 border-l-2 pl-2">
                                    <span className="font-extrabold text-[0.7rem]">{item.itemName}</span>
                                    <span className="text-[0.7rem]"> x{item.quantity.toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </SectionCard>
        </div>
    );
}
