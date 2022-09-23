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

import React, {ChangeEvent, useRef} from "react";
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
import {
    getCurrentConfig,
    getCurrentState,
    getModifiedState,
    setCurrentConfig,
    setCurrentState,
    setModifiedState,
    setReset,
    shouldReset
} from "../../utils/service";
import {ToolPanel} from "../custom/tool-panel";
import {LibraryPanel} from "../custom/library-panel";
import {ContextNode} from "../custom/context-node";
import {ContextEdge} from "../custom/context-edge";
import {ContextPanel} from "../custom/context-panel";
import {ContextWorkspace} from "../custom/context-workspace";
import {EdgeBadge} from "../custom/edge-badge";
import {PotentialNode} from "../custom/potential-node";
import {getNodeTypeConfig} from "../../utils/nodeTypeConfig";
import {NewPropertiesComponent} from "./NewProperties";

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

const cleanse = (state: string) => {
    const stateJson = JSON.parse(state)
    // TODO this is a hack as there is no NODE_UPDATE action in diagram-maker. We may later update this impl when we fork diagram-maker repo.
    // update state from localstorage with additional properties added from UI (Post node creation)
    let modifiedState = getModifiedState();
    if (modifiedState && modifiedState !== "{}") {
        let parsedModifiedState = JSON.parse(modifiedState);
        //sometimes it may happen that the user removes node/edge from the diagram but modifiedState had no knowledge of it. In that case, we can check for the keys presence in the state and if not found, get the node/edge removed from state.
        const toBeRemovedNodes = []
        for (const [key, value] of Object.entries(parsedModifiedState.nodes)) {
            //TODO just update keys
            if (key in stateJson.nodes) {
                stateJson.nodes[key].consumerData = parsedModifiedState.nodes[key].consumerData
            } else {
                toBeRemovedNodes.push(key)
            }
        }
        const toBeRemovedEdges = []

        for (const key of Object.keys(parsedModifiedState.edges)) {
            //TODO just update keys
            if (key in stateJson.edges) {
                stateJson.edges[key].consumerData = parsedModifiedState.edges[key].consumerData
            } else {
                toBeRemovedEdges.push(key)
            }
        }
        // remove the nodes which aren't in the state anymore.
        for (const element of toBeRemovedNodes) {
            delete parsedModifiedState.nodes[element]
        }
        // remove the edges which aren't in the state anymore.
        for (const element of toBeRemovedEdges) {
            delete parsedModifiedState.edges[element]
        }
        // update back to localstorage.
        setModifiedState(JSON.stringify(parsedModifiedState))
    }
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
    return stateJson;
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

    const [payload, setPayload] = React.useState({
        componentType: ""
    });
    const [dialogState, setDialogState] = React.useState({
        isOpen: false,
        id: "",
        type: "",
    });

    const handleComponentTypeChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            componentType: event.target.value
        });
    };

    const handleClose = () => {
        setDialogState({isOpen: false, id: "", type: ""})
    };

    //TODO need to update the custom data to some other localstorage key and update the state continuously. Below impl doesn't work
    // update state with additional properties added from UI (Post node creation)
    // TODO this is a hack as there is no NODE_UPDATE action in diagram-maker. We may later update this impl when we fork diagram-maker repo.
    const handleSet = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        // retrieve current modifiedState
        // logic is to store the dialog-state in localstorage and then refer it in updating state.
        let modifiedState = getModifiedState();
        let parsedModifiedState
        debugger
        if (modifiedState && modifiedState !== "{}") {
            parsedModifiedState = JSON.parse(modifiedState);
        } else {
            parsedModifiedState = {
                nodes: {},
                edges: {}
            }
        }
        // update modifiedState with current fields on dialog box
        if (dialogState.type === "node") {
            if (!(dialogState.id in parsedModifiedState.nodes)) {
                parsedModifiedState.nodes[dialogState.id] = {
                    consumerData: {
                        componentType: payload.componentType
                    }
                }
            } else {
                parsedModifiedState.nodes[dialogState.id].consumerData = {
                    componentType: payload.componentType
                }
            }
        } else if (dialogState.type === "edge") {
            if (!(dialogState.id in parsedModifiedState.edges)) {
                parsedModifiedState.edges[dialogState.id] = {
                    consumerData: {
                        componentType: payload.componentType + "edges"
                    }
                }
            } else {
                parsedModifiedState.edges[dialogState.id].consumerData = {
                    componentType: payload.componentType
                }
            }
        }
        // update modifiedState in the localstorage
        setModifiedState(JSON.stringify(parsedModifiedState))
        //send update to the components
        setData(diagramMaker.state, false)
        setPayload({componentType: ""})
        setDialogState({isOpen: false, id: "", type: ""})
    }

    const getDialog = () => {
        if (dialogState.isOpen) {
            return <NewPropertiesComponent dialogState={dialogState} onClose={handleClose} payload={payload}
                                           onChange={handleComponentTypeChange} onClick={handleSet}/>
        }
        return "";
    }

    if (darkTheme) {
        document.body.classList.add('dm-dark-theme');
    } else {
        document.body.classList.remove('dm-dark-theme');
    }

    useBeforeunload((event) => {
        if (shouldReset()) {
            if ((diagramMaker.state !== "{}" && diagramMaker.state !== getCurrentState()) || (diagramMaker.config !== "{}" && diagramMaker.config !== getCurrentConfig())) {
                setCurrentState(diagramMaker.state)
                setCurrentConfig(diagramMaker.config)
                event.preventDefault();
            }
        } else {
            setReset(false)
        }
    });

    const setData = (state: string, updateConfig = true) => {
        const backupState: string = state.slice();
        if (state) {
            const stateJson = cleanse(state);
            if (updateConfig) {
                setDiagramMaker({
                    config: backupState,
                    state: JSON.stringify(stateJson)
                })
            } else {
                setDiagramMaker({
                    ...diagramMaker,
                    state: JSON.stringify(stateJson)
                })
            }
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
        // let onAction: {
        //     action: 'action',
        // }

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
                            setDialogState({isOpen: true, id: node.id, type: "node"})
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
                                    setDialogState({isOpen: true, id: node.id, type: "node"})
                                }
                            );
                        }
                        return createRectangularConnectorNode(node, container, () => {
                            setDialogState({isOpen: true, id: node.id, type: "node"})
                        });
                    }
                    return createRectangularNode(node, container, () => {
                        setDialogState({isOpen: true, id: node.id, type: "node"})
                    });
                },
                edge: edgeBadge ? (edge: DiagramMakerEdge<{}>, container: HTMLElement) => {
                    return ReactDOM.render(<EdgeBadge id={edge.id} handleDblClick={() => {
                        setDialogState({isOpen: true, id: edge.id, type: "edge"})
                    }}/>, container);
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
                        diagramMakerAction.payload["id"] = diagramMakerAction.payload["id"].substring(3, 10)
                        next(diagramMakerAction);
                        return;
                    }

                    if (diagramMakerAction.type === DiagramMakerActions.EDGE_CREATE
                        && "payload" in diagramMakerAction) {
                        diagramMakerAction.payload["id"] = diagramMakerAction.payload["id"].substring(3, 10)
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
            {getDialog()}
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