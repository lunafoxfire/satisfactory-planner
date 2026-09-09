import type { GameData } from "#data/schema";
import type { SolveResult } from "#lib/solver/solver";

export type ItemNodeType =
    | "targetProduct"
    | "sideProduct"
    | "inputItem"
    | "resource"
    | "handGathered";

export type RecipeNodeType = "recipe";

export type NodeType = ItemNodeType | RecipeNodeType;

export type Node =
    | {
        type: ItemNodeType;
        id: string;
        name: string;
        rate: number;
    }
    | {
        type: RecipeNodeType;
        id: string;
        name: string;
        multiplier: number;
    };

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
            type: classifyInput(gameData, itemId),
            id: itemId,
            name: gameData.items[itemId]?.name ?? "<UNKNOWN>",
            rate: inputRate,
        });
    }

    for (const [itemId, outputRate] of Object.entries(solveResult.outputs)) {
        graph.nodes.push({
            type: classifyOutput(solveResult.targets, itemId),
            id: itemId,
            name: gameData.items[itemId]?.name ?? "<UNKNOWN>",
            rate: outputRate,
        });
    }

    for (const [recipeId, recipeMultiplier] of Object.entries(solveResult.recipes)) {
        graph.nodes.push({
            type: "recipe",
            id: recipeId,
            name: gameData.recipes[recipeId]?.name.replace("Alternate: ", "") ?? "<UNKNOWN>",
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

function classifyInput(gameData: GameData, itemId: string): ItemNodeType {
    if (gameData.resources[itemId]) {
        return "resource";
    }
    if (gameData.items[itemId]?.isHandGathered) {
        return "handGathered";
    }
    return "inputItem";
}

function classifyOutput(targets: Set<string>, itemId: string): ItemNodeType {
    if (targets.has(itemId)) {
        return "targetProduct";
    }
    return "sideProduct";
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
