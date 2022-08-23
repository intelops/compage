import ReactDOM from "react-dom";
import {
    ConnectorPlacement,
    DiagramMaker,
    EditorMode,
    Event,
    Shape,
    VisibleConnectorTypes,
    WorkspaceActions
} from "diagram-maker";
import "diagram-maker/dist/diagramMaker.css";
import React, {useRef} from "react";

export const DiagramMakerContainer = () => {
    const containerRef = useRef() as any;
    const diagramMakerRef = useRef() as any;

    React.useEffect(() => {
        let shape, connectorPlacement, showArrowhead, plugin
        let initialData = {
            editor: {mode: EditorMode.DRAG},
            workspace: {
                position: {x: 0, y: 0},
                scale: 1,
                canvasSize: {width: 3200, height: 1600},
                viewContainerSize: {width: window.innerWidth, height: window.innerHeight},
            }, nodes: {
                // a: {
                //     id: "a", diagramMakerData: {
                //         position: {
                //             x: 200, y: 100
                //         }, size: {
                //             width: 100, height: 100
                //         }
                //     }
                // }
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
            }, edges: {
                edge1: {
                    id: 'edge1',
                    src: 'node1',
                    dest: 'node2',
                    diagramMakerData: {},
                },
            }, panels: {}
        };
        diagramMakerRef.current = new DiagramMaker(containerRef.current, {
            options: {
                connectorPlacement: connectorPlacement || ConnectorPlacement.LEFT_RIGHT,
                showArrowhead: showArrowhead || false,
            },
            renderCallbacks: {
                destroy: (container) => {
                    ReactDOM.unmountComponentAtNode(container);
                },
                node: (node, container) => {
                    ReactDOM.render(<Node
                        //TODO
                        // id={node.id}
                        {...node.diagramMakerData.size}
                        selected={node.diagramMakerData.selected}
                    />, container);
                }, edge: () => {
                }, panels: {}
            },
            nodeTypeConfig: {
                'testId-centered': {
                    size: {width: 100, height: 100},
                    connectorPlacementOverride: ConnectorPlacement.CENTERED,
                },
                'testId-dead': {
                    size: {width: 150, height: 50},
                    connectorPlacementOverride: ConnectorPlacement.LEFT_RIGHT,
                    visibleConnectorTypes: VisibleConnectorTypes.NONE,
                },
                'testId-dropdown': {
                    size: {width: 150, height: 50},
                    connectorPlacementOverride: ConnectorPlacement.LEFT_RIGHT,
                },
                'testId-end': {
                    size: {width: 150, height: 50},
                    connectorPlacementOverride: ConnectorPlacement.LEFT_RIGHT,
                    visibleConnectorTypes: VisibleConnectorTypes.INPUT_ONLY,
                },
                'testId-input': {
                    size: {width: 150, height: 50},
                    connectorPlacementOverride: ConnectorPlacement.LEFT_RIGHT,
                },
                'testId-normal': {
                    size: {width: 150, height: 50},
                    connectorPlacementOverride: connectorPlacement || ConnectorPlacement.LEFT_RIGHT,
                    shape: shape || Shape.RECTANGLE,
                },
                'testId-normalWithSize': {
                    size: {width: 150, height: 50},
                    connectorPlacementOverride: connectorPlacement || ConnectorPlacement.LEFT_RIGHT,
                    shape: shape || Shape.RECTANGLE,
                },
                'testId-start': {
                    size: {width: 150, height: 50},
                    connectorPlacementOverride: ConnectorPlacement.LEFT_RIGHT,
                    visibleConnectorTypes: VisibleConnectorTypes.OUTPUT_ONLY,
                },
                'testId-topBottom': {
                    size: {width: 150, height: 50},
                    connectorPlacementOverride: ConnectorPlacement.TOP_BOTTOM,
                },
            },
        }, {
            consumerEnhancer: addDevTools(),
            eventListener: plugin ? (event) => {
                handleTestPluginEvent(event, diagramMakerRef.current);
            } : undefined,
            initialData
        });
        diagramMakerRef.current.store.subscribe((e) => {
            const state = diagramMakerRef.current.store.getState();
            console.log(state);
        });
    }, []);
    return (<div style={{display: "flex", flexDirection: "column", height: "900px"}}>
        <button onClick={() => {
            diagramMakerRef.current.api.fit();
        }}> Reset
        </button>
        <div style={{
            position: "relative", height: "100%", border: "1px solid red"
        }}>
            <div ref={containerRef}/>
        </div>
    </div>);
}

export function addDevTools() {
    if (process.env.NODE_ENV === 'development') {
        const windowAsAny = window as any;
        // eslint-disable-next-line no-underscore-dangle
        return windowAsAny.__REDUX_DEVTOOLS_EXTENSION__ && windowAsAny.__REDUX_DEVTOOLS_EXTENSION__();
    }
    return undefined;
}


export function handleTestPluginEvent(event: any, diagramMaker: any) {
    if (event.type === Event.LEFT_CLICK && event.target.type === 'testPlugin') {
        const state = diagramMaker.store.getState();
        if (!state.plugins) return;
        const position = state.plugins.testPlugin.data.workspacePos;

        diagramMaker.api.dispatch({
            payload: {position},
            type: WorkspaceActions.WORKSPACE_DRAG,
        });
    }
}

function Node({selected, width, height}) {
    return (<div
        style={{
            width, height, background: "white", padding: 8, border: selected ? "1px solid red" : undefined
        }}
    >
        Component
    </div>);
}