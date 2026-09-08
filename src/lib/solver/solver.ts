import type { GameData } from "#data/schema";
import type { PlannerState } from "#lib/store/store";
import { compileSolverProblem } from "./problem";

export function solve(gameData: GameData, store: PlannerState) {
    console.log("===============");
    const problem = compileSolverProblem(gameData, store);
    console.log(problem);
}
