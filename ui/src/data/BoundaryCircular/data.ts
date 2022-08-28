import {DiagramMakerData, EditorMode, PositionAnchor} from 'diagram-maker';

export const getData = (parentWidth, parentHeight) => {
    const graph: DiagramMakerData<{}, {}> = {
        nodes: {
            node1: {
                id: 'node1',
                typeId: 'testId-normal',
                diagramMakerData: {
                    position: {x: 200, y: 150},
                    size: {width: 50, height: 50},
                },
            },
            node2: {
                id: 'node2',
                typeId: 'testId-normal',
                diagramMakerData: {
                    position: {x: 400, y: 300},
                    size: {width: 50, height: 50},
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
                position: {x: 0, y: parentHeight / 3},
                size: {width: parentWidth/3, height: parentHeight/1.5},
                positionAnchor: PositionAnchor.TOP_LEFT,
            },
            tools: {
                id: 'tools',
                position: {x: 0, y:   parentHeight },
                size: {width: parentWidth/3, height: parentHeight/1.5},
                positionAnchor: PositionAnchor.TOP_LEFT,
            },
        },
        workspace: {
            scale: 1,
            position: {x: 0, y: 0},
            // position: { x: parentWidth, y: 0 },
            canvasSize: {width: parentWidth, height: parentHeight},
            viewContainerSize: {width: parentWidth, height: parentHeight},
        },
        editor: {mode: EditorMode.DRAG},
    };
    return graph;
} 
