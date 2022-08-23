import ReactDOM from "react-dom";
import {ConnectorPlacement, DiagramMaker, EditorMode, Shape, VisibleConnectorTypes} from "diagram-maker";
import "diagram-maker/dist/diagramMaker.css";
import React, {useRef} from "react";

export const DiagramMakerContainer = () => {
    const containerRef = useRef();
    const diagramMakerRef = useRef();

    React.useEffect(() => {
        let shape, connectorPlacement, showArrowhead
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
                        id={node.id}
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
            initialData: {

                editor: {mode: EditorMode.DRAG},
                workspace: {
                    position: {x: 0, y: 0},
                    scale: 1,
                    canvasSize: {width: 3200, height: 1600},
                    viewContainerSize: {width: window.innerWidth, height: window.innerHeight},
                }, nodes: {
                    a: {
                        id: "a", diagramMakerData: {
                            position: {
                                x: 200, y: 100
                            }, size: {
                                width: 100, height: 100
                            }
                        }
                    }, b: {
                        id: "b", diagramMakerData: {
                            position: {
                                x: 200, y: 200
                            }, size: {
                                width: 100, height: 100
                            }
                        }
                    }, c: {
                        id: "c", diagramMakerData: {
                            position: {
                                x: 300, y: 100
                            }, size: {
                                width: 100, height: 100
                            }
                        }
                    }
                }
            }
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

// export function addDevTools() {
//     if (process.env.NODE_ENV === 'development') {
//         const windowAsAny = window as any;
//         // eslint-disable-next-line no-underscore-dangle
//         return windowAsAny.__REDUX_DEVTOOLS_EXTENSION__ && windowAsAny.__REDUX_DEVTOOLS_EXTENSION__();
//     }
//     return undefined;
// }

function Node({selected, width, height}) {
    return (<div
        style={{
            width, height, background: "white", padding: 8, border: selected ? "1px solid red" : undefined
        }}
    >
        Component
    </div>);
}