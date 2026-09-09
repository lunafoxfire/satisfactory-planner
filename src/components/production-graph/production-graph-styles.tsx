import type { StylesheetJson } from "cytoscape";

const baseSat = '77%';
const baseLight = '63%';
const selectSat = '58%';
const selectLight = '58%';

export const graphColors = {
    // nodes
    targetProduct: { base: `hsl(128, ${baseSat}, ${baseLight})`, selected: `hsl(128, ${selectSat}, ${selectLight})` },
    sideProduct: { base: `hsl(311, ${baseSat}, ${baseLight})`, selected: `hsl(311, ${selectSat}, ${selectLight})` },
    inputItem: { base: `hsl(0, ${baseSat}, ${baseLight})`, selected: `hsl(0, ${selectSat}, ${selectLight})` },
    resource: { base: `hsl(31, ${baseSat}, ${baseLight})`, selected: `hsl(31, ${selectSat}, ${selectLight})` },
    handGathered: { base: `hsl(261, ${baseSat}, ${baseLight})`, selected: `hsl(261, ${selectSat}, ${selectLight})` },

    recipe: { base: `hsl(197, ${baseSat}, ${baseLight})`, selected: `hsl(197, ${selectSat}, ${selectLight})` },
    nuclear: { base: `hsl(50, ${baseSat}, ${baseLight})`, selected: `hsl(50, ${selectSat}, ${selectLight})` },

    // edges
    edge: { line: '#999999', label: '#eeeeee' },
    incoming: { line: `hsl(31, ${baseSat}, ${baseLight})`, label: `hsl(31, ${baseSat}, ${baseLight})` },
    outgoing: { line: `hsl(128, ${baseSat}, ${baseLight})`, label: `hsl(128, ${baseSat}, ${baseLight})` },
};

export const graphStyles: StylesheetJson = [
    {
        // ====== BASE ====== //
        selector: 'core',
        style: {
            'active-bg-color': '#000',
            'active-bg-opacity': 0,
            'active-bg-size': 0,
            'selection-box-color': '#000',
            'selection-box-border-color': '#000',
            'selection-box-border-width': 0,
            'selection-box-opacity': 0,
            'outside-texture-bg-color': '#000',
            'outside-texture-bg-opacity': 0,
        },
    },
    {
        selector: 'node',
        style: {
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'height': '30px',
            'width': '150px',
            'text-max-width': '157px',
            'padding-top': '20px',
            'overlay-padding': 0,
            'overlay-opacity': 0,
            'text-wrap': 'wrap',
            'font-size': '14px',
        },
    },
    {
        selector: 'edge',
        style: {
            'label': 'data(label)',
            'width': 1,
            'curve-style': 'bezier',
            'control-point-step-size': 100,
            'target-arrow-shape': 'triangle-backcurve',
            'arrow-scale': 1.2,
            'overlay-padding': 0,
            'overlay-opacity': 0,
            'text-wrap': 'wrap',
            'font-size': '14px',
            'color': graphColors.edge.label,
            'line-color': graphColors.edge.line,
            'target-arrow-color': graphColors.edge.line,
        },
    },
    {
        selector: 'edge.loop',
        style: {
            'loop-direction': '180deg',
            'loop-sweep': '-40deg',
            'edge-distances': 'node-position',
            'source-endpoint': '-15% 50%',
            'target-endpoint': '15% 50%',
        },
    },


    // ====== NODES ====== //
    {
        selector: 'node[type="item"]',
        style: {
            'shape': 'ellipse',
            'height': '40px',
            'width': '130px',
        },
    },
    {
        selector: 'node[type="recipe"]',
        style: {
            'shape': 'round-rectangle',
        },
    },
    {
        selector: 'node.selected, node.grabbed',
        style: {
            'z-index': 100,
            'height': '45px',
            'width': '195px',
            'text-max-width': '192px',
            'font-size': '16px',
            'font-weight': 'bold',
            'border-width': 2,
        },
    },
    {
        selector: 'node[type="item"].selected, node[type="item"].grabbed',
        style: {
            'height': '55px',
            'width': '170px',
        },
    },

    {
        selector: 'node[subtype="targetProduct"]',
        style: { 'background-color': graphColors.targetProduct.base },
    },
    {
        selector: 'node[subtype="targetProduct"].selected, node[subtype="targetProduct"].grabbed',
        style: { 'background-color': graphColors.targetProduct.selected },
    },
    {
        selector: 'node[subtype="sideProduct"]',
        style: { 'background-color': graphColors.sideProduct.base },
    },
    {
        selector: 'node[subtype="sideProduct"].selected, node[subtype="sideProduct"].grabbed',
        style: { 'background-color': graphColors.sideProduct.selected },
    },
    {
        selector: 'node[subtype="inputItem"]',
        style: { 'background-color': graphColors.inputItem.base },
    },
    {
        selector: 'node[subtype="inputItem"].selected, node[subtype="inputItem"].grabbed',
        style: { 'background-color': graphColors.inputItem.selected },
    },
    {
        selector: 'node[subtype="resource"]',
        style: { 'background-color': graphColors.resource.base },
    },
    {
        selector: 'node[subtype="resource"].selected, node[subtype="resource"].grabbed',
        style: { 'background-color': graphColors.resource.selected },
    },
    {
        selector: 'node[subtype="handGathered"]',
        style: { 'background-color': graphColors.handGathered.base },
    },
    {
        selector: 'node[subtype="handGathered"].selected, node[subtype="handGathered"].grabbed',
        style: { 'background-color': graphColors.handGathered.selected },
    },

    {
        selector: 'node[subtype="recipe"]',
        style: { 'background-color': graphColors.recipe.base },
    },
    {
        selector: 'node[subtype="recipe"].selected, node[subtype="recipe"].grabbed',
        style: { 'background-color': graphColors.recipe.selected },
    },
    {
        selector: 'node[subtype="nuclear"]',
        style: { 'background-color': graphColors.nuclear.base },
    },
    {
        selector: 'node[subtype="nuclear"].selected, node[subtype="nuclear"].grabbed',
        style: { 'background-color': graphColors.nuclear.selected },
    },


    // ====== EDGES ====== //
    {
        selector: 'edge.selected, edge.grabbed',
        style: {
            'width': 4,
            'font-size': '14px',
            'font-weight': 'bold',
            'text-outline-width': 2,
            'z-index': 100,
        },
    },
    {
        selector: 'edge.selected-incoming, edge.grabbed-incoming',
        style: {
            'color': graphColors.incoming.label,
            'line-color': graphColors.incoming.line,
            'target-arrow-color': graphColors.incoming.line,
        },
    },
    {
        selector: 'edge.selected-outgoing, edge.grabbed-outgoing',
        style: {
            'color': graphColors.outgoing.label,
            'line-color': graphColors.outgoing.line,
            'target-arrow-color': graphColors.outgoing.line,
        },
    },
];
