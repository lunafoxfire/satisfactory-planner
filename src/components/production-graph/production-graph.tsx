import { useEffect, useRef } from "react";
import cytoscape, { type Core, type ElementDefinition, type StylesheetJson } from "cytoscape";
import type { Graph, Node } from "#lib/graph/graph";

export interface ProductionGraphProps {
    graph: Graph;
    onNodeSelect?: (node: Node | null) => void;
    className?: string;
}

const layoutOptions: cytoscape.LayoutOptions = {
    name: "cose",
    animate: false,
    fit: true,
    padding: 50,
};

const styles: StylesheetJson = [
    {
        selector: "node",
        style: {
            label: "data(name)",
            "text-valign": "center",
            "text-halign": "center",
            "text-wrap": "wrap",
            "text-max-width": "120px",
            "font-family": "JetBrains Mono",
            "font-size": 12,
            color: "#ffffff",
            "background-color": "#666666",
            width: 50,
            height: 50,
        },
    },
    {
        selector: 'node[type = "recipe"]',
        style: {
            shape: "round-rectangle",
            "background-color": "#444444",
            width: 100,
            height: 60,
        },
    },
    {
        selector: 'node[type = "finalProduct"]',
        style: {
            shape: "ellipse",
        },
    },
    {
        selector: 'node[type = "sideProduct"]',
        style: {
            shape: "ellipse",
        },
    },
    {
        selector: 'node[type = "inputItem"]',
        style: {
            shape: "ellipse",
        },
    },
    {
        selector: 'node[type = "resource"]',
        style: {
            shape: "diamond",
        },
    },
    {
        selector: 'node[type = "handGathered"]',
        style: {
            shape: "ellipse",
        },
    },
    {
        selector: "node:selected",
        style: {
            "border-width": 3,
            "border-color": "#ffffff",
        },
    },
    {
        selector: "edge",
        style: {
            width: 2,
            "line-color": "#777777",
            "target-arrow-color": "#777777",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(rate)",
            "font-family": "JetBrains Mono",
            "font-size": 10,
            color: "#aaaaaa",
            "text-background-color": "#111111",
            "text-background-opacity": 1,
            "text-background-padding": "2px",
        },
    },
    {
        selector: "edge:selected",
        style: {
            width: 3,
            "line-color": "#ffffff",
            "target-arrow-color": "#ffffff",
        },
    },
];

function toCytoscapeElements(graph: Graph): ElementDefinition[] {
    const nodes: ElementDefinition[] = graph.nodes.map((node) => ({
        data: {
            id: node.id,
            type: node.type,
            name: node.name,
            rate: "rate" in node ? node.rate : undefined,
            multiplier: "multiplier" in node ? node.multiplier : undefined,
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
        },
    }));

    return [...nodes, ...edges];
}

function getNodeFromCytoscapeData(node: cytoscape.NodeSingular): Node {
    const data = node.data();

    if (data.type === "recipe") {
        return {
            type: "recipe",
            id: data.id,
            name: data.name,
            multiplier: data.multiplier,
        };
    }

    return {
        type: data.type,
        id: data.id,
        name: data.name,
        rate: data.rate,
    };
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
            style: styles,
            layout: layoutOptions,
            minZoom: 0.1,
            maxZoom: 4,
            wheelSensitivity: 0.2,
            boxSelectionEnabled: true,
            autoungrabify: false,
            autounselectify: false,
        });

        cyRef.current = cy;

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

        cy.layout(layoutOptions).run();
    }, [graph]);

    return (
        <div
            ref={containerRef}
            className={className}
        />
    );
}
