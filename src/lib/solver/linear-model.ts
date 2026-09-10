import type { SolverProblem } from "./problem";

export interface LinearTerm {
    variable: string;
    coefficient: number;
}

export interface LinearBound {
    variable: string;
    lowerBound?: number;
    upperBound?: number;
}

export interface LinearConstraint {
    id: string;
    coefficients: LinearTerm[];
    lowerBound?: number;
    upperBound?: number;
}

export interface LinearObjective {
    direction: "minimize" | "maximize";
    coefficients: LinearTerm[];
}

export interface LinearModel {
    bounds: LinearBound[];
    constraints: LinearConstraint[];
    objective: LinearObjective;
}

export function compileLinearModel(problem: SolverProblem, maximizeTarget: string | null): LinearModel {
    return {
        bounds: compileBounds(problem, maximizeTarget),
        constraints: compileConstraints(problem),
        objective: compileObjective(problem, maximizeTarget),
    };
}

function compileBounds(problem: SolverProblem, maximizeTarget: string | null): LinearBound[] {
    const bounds: LinearBound[] = [];
    for (const [itemId, _item] of Object.entries(problem.items)) {
        let bound = 0;
        const input = problem.inputs[itemId];
        if (input) {
            bound -= input.rate;
        }
        if (maximizeTarget === null) {
            const target = problem.targets[itemId];
            if (target) {
                bound += target.rate;
            }
        }
        bounds.push({
            variable: itemId,
            lowerBound: bound,
        });
    }
    for (const [recipeId, _recipe] of Object.entries(problem.recipes)) {
        bounds.push({
            variable: recipeId,
            lowerBound: 0,
        });
    }
    return bounds;
}

function constraintId(baseId: string): string {
    return `${baseId}_CONSTRAINT`;
}

function compileConstraints(problem: SolverProblem): LinearConstraint[] {
    const constraints: LinearConstraint[] = [];
    for (const [itemId, item] of Object.entries(problem.items)) {
        const constraint: LinearConstraint = {
            id: constraintId(itemId),
            coefficients: [],
            lowerBound: 0,
            upperBound: 0,
        };

        constraint.coefficients.push({
            variable: itemId,
            coefficient: -1,
        });

        for (const recipeId of item.usedInRecipes) {
            const usedIn = problem.recipes[recipeId]?.ingredients.find((i) => i.itemId === itemId);
            if (usedIn) {
                constraint.coefficients.push({
                    variable: recipeId,
                    coefficient: -usedIn.rate,
                });
            }
        }

        for (const recipeId of item.producedFromRecipes) {
            const producedFrom = problem.recipes[recipeId]?.products.find((p) => p.itemId === itemId);
            if (producedFrom) {
                constraint.coefficients.push({
                    variable: recipeId,
                    coefficient: producedFrom.rate,
                });
            }
        }

        constraints.push(constraint);
    }
    return constraints;
}

function compileObjective(problem: SolverProblem, maximizeTarget: string | null): LinearObjective {
    const objective: LinearObjective = {
        direction: "minimize",
        coefficients: []
    };

    if (maximizeTarget) {
        objective.coefficients.push({
            variable: maximizeTarget,
            coefficient: -1_000_000
        });
    }

    const resourceMultiplier =
        problem.objective === "minimizeResourceUsage" ? 1 : 0.001;
    const powerMultiplier =
        problem.objective === "minimizePowerUsage" ? 1 : 0.001;
    const areaMultiplier =
        problem.objective === "minimizeFactoryArea" ? 1 : 0.001;

    for (const [recipeId, recipe] of Object.entries(problem.recipes)) {
        let resourcePenalty = 0;
        for (const [resourceId, resource] of Object.entries(problem.inputs)) {
            const usedIn = recipe.ingredients.find((i) => i.itemId === resourceId);
            if (usedIn) {
                resourcePenalty += resource.relativeValue / 100 * usedIn.rate;
            }
        }

        let powerPenalty = 0;
        if (recipe.power > 0) {
            powerPenalty = recipe.power;
        }

        let areaPenalty = recipe.area / 10;

        const totalPenalty =
            resourceMultiplier * resourcePenalty
            + powerMultiplier * powerPenalty
            + areaMultiplier * areaPenalty;

        objective.coefficients.push({
            variable: recipeId,
            coefficient: totalPenalty,
        });
    }

    return objective;
}
