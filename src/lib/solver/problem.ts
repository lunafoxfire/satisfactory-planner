import type { GameData } from "#data/schema";
import type { PlannerState } from "#lib/store/store";

export interface SolverItem {
    itemId: string;
}

export interface SolverItemRate {
    itemId: string;
    rate: number;
}

export interface SolverRecipe {
    recipeId: string;
    ingredients: SolverItemRate[];
    products: SolverItemRate[];
    power: number;
    area: number;
    // sinkPoints: number;
}

export interface SolverInput {
    itemId: string;
    rate: number;
    relativeValue: number;
}

export interface SolverTarget {
    type: "itemsPerMinute";
    itemId: string;
    rate: number;
}

export type SolverObjective =
    | { type: "maximizeItem", itemId: string; }
    | { type: "minimizeResourceUsage"; }
    | { type: "minimizePowerUsage"; }
    | { type: "minimizeFactoryArea"; };

export interface SolverData {
    items: SolverItem[];
    recipes: SolverRecipe[];
    inputs: SolverInput[];
    targets: SolverTarget[];
}

export type SolverProblem = SolverData & {
    objectives: SolverObjective[];
};

export type SolverSubproblem = SolverData & {
    currentObjective: SolverObjective;
};

export function compileSolverProblem(gameData: GameData, store: PlannerState): SolverProblem {
    const solverProblem: SolverProblem = {
        items: compileSolverItems(gameData, store),
        recipes: compileSolverRecipes(gameData, store),
        inputs: compileSolverInputs(gameData, store),
        targets: compileSolverTargets(gameData, store),
        objectives: compileSolverObjectives(gameData, store),
    };
    return cleanSolverProblem(solverProblem);
}

function compileSolverItems(gameData: GameData, _store: PlannerState): SolverItem[] {
    const solverItems: SolverItem[] = [];
    for (const [itemId, _item] of Object.entries(gameData.items)) {
        solverItems.push({
            itemId,
        });
    }
    return solverItems;
}

function compileSolverRecipes(gameData: GameData, store: PlannerState): SolverRecipe[] {
    const solverRecipes: SolverRecipe[] = [];
    for (const [recipeId, recipe] of Object.entries(gameData.recipes)) {
        if (recipe.isConversion && !store.recipes.conversionsEnabled) {
            continue;
        }
        if (recipe.isFicsmas && !store.recipes.ficsmasEnabled) {
            continue;
        }
        if (!store.recipes.enabled[recipeId]) {
            continue;
        }
        const recipeBuilding = gameData.buildings[recipe.producedIn];
        if (!recipeBuilding) {
            console.error(`Recipe ${recipeId} missing production building: ${recipe.producedIn}`);
            continue;
        }
        solverRecipes.push({
            recipeId,
            ingredients: recipe.ingredients.map(({ itemId, perMinute }) => ({ itemId, rate: perMinute })),
            products: recipe.products.map(({ itemId, perMinute }) => ({ itemId, rate: perMinute })),
            power: recipeBuilding.power,
            area: recipeBuilding.area,
        });
    }
    return solverRecipes;
}

function compileSolverInputs(gameData: GameData, store: PlannerState): SolverInput[] {
    const solverInputs: SolverInput[] = [];
    for (const input of store.input.items) {
        if (!input.itemId) {
            continue;
        }
        solverInputs.push({
            itemId: input.itemId,
            rate: input.unlimited ? Infinity : input.rate,
            relativeValue: 1,
        });
    }
    for (const inputResource of store.input.resources) {
        const resource = gameData.resources[inputResource.itemId];
        if (!resource) {
            console.error(`Input resource ${inputResource.itemId} has no associated data`);
        }
        solverInputs.push({
            itemId: inputResource.itemId,
            rate: inputResource.unlimited ? Infinity : inputResource.rate,
            relativeValue: resource.relativeValue,
        });
    }
    if (store.input.allowHandGathered) {
        for (const [itemId, item] of Object.entries(gameData.items)) {
            if (item.isHandGathered) {
                solverInputs.push({
                    itemId,
                    rate: Infinity,
                    relativeValue: 1,
                });
            }
        }
    }
    return solverInputs;
}

function compileSolverTargets(gameData: GameData, store: PlannerState): SolverTarget[] {
    const solverTargets: SolverTarget[] = [];
    for (const target of store.production.targets) {
        if (!target.itemId) {
            continue;
        }
        if (target.mode === "itemsPerMinute") {
            solverTargets.push({
                type: "itemsPerMinute",
                itemId: target.itemId,
                rate: target.rate,
            });
        } else if (target.mode === "fromRecipe") {
            if (!target.recipeId) {
                continue;
            }
            const targetRecipe = gameData.recipes[target.recipeId];
            if (!targetRecipe) {
                console.error(`Production target for ${target.itemId} tried to target missing recipe: ${target.recipeId}`);
                continue;
            }
            const targetProduct = targetRecipe.products.find((p) => p.itemId === target.itemId);
            if (!targetProduct) {
                console.error(`Production target for ${target.itemId} tried to target invalid recipe: ${target.recipeId}`);
                continue;
            }
            solverTargets.push({
                type: "itemsPerMinute",
                itemId: target.itemId,
                rate: target.multiplier * targetProduct.perMinute,
            });
        }
    }
    return solverTargets;
}

function compileSolverObjectives(_gameData: GameData, store: PlannerState): SolverObjective[] {
    const solverObjectives: SolverObjective[] = store.production.targets
        .filter((t) => t.itemId)
        .filter((t) => t.mode === "maximize")
        .sort((a, b) => {
            if (a.priority < b.priority) return 1;
            if (a.priority > b.priority) return -1;
            return 0;
        })
        .map(({ itemId }) => ({ type: "maximizeItem", itemId: itemId! }));
    solverObjectives.push({ type: "minimizeResourceUsage" });
    return solverObjectives;
}

function cleanSolverProblem(solverProblem: SolverProblem): SolverProblem {
    // TODO: remove unreachable items, recipes, etc
    // TODO: merge targets and inputs by itemId
    return solverProblem;
}
