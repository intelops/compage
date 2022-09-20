import ReactDOM from "react-dom";
import {
    ConnectorPlacement,
    ConnectorPlacementType,
    ContextMenuRenderCallbacks,
    DiagramMaker,
    DiagramMakerAction,
    DiagramMakerActions,
    DiagramMakerData,
    DiagramMakerEdge,
    DiagramMakerNode,
    DiagramMakerPotentialNode,
    Event,
    Shape,
    ShapeType,
    WorkspaceActions
} from "diagram-maker";
import "diagram-maker/dist/diagramMaker.css";
import "./scss/common.css"
import "./scss/CircularNode.css"
import "./scss/RectangularNode.css"
import "./scss/Logger.css"

import React, {useRef} from "react";
import {
    createCircularNode,
    createPluginPanel,
    createRectangularConnectorNode,
    createRectangularNode,
    updateActionInLogger
} from "../../utils/utils";

import {useBeforeunload} from 'react-beforeunload';
import {Action, Dispatch} from "redux";
import {Grid} from "@mui/material";
import JSONPretty from "react-json-pretty";
import {getCurrentConfig, getCurrentState, setCurrentConfig, setCurrentState} from "../../service";
import {ToolPanel} from "../custom/tool-panel";
import {LibraryPanel} from "../custom/library-panel";
import {ContextNode} from "../custom/context-node";
import {ContextEdge} from "../custom/context-edge";
import {ContextPanel} from "../custom/context-panel";
import {ContextWorkspace} from "../custom/context-workspace";
import {EdgeBadge} from "../custom/edge-badge";
import {PotentialNode} from "../custom/potential-node";
import {getNodeTypeConfig} from "../../utils/nodeTypeConfig";

interface ArgTypes {
    initialData?: DiagramMakerData<{}, {}>;
    connectorPlacement?: ConnectorPlacementType;
    showArrowhead?: boolean;
    shape?: ShapeType;
    edgeBadge?: boolean;
    darkTheme?: boolean;
    actionInterceptor?: boolean;
    plugin?: boolean;
    onAction?: (...args: any) => void;
}

