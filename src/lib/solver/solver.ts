import loadHighs, { type HighsLinearSolutionRow, type HighsModelStatus, type HighsSolution } from "highs";
import type { GameData } from "#data/schema";
import type { PlannerState } from "#lib/store/store";
import { compileLinearModel } from "./linear-model";
import { getLP } from "./lp";
import { compileSolverProblem } from "./problem";

const highs = loadHighs({
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

export async function solve(gameData: GameData, store: PlannerState) {
    console.clear();
    const problem = compileSolverProblem(gameData, store);

    const model = compileLinearModel({
        ...problem,
        currentObjective: problem.objectives[0],
    });
    const lp = getLP(model);
    console.log(lp);

    const lpResult = (await highs).solve(lp, { output_flag: false });
    console.log(lpResult);

    const result = parseLPResult(lpResult);
    console.log(result);
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

function parseLPResult(lpResult: HighsSolution): SolveResult {
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
        if (Primal !== 0) {
            result.recipes[Name] = Primal;
        }
    }

    for (const { Name, Primal } of (lpResult.Rows as HighsLinearSolutionRow[])) {
        if (Primal < 0) {
            result.inputs[Name] = -Primal;
        }
        else if (Primal > 0) {
            result.outputs[Name] = Primal;
        }
    }

    return result;
}
