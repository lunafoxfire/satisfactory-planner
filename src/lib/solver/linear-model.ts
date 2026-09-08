import type { SolverSubproblem } from "./problem";

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

export function buildLinearModel(problem: SolverSubproblem): LinearModel {
    return {
        bounds: compileBounds(problem),
        constraints: compileConstraints(problem),
        objective: compileObjective(problem),
    };
}

function compileBounds(problem: SolverSubproblem): LinearBound[] {
    const bounds: LinearBound[] = [];
    for (const item of problem.items) {
        bounds.push({
            variable: item.itemId,
            lowerBound: 0,
        });
    }
    for (const recipe of problem.recipes) {
        bounds.push({
            variable: recipe.recipeId,
            lowerBound: 0,
        });
    }
    return bounds;
}

function constraintId(id: string): string {
    return `${id}_CONSTRAINT`;
}

function compileConstraints(problem: SolverSubproblem): LinearConstraint[] {
    const constraints: LinearConstraint[] = [];
    for (const { itemId } of problem.items) {
        const constraint: LinearConstraint = {
            id: constraintId(itemId),
            coefficients: [],
            lowerBound: 0,
        };

        for (const input of problem.inputs) {
            if (input.itemId === itemId) {
                constraint.lowerBound! -= input.rate;
            }
        }

        for (const target of problem.targets) {
            if (target.itemId === itemId) {
                constraint.lowerBound! += target.rate;
            }
        }

        for (const recipe of problem.recipes) {
            const usedIn = recipe.ingredients.find((i) => i.itemId === itemId);
            if (usedIn) {
                constraint.coefficients.push({
                    variable: recipe.recipeId,
                    coefficient: usedIn.rate,
                });
            }

            const producedIn = recipe.products.find((p) => p.itemId === itemId);
            if (producedIn) {
                constraint.coefficients.push({
                    variable: recipe.recipeId,
                    coefficient: -producedIn.rate,
                });
            }
        }
    }
    return constraints;
}

function compileObjective(problem: SolverSubproblem): LinearObjective {
    if (problem.currentObjective.type === "maximizeItem") {
        return {
            direction: "maximize",
            coefficients: [{
                variable: problem.currentObjective.itemId,
                coefficient: 1,
            }]
        };
    }

    const objective: LinearObjective = {
        direction: "minimize",
        coefficients: []
    };

    const resourceMultiplier =
        problem.currentObjective.type === "minimizeResourceUsage" ? 1000 : 1;
    const powerMultiplier =
        problem.currentObjective.type === "minimizePowerUsage" ? 1000 : 1;
    const areaMultiplier =
        problem.currentObjective.type === "minimizeFactoryArea" ? 1000 : 1;

    for (const recipe of problem.recipes) {
        let resourcePenalty = 0;
        for (const resource of problem.inputs) {
            const usedIn = recipe.ingredients.find((i) => i.itemId === resource.itemId);
            if (usedIn) {
                resourcePenalty += resource.relativeValue * usedIn.rate;
            }

            const producedIn = recipe.products.find((p) => p.itemId === resource.itemId);
            if (producedIn) {
                resourcePenalty -= resource.relativeValue * producedIn.rate;
            }
        }

        let powerPenalty = 0;
        if (recipe.power > 0) {
            powerPenalty = recipe.power;
        }

        let areaPenalty = recipe.area;

        const totalPenalty =
            resourceMultiplier * resourcePenalty
            + powerMultiplier * powerPenalty
            + areaMultiplier * areaPenalty;

        objective.coefficients.push({
            variable: recipe.recipeId,
            coefficient: totalPenalty,
        });
    }

    return objective;
}
