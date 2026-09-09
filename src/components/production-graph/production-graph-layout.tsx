import cytoscape from "cytoscape";
import klay from "cytoscape-klay";

cytoscape.use(klay);

export const graphLayout = {
    name: 'klay',
    padding: 40,
    klay: {
        direction: 'DOWN',
        edgeRouting: 'ORTHOGONAL',
        nodePlacement: 'SIMPLE',
        nodeLayering: 'NETWORK_SIMPLEX',
        edgeSpacingFactor: 0.1,
        inLayerSpacingFactor: 0.3,
        spacing: 100,
        thoroughness: 10,
    },
};
