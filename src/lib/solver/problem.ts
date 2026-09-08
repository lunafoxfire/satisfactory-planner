import type { GameData } from "#data/schema";
import type { PlannerState } from "#lib/store/store";

export interface SolverItem {
    usedInRecipes: string[];
    producedFromRecipes: string[];
}

export interface SolverItemRate {
    itemId: string;
    rate: number;
}

export interface SolverRecipe {
    ingredients: SolverItemRate[];
    products: SolverItemRate[];
    power: number;
    area: number;
    // sinkPoints: number;
}

export interface SolverInput {
    rate: number;
    relativeValue: number;
}

export interface SolverTarget {
    rate: number;
}

export type SolverObjective =
    | { type: "maximizeItem", itemId: string; }
    | { type: "minimizeResourceUsage"; }
    | { type: "minimizePowerUsage"; }
    | { type: "minimizeFactoryArea"; };

export interface SolverData {
    items: Record<string, SolverItem>;
    recipes: Record<string, SolverRecipe>;
    inputs: Record<string, SolverInput>;
    targets: Record<string, SolverTarget>;
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

function getRecipeEnabled(gameData: GameData, store: PlannerState, recipeId: string): boolean {
    const recipe = gameData.recipes[recipeId];
    if (!recipe) {
        return false;
    }
    if (recipe.isConversion && !store.recipes.conversionsEnabled) {
        return false;
    }
    if (recipe.isFicsmas && !store.recipes.ficsmasEnabled) {
        return false;
    }
    if (!store.recipes.enabled[recipeId]) {
        return false;
    }
    return true;
}

function compileSolverItems(gameData: GameData, store: PlannerState): Record<string, SolverItem> {
    const solverItems: Record<string, SolverItem> = {};
    for (const [itemId, item] of Object.entries(gameData.items)) {
        solverItems[itemId] = {
            usedInRecipes: item.usedInRecipes.filter((r) => getRecipeEnabled(gameData, store, r)),
            producedFromRecipes: item.producedFromRecipes.filter((r) => getRecipeEnabled(gameData, store, r)),
        };
    }
    return solverItems;
}

function compileSolverRecipes(gameData: GameData, store: PlannerState): Record<string, SolverRecipe> {
    const solverRecipes: Record<string, SolverRecipe> = {};
    for (const [recipeId, recipe] of Object.entries(gameData.recipes)) {
        if (!getRecipeEnabled(gameData, store, recipeId)) {
            continue;
        }
        const recipeBuilding = gameData.buildings[recipe.producedIn];
        if (!recipeBuilding) {
            console.error(`Recipe ${recipeId} missing production building: ${recipe.producedIn}`);
            continue;
        }
        solverRecipes[recipeId] = {

            ingredients: recipe.ingredients.map(({ itemId, perMinute }) => ({ itemId, rate: perMinute })),
            products: recipe.products.map(({ itemId, perMinute }) => ({ itemId, rate: perMinute })),
            power: recipeBuilding.power,
            area: recipeBuilding.area,
        };
    }
    return solverRecipes;
}

function compileSolverInputs(gameData: GameData, store: PlannerState): Record<string, SolverInput> {
    const solverInputs: Record<string, SolverInput> = {};

    for (const input of store.input.items) {
        if (!input.itemId) {
            continue;
        }

        const rate = input.unlimited ? Infinity : input.rate;
        const relativeValue = 1;
        if (solverInputs[input.itemId]) {
            solverInputs[input.itemId].rate += rate;
        }
        else {
            solverInputs[input.itemId] = {
                rate,
                relativeValue,
            };
        }
    }

    for (const inputResource of store.input.resources) {
        const resource = gameData.resources[inputResource.itemId];
        if (!resource) {
            console.error(`Input resource ${inputResource.itemId} has no associated data`);
        }

        const rate = inputResource.unlimited ? Infinity : inputResource.rate;
        const relativeValue = resource.relativeValue;
        if (solverInputs[inputResource.itemId]) {
            solverInputs[inputResource.itemId].rate += rate;
            if (relativeValue > solverInputs[inputResource.itemId].relativeValue) {
                solverInputs[inputResource.itemId].relativeValue = relativeValue;
            }
        }
        else {
            solverInputs[inputResource.itemId] = {
                rate,
                relativeValue,
            };
        }
    }

    if (store.input.allowHandGathered) {
        for (const [itemId, item] of Object.entries(gameData.items)) {
            if (item.isHandGathered) {
                solverInputs[itemId] = {
                    rate: Infinity,
                    relativeValue: 1,
                };
            }
        }
    }

    return solverInputs;
}

function compileSolverTargets(gameData: GameData, store: PlannerState): Record<string, SolverTarget> {
    const solverTargets: Record<string, SolverTarget> = {};
    for (const target of store.production.targets) {
        if (!target.itemId) {
            continue;
        }
        let rate = 0;
        if (target.mode === "itemsPerMinute") {
            rate = target.rate;
        }
        else if (target.mode === "fromRecipe") {
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
            rate = target.multiplier * targetProduct.perMinute;
        }
        if (rate === 0) {
            continue;
        }
        if (solverTargets[target.itemId]) {
            solverTargets[target.itemId].rate += rate;
        }
        else {
            solverTargets[target.itemId] = {
                rate,
            };
        }
    }
    return solverTargets;
}

function compileSolverObjectives(_gameData: GameData, store: PlannerState): SolverObjective[] {
    const solverObjectives: SolverObjective[] = store.production.targets
        .filter((t) => t.itemId)
        .filter((t) => t.mode === "maximize")
        .sort((a, b) => {
            if (a.priority > b.priority) return 1;
            if (a.priority < b.priority) return -1;
            return 0;
        })
        .map(({ itemId }) => ({ type: "maximizeItem", itemId: itemId! }));
    solverObjectives.push({ type: "minimizeResourceUsage" });
    return solverObjectives;
}

function cleanSolverProblem(solverProblem: SolverProblem): SolverProblem {
    cleanObjectives(solverProblem);
    cullUnreachable(solverProblem);
    return solverProblem;
}

function cleanObjectives(solverProblem: SolverProblem): void {
    for (const objective of solverProblem.objectives) {
        if (objective.type === "maximizeItem") {
            delete solverProblem.targets[objective.itemId];
        }
    }
    if (Object.keys(solverProblem.targets).length === 0) {
        solverProblem.objectives = solverProblem.objectives.filter((o) => o.type === "maximizeItem");
    }
}

function cullUnreachable(solverProblem: SolverProblem): void {
    const targetItemIds = Object.keys(solverProblem.targets);
    for (const objective of solverProblem.objectives) {
        if (objective.type === "maximizeItem") {
            targetItemIds.push(objective.itemId);
        }
    }

    const reachableRecipes = new Set<string>();
    const reachableItems = new Set<string>();

    function traverseRecipes(item: SolverItem) {
        if (!item) return;
        for (const recipeId of item.producedFromRecipes) {
            if (reachableRecipes.has(recipeId)) continue;
            const recipe = solverProblem.recipes[recipeId];
            if (!recipe) continue;
            reachableRecipes.add(recipeId);
            for (const ingredient of recipe.ingredients) {
                traverseRecipes(solverProblem.items[ingredient.itemId]);
            }
        }
    }

    for (const itemId of targetItemIds) {
        traverseRecipes(solverProblem.items[itemId]);
    }

    for (const recipeId of reachableRecipes) {
        const recipe = solverProblem.recipes[recipeId];
        if (!recipe) continue;
        for (const item of recipe.ingredients) {
            reachableItems.add(item.itemId);
        }
        for (const item of recipe.products) {
            reachableItems.add(item.itemId);
        }
    }

    for (const recipeKey of Object.keys(solverProblem.recipes)) {
        if (!reachableRecipes.has(recipeKey)) {
            delete solverProblem.recipes[recipeKey];
        }
    }
    for (const itemKey of Object.keys(solverProblem.items)) {
        if (!reachableItems.has(itemKey)) {
            delete solverProblem.items[itemKey];
            delete solverProblem.inputs[itemKey];
        }
    }
}
