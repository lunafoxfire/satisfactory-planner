import loadHighs, { type HighsModelStatus, type HighsSolution } from "highs";
import type { GameData } from "#data/schema";
import type { PlannerState } from "#lib/store/store";
import { compileLinearModel } from "./linear-model";
import { getLP } from "./lp";
import { compileSolverProblem, type SolverProblem } from "./problem";

const highsPromise = loadHighs({
    locateFile: (file) => `/${file}`,
});

export type SolveStatus =
    | "success"
    | "empty"
    | "unbounded"
    | "infeasible"
    | "timeout"
    | "error"
    | "unknown";

export type SolveResult =
    | {
        status: Exclude<SolveStatus, "success">;
    }
    | {
        status: "success";
        recipes: Record<string, number>;
        inputs: Record<string, number>;
        outputs: Record<string, number>;
    };

export async function solve(gameData: GameData, store: PlannerState): Promise<SolveResult> {
    console.clear();
    const highs = (await highsPromise);

    const problem = compileSolverProblem(gameData, store);
    let result: SolveResult = { status: "empty" };
    let continueSolving = true;

    function solveSubproblem(maximizeTarget: string | null) {
        const model = compileLinearModel(problem, maximizeTarget);
        const lp = getLP(model);

        const lpResult = highs.solve(lp, { output_flag: false });
        const subresult = parseLPResult(lpResult, gameData);

        updateProblem(problem, subresult);
        result = mergeResults(result, subresult);
        if (!(result.status === "success" || result.status === "empty")) {
            continueSolving = false;
        }
    }

    const sortedMaximizeTargets = Object.entries(problem.maximizeTargets)
        .sort(([_aItemId, aPriority], [_bItemId, bPriority]) => {
            if (aPriority < bPriority) return 1;
            if (aPriority > bPriority) return -1;
            return 0;
        })
        .map(([itemId, _priority]) => itemId);

    for (const maximizeTarget of sortedMaximizeTargets) {
        solveSubproblem(maximizeTarget);
        if (!continueSolving) break;
    }
    if (continueSolving) {
        solveSubproblem(null);
    }

    return result;
}

function mapLPStatus(lpStatus: HighsModelStatus): SolveStatus {
    switch (lpStatus) {
        case "Optimal":
        case "Bound on objective reached":
        case "Target for objective reached":
            return "success";

        case "Empty":
            return "empty";

        case "Unbounded":
            return "unbounded";

        case "Infeasible":
        case "Primal infeasible or unbounded":
            return "infeasible";

        case "Time limit reached":
        case "Iteration limit reached":
            return "timeout";

        case "Not Set":
        case "Load error":
        case "Model error":
        case "Presolve error":
        case "Solve error":
        case "Postsolve error":
            return "error";

        default:
            return "unknown";
    }
}

function parseLPResult(lpResult: HighsSolution, gameData: GameData): SolveResult {
    const status = mapLPStatus(lpResult.Status);
    if (status !== "success") {
        return {
            status,
        };
    }

    const result: SolveResult = {
        status,
        recipes: {},
        inputs: {},
        outputs: {},
    };

    for (const [Name, { Primal }] of Object.entries(lpResult.Columns)) {
        if (gameData.recipes[Name]) {
            if (Primal !== 0) {
                result.recipes[Name] = Primal;
            }
        }
        else if (gameData.items[Name]) {
            if (Primal < 0) {
                result.inputs[Name] = -Primal;
            }
            else if (Primal > 0) {
                result.outputs[Name] = Primal;
            }
        }
    }

    return result;
}

function updateProblem(problem: SolverProblem, subresult: SolveResult) {
    if (subresult.status !== "success") return;
    for (const [itemId, inputAmount] of Object.entries(subresult.inputs)) {
        const problemInput = problem.inputs[itemId];
        if (problemInput) {
            problemInput.rate -= inputAmount;
        }
    }
    for (const [itemId, outputAmount] of Object.entries(subresult.outputs)) {
        const problemTarget = problem.targets[itemId];
        if (problemTarget) {
            problemTarget.rate -= outputAmount;
        }
    }
}

function mergeResults(result: SolveResult, subresult: SolveResult): SolveResult {
    if (!(result.status === "success" || result.status === "empty")) return result;
    if (!(subresult.status === "success" || subresult.status === "empty")) return subresult;

    if (result.status !== "success") return subresult;
    if (subresult.status !== "success") return result;

    for (const [recipeId, count] of Object.entries(subresult.recipes)) {
        if (result.recipes[recipeId]) {
            result.recipes[recipeId] += count;
        }
        else {
            result.recipes[recipeId] = count;
        }
    }
    for (const [inputId, count] of Object.entries(subresult.inputs)) {
        if (result.inputs[inputId]) {
            result.inputs[inputId] += count;
        }
        else {
            result.inputs[inputId] = count;
        }
    }
    for (const [outputId, count] of Object.entries(subresult.outputs)) {
        if (result.outputs[outputId]) {
            result.outputs[outputId] += count;
        }
        else {
            result.outputs[outputId] = count;
        }
    }

    return result;
}
