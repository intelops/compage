import ReactDOM from "react-dom";
import {DiagramMaker, EditorMode} from "diagram-maker";
import "diagram-maker/dist/diagramMaker.css";
import React, {useRef} from "react";

export const DiagramMakerContainer = () => {
    const containerRef = useRef();
    const diagramMakerRef = useRef();

    React.useEffect(() => {
        diagramMakerRef.current = new DiagramMaker(containerRef.current, {
            options: {
                showArrowhead: true
            }, renderCallbacks: {
                node: (node, container) => {
                    ReactDOM.render(<Node
                        id={node.id}
                        {...node.diagramMakerData.size}
                        selected={node.diagramMakerData.selected}
                    />, container);
                }, edge: () => {
                }, destroy: (container) => {
                    ReactDOM.unmountComponentAtNode(container);
                }, panels: {}
            }
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

function Node({selected, width, height}) {
    return (<div
        style={{
            width, height, background: "white", padding: 8, border: selected ? "1px solid red" : undefined
        }}
    >
        Component
    </div>);
}