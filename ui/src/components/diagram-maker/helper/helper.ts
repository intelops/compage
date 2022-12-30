import {getModifiedState, setModifiedState} from "../../../utils/localstorage-client";

export const cleanseState = (state: string) => {
    const stateJson = JSON.parse(state)
    if (stateJson === "{}") {
        // happens at the beginning with value "{}"
        return state;
    }
    // TODO this is a hack as there is no NODE_UPDATE action in diagram-maker. We may later update this impl when we fork diagram-maker repo.
    // update state from localstorage with additional properties added from UI (Post node creation)
    const modifiedState = getModifiedState();
    if (modifiedState && modifiedState !== "{}") {
        const parsedModifiedState = JSON.parse(modifiedState);
        // sometimes it may happen that the user removes node from the diagram but modifiedState had no knowledge of it. In that case, we can check for the keys presence in the state and if not found, get the node removed from state.
        const toBeRemovedNodes = []
        for (const key of Object.keys(parsedModifiedState.nodes)) {
            if (key in stateJson.nodes) {
                stateJson.nodes[key].consumerData = {...stateJson.nodes[key].consumerData, ...parsedModifiedState.nodes[key].consumerData}
            } else {
                // node has been deleted but modifiedState still has the reference, we have to explicitly remove the node
                toBeRemovedNodes.push(key)
            }
        }
        // sometimes it may happen that the user removes edge from the diagram but modifiedState had no knowledge of it. In that case, we can check for the keys presence in the state and if not found, get the edge removed from state.
        const toBeRemovedEdges = []
        for (const key of Object.keys(parsedModifiedState.edges)) {
            if (key in stateJson.edges) {
                stateJson.edges[key].consumerData = {...stateJson.edges[key].consumerData, ...parsedModifiedState.edges[key].consumerData}
            } else {
                // edge has been deleted but modifiedState still has the reference, we have to explicitly remove the edge
                toBeRemovedEdges.push(key)
            }
        }
        // remove the nodes which aren't in the state anymore.
        for (const element of toBeRemovedNodes) {
            delete parsedModifiedState.nodes[element]
        }
        // remove the edges which aren't in the state anymore.
        for (const element of toBeRemovedEdges) {
            delete parsedModifiedState.edges[element]
        }
        // update back to localstorage.
        setModifiedState(JSON.stringify(parsedModifiedState))
    }
    return JSON.stringify(stateJson);
}

export const removeUnwantedThings = (stateJson) => {
    // delete unwanted stuff from state.
    delete stateJson.panels
    delete stateJson.plugins
    delete stateJson.potentialEdge
    delete stateJson.potentialNode
    delete stateJson.editor
    delete stateJson.undoHistory
    delete stateJson.workspace
    // nodes
    for (const key in stateJson.nodes) {
        if (stateJson.nodes[key]) {
            const diagramMakerData = stateJson.nodes[key].diagramMakerData;
            delete diagramMakerData.position
            delete diagramMakerData.size
        }
    }
    // edges
    for (const key in stateJson.edges) {
        const diagramMakerData = stateJson.edges[key].diagramMakerData;
        delete diagramMakerData.position
        delete diagramMakerData.size
    }
    return stateJson;
}

// TODO refer directly currentProjectContext and get rid of this.
export const getParsedModifiedState = () => {
    // retrieve current modifiedState
    // logic is to store the dialog-state in localstorage and then refer it in updating state.
    const modifiedState = getModifiedState();

    if (modifiedState && modifiedState !== "{}") {
        return JSON.parse(modifiedState);
    } else {
        return {
            nodes: {},
            edges: {}
        }
    }
}
