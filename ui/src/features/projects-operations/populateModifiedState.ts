import {getModifiedState, setModifiedState} from "../../utils/localstorage-client";
import {CompageJson, EdgeConsumerData, NodeConsumerData} from "../../components/diagram-maker/models";

export const getNodeConsumerData = (node: any) => {
    delete node.id;
    delete node.typeId;
    delete node.diagramMakerData;
    return node;
};

export const getEdgeConsumerData = (edge: any) => {
    delete edge.id;
    delete edge.dest;
    delete edge.diagramMakerData;
    delete edge.src;
    return edge;
};


export const updateModifiedState = (compageJson: CompageJson) => {
    const modifiedState = getModifiedState();
    if (!modifiedState
        || modifiedState === "{}"
        || Object.keys(JSON.parse(modifiedState)?.nodes).length === 0
        || Object.keys(JSON.parse(modifiedState)?.edges).length === 0) {
        const resultState = {
            nodes: {},
            edges: {}
        };

        // state has nodes
        if (Object.keys(compageJson?.nodes).length !== 0) {
            // iterate over nodes and check if they have any consumerData attached to them.
            // tslint:disable-next-line: forin
            for (const key in compageJson.nodes) {
                const consumerData: NodeConsumerData = compageJson.nodes[key]?.consumerData;
                if (consumerData && Object.keys(consumerData).length > 1) {
                    // add this node to modifiedState
                    resultState.nodes[key] = getNodeConsumerData(compageJson.nodes[key]);
                } else {
                    // TODO - monitor what happens when this block executed.
                    // add this node to modifiedState even if it has no values added yet.
                    resultState.nodes[key] = {
                        consumerData: {}
                    };
                }
            }
        }
        // state has edges
        if (Object.keys(compageJson?.edges).length !== 0) {
            // iterate over edges and check if they have any consumerData attached to them.
            // tslint:disable-next-line: forin
            for (const key in compageJson.edges) {
                const consumerData: EdgeConsumerData = compageJson.edges[key]?.consumerData;
                if (consumerData && Object.keys(consumerData).length > 0) {
                    // add this edge to modifiedState
                    resultState.edges[key] = getEdgeConsumerData(compageJson.edges[key]);
                } else {
                    // TODO - monitor what happens when this block executed.
                    // add this edge to modifiedState even if it has no values added yet.
                    resultState.edges[key] = {
                        consumerData: {}
                    };
                }
            }
        }
        if (Object.keys(resultState?.nodes).length !== 0
            || Object.keys(resultState?.edges).length !== 0) {
            setModifiedState(JSON.stringify(resultState));
        }
    }
};
