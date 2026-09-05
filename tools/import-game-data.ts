import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import YAML from "yaml";

const CURRENT_VERSION = "v1.2";

const PROJECT_ROOT = path.join(import.meta.dirname, "../");
const INPUT_FILE = path.join(import.meta.dirname, "./game-data/satisfactory_data.yaml");
const OUTPUT_FILE = path.join(PROJECT_ROOT, `worker/game-data/${CURRENT_VERSION}/gameData.json`);

async function main() {
    const data = await loadGameData();
    const resources = getResources(data.resources);
    const buildings = getBuildings(data.buildables, data.buildableRecipes);
    const recipes = getRecipes(data.productionRecipes, resources);
    const items = getItems(data.items, recipes, resources);

    writeParsedData({
        version: CURRENT_VERSION,
        resources,
        buildings,
        recipes,
        items,
    });
}

async function loadGameData(): Promise<any> {
    return YAML.parse(await readFile(INPUT_FILE, "utf8"));
}

async function writeParsedData(gameData: any) {
    const json = JSON.stringify(gameData, null, 2);
    await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
    await writeFile(OUTPUT_FILE, json);
}

function getResources(resourcesData: Record<string, any>) {
    const resources: Record<string, any> = {};
    let highestMaxExtraction = 0;
    Object.entries(resourcesData).forEach(([_, resourceData]) => {
        if (Number.isFinite(resourceData.maxExtraction)) {
            if (resourceData.maxExtraction > highestMaxExtraction) {
                highestMaxExtraction = resourceData.maxExtraction;
            }
        }
    });

    Object.entries(resourcesData).forEach(([resourceKey, resourceData]) => {
        let maxExtraction = 0;
        let relativeValue = 1;
        if (Number.isFinite(resourceData.maxExtraction)) {
            maxExtraction = resourceData.maxExtraction;
            relativeValue = Math.floor(highestMaxExtraction / maxExtraction * 100);
        }
        resources[resourceKey] = {
            maxExtraction,
            relativeValue,
        };
    });

    return resources;
}

function getBuildings(
    buildablesData: Record<string, any>,
    buildableRecipesData: Record<string, any>,
) {
    const buildings: Record<string, any> = {};
    Object.entries(buildablesData).forEach(([buildingKey, buildingData]) => {
        if (!(buildingData.isProductionBuilding || buildingData.generator || buildingData.isResourceExtractor)) {
            return;
        }
        let power = 0;
        if (buildingData.generator) {
            power = -buildingData.generator.powerProduction;
        } else if (buildingData.powerConsumption) {
            power = buildingData.powerConsumption.value;
        }

        let area = 0;
        if (buildingData.size) {
            const { length, width } = buildingData.size;
            area = length * width;
        }

        let buildCost = [];
        const recipeData = Object.values(buildableRecipesData).find((recipe) => recipe.product === buildingKey);
        if (recipeData) {
            buildCost = recipeData.ingredients.map((ingredient: any) => ({
                itemId: ingredient.item,
                quantity: ingredient.quantity,
            }));
        } else {
            console.warn(`WARNING: Building ${buildingKey} has no build cost!`);
        }

        buildings[buildingKey] = {
            slug: buildingData.slug.replaceAll("-", "_"),
            name: buildingData.name,
            power,
            area,
            buildCost,
            isFicsmas: buildingData.event === "FICSMAS",
        };
    });
    return buildings;
}

function getRecipes(
    productionRecipesData: Record<string, any>,
    resources: Record<string, any>
) {
    const recipes: Record<string, any> = {};
    Object.entries((productionRecipesData)).forEach(([recipeKey, recipeData]) => {
        if (!recipeData.producedIn) {
            return;
        }
        const craftTime = recipeData.craftTime;
        const ingredients = recipeData.ingredients.map((ingredient: any) => {
            const perMinute = 60 * ingredient.quantity / craftTime;
            return {
                itemId: ingredient.item,
                perMinute,
            };
        });
        const products = recipeData.products.map((ingredient: any) => {
            const perMinute = 60 * ingredient.quantity / craftTime;
            return {
                itemId: ingredient.item,
                perMinute,
            };
        });

        let isConversion = false;
        if (recipeData.producedIn === "Desc_Converter_C") {
            const producesOnlyResources = products.every((p: any) => !!resources[p.itemId]);
            isConversion = producesOnlyResources;
        }

        recipes[recipeKey] = {
            slug: recipeData.slug.replaceAll("-", "_"),
            name: recipeData.name,
            isAlternate: recipeData.isAlternate,
            isConversion,
            ingredients,
            products,
            producedIn: recipeData.producedIn,
            isFicsmas: recipeData.event === "FICSMAS",
        };
    });

    recipes["Recipe_CUSTOM_UraniumPower_C"] = {
        slug: "uranium_power_recipe",
        name: "Uranium Power",
        isAlternate: false,
        isConversion: false,
        ingredients: [
            { itemId: "Desc_NuclearFuelRod_C", perMinute: 0.2 },
            { itemId: "Desc_Water_C", perMinute: 240 }
        ],
        products: [{ itemId: "Desc_NuclearWaste_C", perMinute: 10 }],
        producedIn: "Desc_GeneratorNuclear_C",
        isFicsmas: false,
    };

    recipes["Recipe_CUSTOM_PlutoniumPower_C"] = {
        slug: "plutonium_power_recipe",
        name: "Plutonium Power",
        isAlternate: false,
        isConversion: false,
        ingredients: [
            { itemId: "Desc_PlutoniumFuelRod_C", perMinute: 0.1 },
            { itemId: "Desc_Water_C", perMinute: 240 }
        ],
        products: [{ itemId: "Desc_PlutoniumWaste_C", perMinute: 1 }],
        producedIn: "Desc_GeneratorNuclear_C",
        isFicsmas: false,
    };

    recipes["Recipe_CUSTOM_FicsoniumPower_C"] = {
        slug: "ficsonium_power_recipe",
        name: "Ficsonium Power",
        isAlternate: false,
        isConversion: false,
        ingredients: [
            { itemId: "Desc_FicsoniumFuelRod_C", perMinute: 1 },
            { itemId: "Desc_Water_C", perMinute: 240 }
        ],
        products: [],
        producedIn: "Desc_GeneratorNuclear_C",
        isFicsmas: false,
    };
    return recipes;
}

function getItems(
    itemsData: Record<string, any>,
    recipes: Record<string, any>,
    resources: Record<string, any>,
) {
    const items: Record<string, any> = {};
    Object.entries(itemsData).forEach(([itemKey, itemData]) => {
        const usedInRecipes: string[] = [];
        const producedFromRecipes: string[] = [];
        Object.entries(recipes).forEach(([recipeKey, recipeData]) => {
            if (recipeData.ingredients.find((i: any) => i.itemId === itemKey)) {
                usedInRecipes.push(recipeKey);
            }
            if (recipeData.products.find((p: any) => p.itemId === itemKey)) {
                producedFromRecipes.push(recipeKey);
            }
        });

        if (usedInRecipes.length === 0 && producedFromRecipes.length === 0) return;
        let isResource = !!resources[itemKey];
        let isHandGathered = false;
        if (producedFromRecipes.length === 0 && !isResource) {
            isHandGathered = true;
        }
        items[itemKey] = {
            slug: itemData.slug.replaceAll("-", "_"),
            name: itemData.name,
            sinkPoints: itemData.isFluid ? 0 : itemData.sinkPoints,
            usedInRecipes,
            producedFromRecipes,
            isResource,
            isHandGathered,
            isFicsmas: itemData.event === "FICSMAS",
        };
    });
    return items;
}

await main();
