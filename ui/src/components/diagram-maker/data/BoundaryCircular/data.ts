/* tslint:disable:no-empty */
import {DiagramMakerData, EditorMode, PositionAnchor} from 'diagram-maker';

export const getData = (parentWidth, parentHeight, currentConfig: string) => {
    let nodes = {};
    let edges = {};
    if (currentConfig === undefined
        || currentConfig === "undefined"
        || currentConfig === null
        || currentConfig === ""
        || (!currentConfig || currentConfig === "{}")) {
    } else {
        const currentConfigJson = JSON.parse(currentConfig);
        if (currentConfigJson && currentConfigJson?.nodes && Object.keys(currentConfigJson.nodes).length > 0) {
            nodes = currentConfigJson.nodes;
        }
        if (currentConfigJson && currentConfigJson?.nodes && Object.keys(currentConfigJson.edges).length > 0) {
            edges = currentConfigJson.edges;
        }
    }
    const graph: DiagramMakerData<{}, {}> = {
        nodes,
        edges,
        panels: {
            library: {
                id: 'library',
                position: {x: 0, y: window.innerHeight / 4},
                size: {width: 35, height: 310},
                positionAnchor: PositionAnchor.TOP_LEFT,
            },
            tools: {
                id: 'tools',
                position: {x: 0, y: window.innerHeight / 4},
                size: {width: 35, height: 310},
                positionAnchor: PositionAnchor.TOP_RIGHT,
            },
        },
        workspace: {
            scale: 1,
            position: {x: 40, y: 75},
            canvasSize: {width: window.innerWidth, height: window.innerHeight},
            viewContainerSize: {width: window.innerWidth, height: window.innerHeight},
        },
        editor: {mode: EditorMode.DRAG},
    };
    return graph;
};
