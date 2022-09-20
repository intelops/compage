import {DiagramMakerData, EditorMode, PositionAnchor} from 'diagram-maker';

export const getData = (parentWidth, parentHeight) => {
    const graph: DiagramMakerData<{}, {}> = {
        nodes: {
            node1: {
                id: 'node1',
                typeId: 'node-type-circle',
                diagramMakerData: {
                    position: {x: 200, y: 150},
                    size: {width: 65, height: 65},
                },
            },
            node2: {
                id: 'node2',
                typeId: 'node-type-rectangle',
                diagramMakerData: {
                    position: {x: 400, y: 300},
                    size: {width: 65, height: 65},
                },
            },
        },
        edges: {
            edge1: {
                id: 'edge1',
                src: 'node1',
                dest: 'node2',
                diagramMakerData: {},
            },
        },
        panels: {
            library: {
                id: 'library',
                position: {x: 0, y: 0},
                size: {width: 35, height: 290},
                positionAnchor: PositionAnchor.TOP_LEFT,
            },
            tools: {
                id: 'tools',
                position: {x: 0, y: 0},
                size: {width: 35, height: 290},
                positionAnchor: PositionAnchor.TOP_RIGHT,
            },
        },
        workspace: {
            scale: 1,
            position: {x: 40, y: 75},
            canvasSize: {width: window.innerWidth * 0.55, height: window.innerHeight * 0.85},
            viewContainerSize: {width: window.innerWidth * 0.55, height: window.innerHeight * 0.85},
        },
        editor: {mode: EditorMode.DRAG},
    };
    return graph;
} 
