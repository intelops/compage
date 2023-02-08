import {DiagramMakerData, EditorMode, PositionAnchor} from 'diagram-maker';

export const getData = (parentWidth, parentHeight, currentConfig: string) => {
    const currentConfigJson = JSON.parse(currentConfig);
    let nodes = {};
    let edges = {};
    debugger
    if (currentConfigJson && Object.keys(currentConfigJson.nodes).length > 0) {
        nodes = currentConfigJson.nodes;
    }
    if (currentConfigJson && Object.keys(currentConfigJson.edges).length > 0) {
        edges = currentConfigJson.edges;
    }
    const graph: DiagramMakerData<{}, {}> = {
        nodes: nodes,
        edges: edges,
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
} 
