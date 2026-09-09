import { useEffect, useRef } from "react";
import cytoscape, { type Core, type ElementDefinition } from "cytoscape";
import type { Edge, Graph, ItemNode, Node, RecipeNode } from "#lib/graph/graph";
import { cn, truncateFloat } from "#lib/utils";
import { graphLayout } from "./production-graph-layout";
import { graphStyles } from "./production-graph-styles";

function getNodeLabel(node: Node): string {
    if (node.type === "item") {
        return getItemNodeLabel(node);
    }
    return getRecipeNodeLabel(node);
}

function getItemNodeLabel(node: ItemNode): string {
    const label = node.name;
    const amountText = `${truncateFloat(node.rate)} / min`;
    return `${label}\n${amountText}`;
}

function getRecipeNodeLabel(node: RecipeNode): string {
    const label = node.name;
    const amountText = `${truncateFloat(node.multiplier)}x ${node.buildingName}`;
    return `${label}\n${amountText}`;
}

function getEdgeLabel(edge: Edge): string {
    const label = edge.itemName;
    const amountText = `${truncateFloat(edge.rate)} / min`;
    return `${label}\n${amountText}`;
}

function toCytoscapeElements(graph: Graph): ElementDefinition[] {
    const nodes: ElementDefinition[] = graph.nodes.map((node) => ({
        data: {
            id: node.id,
            type: node.type,
            subtype: node.subtype,
            name: node.name,
            rate: "rate" in node ? node.rate : undefined,
            multiplier: "multiplier" in node ? node.multiplier : undefined,
            buildingName: "buildingName" in node ? node.buildingName : undefined,
            label: getNodeLabel(node),
        },
    }));

    const edges: ElementDefinition[] = graph.edges.map((edge, index) => ({
        data: {
            id: `${edge.from}->${edge.to}:${edge.itemId}:${index}`,
            source: edge.from,
            target: edge.to,
            itemId: edge.itemId,
            itemName: edge.itemName,
            rate: edge.rate,
            label: getEdgeLabel(edge),
        },
    }));

    return [...nodes, ...edges];
}

function getNodeFromCytoscapeData(node: cytoscape.NodeSingular): Node {
    const data = node.data();

    if (data.type === "recipe") {
        return {
            type: "recipe",
            subtype: data.subtype,
            id: data.id,
            name: data.name,
            multiplier: data.multiplier,
            buildingName: data.buildingName,
        };
    }

    return {
        type: "item",
        subtype: data.subtype,
        id: data.id,
        name: data.name,
        rate: data.rate,
    };
}

function setCyListeners(cy: cytoscape.Core) {
    cy.on('select', 'node', function (e) {
        e.target.addClass('selected');
        e.target.outgoers('edge').addClass('selected').addClass('selected-outgoing');
        e.target.incomers('edge').addClass('selected').addClass('selected-incoming');
    });

    cy.on('unselect', 'node', function (e) {
        e.target.removeClass('selected');
        e.target.outgoers('edge').removeClass('selected').removeClass('selected-outgoing');
        e.target.incomers('edge').removeClass('selected').removeClass('selected-incoming');
    });

    cy.on('grab', 'node', function (e) {
        e.target.addClass('grabbed');
        e.target.outgoers('edge').addClass('grabbed').addClass('grabbed-outgoing');
        e.target.incomers('edge').addClass('grabbed').addClass('grabbed-incoming');
    });

    cy.on('free', 'node', function (e) {
        e.target.removeClass('grabbed');
        e.target.outgoers('edge').removeClass('grabbed').removeClass('grabbed-outgoing');
        e.target.incomers('edge').removeClass('grabbed').removeClass('grabbed-incoming');
    });

    // cy.on('mouseover', 'node', function (e) {
    //     const nodeId = e.target.id() as string;
    //     if (popperRef.current?.nodeId === nodeId) return;
    //     deactivatePopper(cy);
    //     activatePopper(cy, e.target);
    // });

    // cy.on('mouseout', 'node', function (e) {
    //     const nodeId = e.target.id() as string;
    //     if (popperRef.current?.nodeId === nodeId) {
    //         deactivatePopper(cy);
    //     }
    // });
}

export interface ProductionGraphProps {
    graph: Graph;
    onNodeSelect?: (node: Node | null) => void;
    className?: string;
}

export function ProductionGraph({
    graph,
    onNodeSelect,
    className,
}: ProductionGraphProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<Core | null>(null);
    const graphRef = useRef(graph);
    const onNodeSelectRef = useRef(onNodeSelect);

    graphRef.current = graph;
    onNodeSelectRef.current = onNodeSelect;

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const cy = cytoscape({
            container: containerRef.current,
            elements: toCytoscapeElements(graphRef.current),
            style: graphStyles,
            layout: graphLayout,
            minZoom: 0.1,
            maxZoom: 4,
            wheelSensitivity: 1.0,
            boxSelectionEnabled: true,
            autoungrabify: false,
            autounselectify: false,
        });

        cyRef.current = cy;
        setCyListeners(cyRef.current);

        cy.on("tap", "node", (event) => {
            const node = event.target;

            onNodeSelectRef.current?.(
                getNodeFromCytoscapeData(node),
            );
        });

        cy.on("tap", (event) => {
            if (event.target === cy) {
                cy.nodes().unselect();
                onNodeSelectRef.current?.(null);
            }
        });

        return () => {
            cy.destroy();
            cyRef.current = null;
        };
    }, []);

    useEffect(() => {
        const cy = cyRef.current;

        if (!cy) {
            return;
        }

        const selectedNodeId = cy
            .nodes(":selected")
            .first()
            .data("id");

        cy.elements().remove();
        cy.add(toCytoscapeElements(graph));

        if (selectedNodeId) {
            const selectedNode = cy.getElementById(selectedNodeId);

            if (selectedNode.nonempty()) {
                selectedNode.select();
            }
        }

        cy.layout(graphLayout).run();
    }, [graph]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "w-full h-full",
                className
            )}
        />
    );
}
