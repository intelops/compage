import {getCurrentConfig, getModifiedState, setModifiedState} from "../../../utils/localstorageClient";
import {CompageEdge, CompageJson, CompageNode} from "../models";

export const cleanse = (state: string) => {
    if (state === undefined || state === null || (!state || state === "{}")) {
        // happens at the beginning with value "{}"
        return state;
    }
    const stateJson = JSON.parse(state);
    // TODO this is a hack as there is no NODE_UPDATE action in diagram-maker. We may later update this impl when we fork diagram-maker repo.
    // update state from localstorage with additional properties added from UI (Post node creation)
    const modifiedState = getModifiedState();
    if (modifiedState && modifiedState !== "{}") {
        const parsedModifiedState = JSON.parse(modifiedState);
        // sometimes it may happen that the user removes node from the diagram but modifiedState had no knowledge of it. In that case, we can check for the keys presence in the state and if not found, get the node removed from state.
        const toBeRemovedNodes = [];
        for (const key of Object.keys(parsedModifiedState?.nodes)) {
            if (key in stateJson.nodes) {
                stateJson.nodes[key].consumerData = {...stateJson.nodes[key].consumerData, ...parsedModifiedState.nodes[key].consumerData};
            } else {
                // node has been deleted but modifiedState still has the reference, we have to explicitly remove the node
                toBeRemovedNodes.push(key);
            }
        }
        // sometimes it may happen that the user removes edge from the diagram but modifiedState had no knowledge of it. In that case, we can check for the keys presence in the state and if not found, get the edge removed from state.
        const toBeRemovedEdges = [];
        for (const key of Object.keys(parsedModifiedState?.edges)) {
            if (key in stateJson.edges) {
                stateJson.edges[key].consumerData = {...stateJson.edges[key].consumerData, ...parsedModifiedState.edges[key].consumerData};
            } else {
                // edge has been deleted but modifiedState still has the reference, we have to explicitly remove the edge
                toBeRemovedEdges.push(key);
            }
        }
        // remove the nodes which aren't in the state anymore.
        for (const element of toBeRemovedNodes) {
            delete parsedModifiedState.nodes[element];
        }
        // remove the edges which aren't in the state anymore.
        for (const element of toBeRemovedEdges) {
            delete parsedModifiedState.edges[element];
        }
        // update back to localstorage.
        setModifiedState(JSON.stringify(parsedModifiedState));
    }
    return stateJson;
};

export const removeUnwantedKeys = (state: string) => {
    if (state === undefined || state === null || (!state || state === "{}")) {
        // happens at the beginning with value "{}"
        return state;
    }
    const isObject = (obj) => {
        return obj !== undefined && obj !== null && obj.constructor === Object;
    };
    let stateJson;
    if (!isObject(state)) {
        stateJson = JSON.parse(state);
    } else {
        stateJson = state;
    }
    // delete unwanted stuff from state.
    delete stateJson.panels;
    delete stateJson.plugins;
    delete stateJson?.potentialEdge;
    delete stateJson.potentialNode;
    delete stateJson.editor;
    delete stateJson?.undoHistory;
    delete stateJson.workspace;
    // nodes
    // tslint:disable-next-line: forin
    for (const key in stateJson.nodes) {
        delete stateJson.nodes[key]?.diagramMakerData;
    }
    // edges
    // tslint:disable-next-line: forin
    for (const key in stateJson.edges) {
        delete stateJson.edges[key]?.diagramMakerData;
    }
    return stateJson;
};

export const getParsedModifiedState = (): CompageJson => {
    // retrieve current modifiedState
    // logic is to store the dialog-state in localstorage and then refer it in updating state.
    const modifiedState = getModifiedState();

    if (modifiedState && modifiedState !== "{}") {
        return JSON.parse(modifiedState);
    } else {
        return {
            nodes: new Map<string, CompageNode>(),
            edges: new Map<string, CompageEdge>()
        };
    }
};


export const getParsedCurrentConfig = (): CompageJson => {
    const currentConfig = getCurrentConfig();

    if (currentConfig && currentConfig !== "{}") {
        return JSON.parse(currentConfig);
    } else {
        return {
            nodes: new Map<string, CompageNode>(),
            edges: new Map<string, CompageEdge>(),
            editor: {},
            panels: {},
            potentialEdge: {},
            undoHistory: {},
            plugins: {},
            potentialNode: {},
            workspace: {}
        };
    }
};
