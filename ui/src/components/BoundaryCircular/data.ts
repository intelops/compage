import {DiagramMakerData, EditorMode, PositionAnchor} from 'diagram-maker';

export const getData = (parentWidth, parentHeight) => {
    const graph: DiagramMakerData<{}, {}> = {
        nodes: {
            node1: {
                id: 'node1',
                typeId: 'testId-normal',
                diagramMakerData: {
                    position: {x: 200, y: 150},
                    size: {width: 100, height: 100},
                },
            },
            node2: {
                id: 'node2',
                typeId: 'testId-normal',
                diagramMakerData: {
                    position: {x: 400, y: 300},
                    size: {width: 100, height: 100},
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
                position: {x: 0, y: parentHeight / 2},
                size: {width: 250, height: 400},
                positionAnchor: PositionAnchor.TOP_RIGHT,
            },
            tools: {
                id: 'tools',
                position: {x: 0, y: parentHeight / 2},
                size: {width: 250, height: 400},
                positionAnchor: PositionAnchor.TOP_LEFT,
            },
        },
        workspace: {
            scale: 1,
            // position: {x: 0, y: 0},
            position: { x: parentWidth, y: 0 },
            canvasSize: {width: parentWidth, height: parentHeight},
            viewContainerSize: {width: parentWidth, height: parentHeight},
        },
        editor: {mode: EditorMode.DRAG},
    };
    return graph;
} 