export const DiagramMakerContainer = ({
                                          initialData,
                                          connectorPlacement,
                                          showArrowhead,
                                          shape,
                                          edgeBadge,
                                          darkTheme,
                                          actionInterceptor,
                                          plugin,
                                          onAction,
                                      }: ArgTypes) => {
    const containerRef = useRef() as any;
    const diagramMakerRef = useRef() as any;
    const [diagramMaker, setDiagramMaker] = React.useState({
        state: "{}",
        config: "{}"
    });

    if (darkTheme) {
        document.body.classList.add('dm-dark-theme');
    } else {
        document.body.classList.remove('dm-dark-theme');
    }

    useBeforeunload((event) => {
        if (localStorage.getItem("RESET") === "false") {
            if ((diagramMaker.state !== "{}" && diagramMaker.state !== getCurrentState()) || (diagramMaker.config !== "{}" && diagramMaker.config !== getCurrentConfig())) {
                setCurrentState(diagramMaker.state)
                setCurrentConfig(diagramMaker.config)
                event.preventDefault();
            }
        } else {
            localStorage.setItem("RESET", "false")
        }
    });

    // clean unwanted data from state payload.
    const setData = (state: string) => {
        const backupState: string = state.slice();
        if (state) {
            const stateJson = JSON.parse(state)
            delete stateJson.panels
            delete stateJson.plugins
            delete stateJson.potentialEdge
            delete stateJson.potentialNode
            delete stateJson.editor
            delete stateJson.undoHistory
            delete stateJson.workspace
            // nodes
            for (let key in stateJson.nodes) {
                let diagramMakerData = stateJson.nodes[key].diagramMakerData;
                delete diagramMakerData.position
                delete diagramMakerData.size
            }
            // edges
            for (let key in stateJson.edges) {
                let diagramMakerData = stateJson.edges[key].diagramMakerData;
                delete diagramMakerData.position
                delete diagramMakerData.size
            }
            setDiagramMaker({
                config: backupState,
                state: JSON.stringify(stateJson)
            })
        }
    }

    React.useEffect(() => {
        // let shape, connectorPlacement, showArrowhead, plugin, edgeBadge
        let plugin, connectorPlacement
        // let initialData = BoundaryRectangularData
        // let connectorPlacement = ConnectorPlacementType.BOUNDARY
        let showArrowhead = true
        let shape = Shape.CIRCLE
        let edgeBadge = true
        let actionInterceptor = true
        let onAction: {
            action: 'action',
        }

        diagramMakerRef.current = new DiagramMaker(containerRef.current, {
            options: {
                connectorPlacement: connectorPlacement || ConnectorPlacement.LEFT_RIGHT,
                showArrowhead: showArrowhead || false,
            },
            renderCallbacks: {
                destroy: (container) => {
                    ReactDOM.unmountComponentAtNode(container);
                },
                node: (node: DiagramMakerNode<{}>, container: HTMLElement) => {
                    // not required as its now handled in css files.
                    // container.setAttribute("style", "border: 1px solid black");
                    if (node.typeId === 'node-type-circle') {
                        // return ReactDOM.render(<CircularNode
                        //     node={node}
                        // />, container);
                        return createCircularNode(node, container, () => {
                            alert("Selected : " + node.typeId + " : " + node.id);
                        });
                    }
                    // if (node.typeId === 'node-type-input') {
                    //     return createNodeWithInput(node, container);
                    // }
                    // if (node.typeId === 'node-type-dropdown') {
                    //     return createNodeWithDropdown(node, container);
                    // }
                    if (connectorPlacement === ConnectorPlacement.BOUNDARY) {
                        if (shape === Shape.CIRCLE) {
                            return createCircularNode(node, container, () => {
                                    alert("Selected : " + node.typeId + " : " + node.id);
                                }
                            );
                        }
                        return createRectangularConnectorNode(node, container, () => {
                            alert("Selected : " + node.typeId + " : " + node.id);
                        });
                    }
                    return createRectangularNode(node, container, () => {
                        // diagramMakerRef.current.api.dispatch()
                        alert("Selected : " + node.typeId + " : " + node.id);
                    });
                },
                edge: edgeBadge ? (edge: DiagramMakerEdge<{}>, container: HTMLElement) => {
                    return ReactDOM.render(<EdgeBadge id={edge.id.substring(0, 10)}/>, container);
                } : undefined,
                potentialNode: (node: DiagramMakerPotentialNode, container: HTMLElement) => {
                    return ReactDOM.render(<PotentialNode typeId={node.typeId}/>, container);
                },
                panels: {
                    library: (panel: any, state: any, container: HTMLElement) => {
                        return ReactDOM.render(<LibraryPanel/>, container);
                    },
                    ...(plugin && {
                        plugin: (
                            panel: any,
                            state: any,
                            container: HTMLElement,
                        ) => createPluginPanel(container, state),
                    }),
                    ...(!plugin && {
                        tools: (
                            panel: any,
                            state: any,
                            container: HTMLElement,
                        ) => {
                            return ReactDOM.render(<ToolPanel
                                diagramMakerRef={() => diagramMakerRef.current}/>, container);
                        },
                    }),
                },
                //This is the place to identify which element has been clicked
                contextMenu: {
                    node: (id: string | undefined, container: HTMLElement) => {
                        return ReactDOM.render(<ContextNode id={id}/>, container);
                    },
                    edge: (id: string | undefined, container: HTMLElement) => {
                        return ReactDOM.render(<ContextEdge id={id}/>, container);
                    },
                    panel: (id: string | undefined, container: HTMLElement) => {
                        return ReactDOM.render(<ContextPanel id={id}/>, container);
                    },
                    workspace: (container: HTMLElement) => {
                        return ReactDOM.render(<ContextWorkspace/>, container);
                    },
                } as ContextMenuRenderCallbacks,
            },
            actionInterceptor: (action: Action, next: Dispatch<Action>, getState: () => DiagramMakerData<{}, {}>) => {
                // onAction(action);
                if (actionInterceptor) {
                    const diagramMakerAction = action as DiagramMakerAction<{ odd: boolean }, {}>;
                    // if ("payload" in diagramMakerAction) {
                    //     console.log("++++++++++++++++++++++++++")
                    //     console.log("action : ", diagramMakerAction?.payload)
                    //     console.log("++++++++++++++++++++++++++")
                    // }
                    updateActionInLogger(action);
                    if (diagramMakerAction.type === DiagramMakerActions.DELETE_ITEMS
                        && "payload" in diagramMakerAction
                        && "nodeIds" in diagramMakerAction.payload
                        && diagramMakerAction.payload.nodeIds.length > 0) {
                        // stops from deleting nodes
                        // return;
                        console.log("Deleting node : ", diagramMakerAction.payload.nodeIds)
                    }
                    if (diagramMakerAction.type === DiagramMakerActions.NODE_SELECT && "payload" in diagramMakerAction) {
                        // console.log("Select node action : ", diagramMakerAction.payload)
                        // if return, state won't be updated
                        // return;
                    }

                    if (diagramMakerAction.type === DiagramMakerActions.NODE_CREATE
                        && "payload" in diagramMakerAction) {
                        diagramMakerAction.payload["consumerData"] = {
                            "test": "data",
                        };
                        next(diagramMakerAction);
                        return;
                    }

                    if (diagramMakerAction.type === DiagramMakerActions.EDGE_CREATE
                        && "payload" in diagramMakerAction) {
                        next(diagramMakerAction);
                        // the below creates reverse edge
                        // let id, dest, src
                        // if ("id" in diagramMakerAction.payload) {
                        //     id = diagramMakerAction.payload.id
                        // }
                        // if ("dest" in diagramMakerAction.payload) {
                        //     dest = diagramMakerAction.payload.dest
                        // }
                        // if ("src" in diagramMakerAction.payload) {
                        //     src = diagramMakerAction.payload.src
                        // }
                        // const newAction: CreateEdgeAction<{}> = {
                        //     type: DiagramMakerActions.EDGE_CREATE,
                        //     payload: {
                        //         id: `${id}-2`,
                        //         src: dest,
                        //         dest: src,
                        //     },
                        // };
                        // setTimeout(() => next(newAction), 1000);
                    }
                    next(action);
                } else {
                    updateActionInLogger(action);
                    next(action);
                }
            },
            nodeTypeConfig: getNodeTypeConfig(connectorPlacement, shape),
        }, {
            consumerEnhancer: addDevTools(),
            eventListener: plugin ? (event) => {
                handleTestPluginEvent(event, diagramMakerRef.current);
            } : undefined,
            initialData
        });

        // // to populate the current state in json pretty
        // diagramMakerRef.current.api.dispatch({
        //     type: EdgeActions.EDGE_MOUSE_OVER,
        // });
        let currentConfig = getCurrentConfig();
        if (currentConfig) {
            setData(currentConfig)
        }

        diagramMakerRef.current.store.subscribe(() => {
            const state = diagramMakerRef.current.store.getState();
            setData(JSON.stringify(state))
        });

    }, [plugin, initialData]);

    return <Grid container spacing={1}>
        <Grid item xs={8} md={8}>
            <div id="diagramMakerContainer" ref={containerRef}></div>
        </Grid>
        <Grid item xs={4} md={4} style={{
            width: "100%",
            overflow: "hidden"
        }}>
            <JSONPretty id="jsonPretty"
                        style={{
                            width: "100%",
                            overflow: "auto",
                            height: "500px",
                        }}
                        onJSONPrettyError={e => console.error(e)}
                        data={diagramMaker.state}/>
        </Grid>
    </Grid>
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
    console.log("%%%%%%%%%%%%%%%%%%%%%%", event)
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