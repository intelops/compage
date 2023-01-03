import {DiagramMakerData, EditorMode, PositionAnchor} from 'diagram-maker';

export const getData = (parentWidth, parentHeight) => {
    const graph: DiagramMakerData<{}, {}> = {
        nodes: {
            // node1: {
            //     id: 'node1',
            //     typeId: 'node-type-circle',
            //     diagramMakerData: {
            //         position: {x: 200, y: 150},
            //         size: {width: 65, height: 65},
            //     },
            //     consumerData: {}
            // },
            // node2: {
            //     id: 'node2',
            //     typeId: 'node-type-rectangle',
            //     diagramMakerData: {
            //         position: {x: 400, y: 300},
            //         size: {width: 65, height: 65},
            //     },
            //     consumerData: {}
            // },
        },
        edges: {
            // edge1: {
            //     id: 'edge1',
            //     src: 'node1',
            //     dest: 'node2',
            //     diagramMakerData: {},
            //     consumerData: {}
            // },
        },
        panels: {
            library: {
                id: 'library',
                position: {x: 0, y: window.innerHeight/4},
                size: {width: 35, height: 310},
                positionAnchor: PositionAnchor.TOP_LEFT,
            },
            tools: {
                id: 'tools',
                position: {x: 0, y: window.innerHeight/4},
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
