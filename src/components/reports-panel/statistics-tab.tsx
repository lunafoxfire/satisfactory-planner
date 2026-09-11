import { SectionCard } from "#components/section-card";
import type { GameData } from "#data/game-data-schema";
import { useGameData } from "#hooks/use-game-data";
import type { SolveResult } from "#lib/solver/solver";
import { useSolverStore } from "#lib/store/solver/store";
import { Fragment, useMemo } from "react";

interface ProductionStatistic {
    header: string;
    text: string;
}

function getTotalPoints(gameData: GameData, solveResult: SolveResult): number {
    let points = 0;
    if (solveResult.status !== "success") return points;
    for (const [itemId, rate] of Object.entries(solveResult.outputs)) {
        const itemPoints = gameData.items[itemId]?.sinkPoints ?? 0;
        points += itemPoints * rate;
    }
    return points;
}

function getResourceUsage(gameData: GameData, solveResult: SolveResult): number {
    let usageScore = 0;
    if (solveResult.status !== "success") return usageScore;
    for (const [itemId, rate] of Object.entries(solveResult.inputs)) {
        const resource = gameData.resources[itemId];
        if (!resource) continue;
        usageScore += resource.relativeValue * rate;
    }
    return usageScore;
}

function getNetPower(gameData: GameData, solveResult: SolveResult): number {
    let power = 0;
    if (solveResult.status !== "success") return power;
    for (const [recipeId, multiplier] of Object.entries(solveResult.recipes)) {
        const recipe = gameData.recipes[recipeId];
        if (!recipe) continue;
        const building = gameData.buildings[recipe.producedIn];
        const buildingPower = building.power ?? 0;
        power += buildingPower * Math.ceil(multiplier);
    }
    return power;
}

function getTotalArea(gameData: GameData, solveResult: SolveResult): number {
    let area = 0;
    if (solveResult.status !== "success") return area;
    for (const [recipeId, multiplier] of Object.entries(solveResult.recipes)) {
        const recipe = gameData.recipes[recipeId];
        if (!recipe) continue;
        const building = gameData.buildings[recipe.producedIn];
        const buildingArea = building.area ?? 0;
        area += buildingArea * Math.ceil(multiplier);
    }
    return area;
}

export function StatisticsTab() {
    const gameData = useGameData();
    const solveResult = useSolverStore((state) => state.result);

    const stats: ProductionStatistic[] = useMemo(() => {
        const totalPoints = getTotalPoints(gameData, solveResult);
        const resourceUsage = getResourceUsage(gameData, solveResult);
        const netPower = getNetPower(gameData, solveResult);
        const totalArea = getTotalArea(gameData, solveResult);
        const numFoundations = Math.ceil(totalArea / 64);
        const concreteNeeded = numFoundations * 7;
        return [
            {
                header: "Points Produced",
                text: `${Math.round(totalPoints).toLocaleString()} per min`
            },
            {
                header: "Resource Usage Score",
                text: `${Math.round(resourceUsage).toLocaleString()}`
            },
            {
                header: netPower < 0 ? "Estimated Power Production" : "Estimated Power Usage",
                text: `${Math.abs(netPower).toLocaleString()} MW`
            },
            {
                header: "Estimated Build Area",
                text: `${totalArea.toLocaleString()} m²`
            },
            {
                header: "Estimated Foundations Needed",
                text: `${numFoundations.toLocaleString()} Foundations // ${concreteNeeded.toLocaleString()} Concrete`
            },
        ];
    }, [gameData, solveResult]);

    return (
        <div className="flex flex-col">
            <SectionCard
                title="Statistics"
                description="Let's see those numbers!"
            >
                <ul className="flex flex-col gap-4">
                    {stats.map((stat) => (
                        <Fragment key={stat.header}>
                            <div className="border-t" />
                            <li className="flex flex-col">
                                <div className="font-extrabold text-[0.85rem]">{stat.header}</div>
                                <div>{stat.text}</div>
                            </li>
                        </Fragment>
                    ))}
                </ul>
            </SectionCard>
        </div>
    );
}
