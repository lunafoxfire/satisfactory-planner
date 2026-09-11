import type { GameData } from "#data/game-data-schema";
import type { SolveResult } from "#lib/solver/solver";

export type ItemNodeSubtype =
    | "targetProduct"
    | "sideProduct"
    | "inputItem"
    | "resource"
    | "handGathered";

export type RecipeNodeSubtype =
    | "recipe"
    | "nuclear";

export type NodeType = ItemNodeSubtype | RecipeNodeSubtype;

export interface ItemNode {
    type: "item",
    subtype: ItemNodeSubtype;
    id: string;
    name: string;
    rate: number;
}

export interface RecipeNode {
    type: "recipe",
    subtype: RecipeNodeSubtype;
    id: string;
    name: string;
    buildingName: string;
    multiplier: number;
}

export type Node = ItemNode | RecipeNode;

export interface Edge {
    from: string;
    to: string;
    itemId: string;
    itemName: string;
    rate: number;
}

export interface Graph {
    nodes: Node[];
    edges: Edge[];
}

interface SinkOrSource {
    nodeId: string;
    flow: number;
};

type ItemFlow = Record<string, {
    sinks: SinkOrSource[];
    sources: SinkOrSource[];
    sinkSum: number;
    sourceSum: number;
}>;

export function buildGraph(gameData: GameData, solveResult: SolveResult): Graph {
    const graph: Graph = {
        nodes: [],
        edges: [],
    };
    if (solveResult.status !== "success") return graph;

    // NODES
    for (const [itemId, inputRate] of Object.entries(solveResult.inputs)) {
        graph.nodes.push({
            type: "item",
            subtype: classifyInput(gameData, itemId),
            id: itemId,
            name: gameData.items[itemId]?.name ?? "<UNKNOWN>",
            rate: inputRate,
        });
    }

    for (const [itemId, outputRate] of Object.entries(solveResult.outputs)) {
        graph.nodes.push({
            type: "item",
            subtype: classifyOutput(solveResult.targets, itemId),
            id: itemId,
            name: gameData.items[itemId]?.name ?? "<UNKNOWN>",
            rate: outputRate,
        });
    }

    for (const [recipeId, recipeMultiplier] of Object.entries(solveResult.recipes)) {
        const recipe = gameData.recipes[recipeId];
        const building = recipe ? gameData.buildings[recipe.producedIn] : undefined;
        graph.nodes.push({
            type: "recipe",
            subtype: classifyRecipe(recipeId),
            id: recipeId,
            name: recipe?.name ?? "<UNKNOWN>",
            buildingName: building?.name ?? "<UNKNOWN>",
            multiplier: recipeMultiplier,
        });
    }


    // EDGES
    const itemFlows = mapItemFlows(solveResult, gameData);
    for (const [itemId, itemFlow] of Object.entries(itemFlows)) {

        for (const sink of itemFlow.sinks) {
            if (sink.flow === 0) continue;
            for (const source of itemFlow.sources) {
                if (source.flow === 0) continue;

                let edgeAmount = 0;
                if (sink.flow >= source.flow) {
                    edgeAmount = source.flow;
                    sink.flow -= edgeAmount;
                    source.flow = 0;
                }
                else {
                    edgeAmount = sink.flow;
                    source.flow -= edgeAmount;
                    sink.flow = 0;
                }

                if (edgeAmount !== 0) {
                    graph.edges.push({
                        from: source.nodeId,
                        to: sink.nodeId,
                        itemId,
                        itemName: gameData.items[itemId]?.name ?? "<UNKNOWN>",
                        rate: edgeAmount,
                    });
                }
            }
        }
    }

    return graph;
}

function classifyInput(gameData: GameData, itemId: string): ItemNodeSubtype {
    if (gameData.resources[itemId]) {
        return "resource";
    }
    if (gameData.items[itemId]?.isHandGathered) {
        return "handGathered";
    }
    return "inputItem";
}

function classifyOutput(targets: Set<string>, itemId: string): ItemNodeSubtype {
    if (targets.has(itemId)) {
        return "targetProduct";
    }
    return "sideProduct";
}

function classifyRecipe(itemId: string): RecipeNodeSubtype {
    if ([
        "Recipe_NuclearPower_C",
        "Recipe_PlutoniumPower_C",
        "Recipe_FicsoniumPower_C",
    ].includes(itemId)) {
        return "nuclear";
    }
    return "recipe";
}

function newItemFlowEntry() {
    return {
        sinks: [],
        sources: [],
        sinkSum: 0,
        sourceSum: 0,
    };
}

function mapItemFlows(solveResult: SolveResult, gameData: GameData): ItemFlow {
    const itemFlow: ItemFlow = {};
    if (solveResult.status !== "success") return itemFlow;

    for (const [recipeId, multiplier] of Object.entries(solveResult.recipes)) {
        const recipe = gameData.recipes[recipeId];

        for (const ingredient of recipe?.ingredients ?? []) {
            const flow = ingredient.perMinute * multiplier;
            if (!itemFlow[ingredient.itemId]) {
                itemFlow[ingredient.itemId] = newItemFlowEntry();
            }
            itemFlow[ingredient.itemId].sinkSum += flow;
            itemFlow[ingredient.itemId].sinks.push({
                nodeId: recipeId,
                flow,
            });
        }

        for (const product of recipe?.products ?? []) {
            const flow = product.perMinute * multiplier;
            if (!itemFlow[product.itemId]) {
                itemFlow[product.itemId] = newItemFlowEntry();
            }
            itemFlow[product.itemId].sourceSum += flow;
            itemFlow[product.itemId].sources.push({
                nodeId: recipeId,
                flow,
            });
        }
    }

    for (const [itemId, flow] of Object.entries(solveResult.inputs)) {
        if (!itemFlow[itemId]) {
            itemFlow[itemId] = newItemFlowEntry();
        }
        itemFlow[itemId].sourceSum += flow;
        itemFlow[itemId].sources.push({
            nodeId: itemId,
            flow,
        });
    }

    for (const [itemId, flow] of Object.entries(solveResult.outputs)) {
        if (!itemFlow[itemId]) {
            itemFlow[itemId] = newItemFlowEntry();
        }
        itemFlow[itemId].sinkSum += flow;
        itemFlow[itemId].sinks.push({
            nodeId: itemId,
            flow,
        });
    }

    return itemFlow;
}
