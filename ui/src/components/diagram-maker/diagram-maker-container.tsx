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
    VisibleConnectorTypes,
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
    createEdgeContextMenu,
    createLibraryPanel,
    createNodeContextMenu,
    createNodeWithDropdown,
    createNodeWithInput,
    createPanelContextMenu,
    createPluginPanel,
    createPotentialNode,
    createRectangularConnectorNode,
    createRectangularNode,
    createToolsPanel,
    createWorkspaceContextMenu,
    updateActionInLogger
} from "../../utils/utils";

// import BoundaryRectangularData from './BoundaryRectangular/data';
import {Action, Dispatch} from "redux";
import JSONPretty from "react-json-pretty";
import {Grid} from "@mui/material";

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
    // updateDiagramMakerState: (diagramMakerState: string) => void
}

const createDivWithId = (id: string) => {
    const container = document.createElement('div');
    container.id = id;
    return container;
};

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
                                          // updateDiagramMakerState
                                      }: ArgTypes) => {
    const containerRef = useRef() as any;
    const diagramMakerRef = useRef() as any;
    const [diagramMakerState, setDiagramMakerState] = React.useState("{}");

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
                    container.setAttribute("style", "border: 1px solid black");
                    if (node.typeId === 'testId-centered') {
                        // return ReactDOM.render(<CircularNode
                        //     node={node}
                        // />, container);
                        return createCircularNode(node, container);
                    }
                    if (node.typeId === 'testId-input') {
                        return createNodeWithInput(node, container);
                    }
                    if (node.typeId === 'testId-dropdown') {
                        return createNodeWithDropdown(node, container);
                    }
                    if (connectorPlacement === ConnectorPlacement.BOUNDARY) {
                        if (shape === Shape.CIRCLE) {
                            return createCircularNode(node, container);
                        }
                        return createRectangularConnectorNode(node, container);
                    }
                    return createRectangularNode(node, container);
                },
                edge: edgeBadge ? (edge: DiagramMakerEdge<{}>, container: HTMLElement): HTMLElement | undefined => {
                    if (container.innerHTML === '') {
                        const element = document.createElement('div');
                        element.textContent = edge.id.substring(0, 10);
                        element.classList.add('edgeBadge');
                        container.appendChild(element);
                        return element;
                    }
                    return undefined;
                } : undefined,
                potentialNode: (node: DiagramMakerPotentialNode, container: HTMLElement) => createPotentialNode(node, container),
                panels: {
                    library: (panel: any, state: any, container: HTMLElement) => createLibraryPanel(container),
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
                        ) => createToolsPanel(container, () => diagramMakerRef.current),
                    }),
                },
                //This is the place to identify which element has been clicked
                contextMenu: {
                    node: (id: string | undefined, container: HTMLElement) => createNodeContextMenu(id, container),
                    edge: (id: string | undefined, container: HTMLElement) => createEdgeContextMenu(id, container),
                    panel: (id: string | undefined, container: HTMLElement) => createPanelContextMenu(id, container),
                    workspace: (container: HTMLElement) => createWorkspaceContextMenu(container),
                } as ContextMenuRenderCallbacks,
            },
            actionInterceptor: (action: Action, next: Dispatch<Action>, getState: () => DiagramMakerData<{}, {}>) => {
                // onAction(action);
                if (actionInterceptor) {
                    const diagramMakerAction = action as DiagramMakerAction<{ odd: boolean }, {}>;
                    if ("payload" in diagramMakerAction) {
                        console.log("++++++++++++++++++++++++++")
                        console.log("action : ", diagramMakerAction?.payload)
                        console.log("++++++++++++++++++++++++++")
                    }
                    updateActionInLogger(action);
                    if (diagramMakerAction.type === DiagramMakerActions.DELETE_ITEMS
                        && "payload" in diagramMakerAction
                        && "nodeIds" in diagramMakerAction.payload
                        && diagramMakerAction.payload.nodeIds.length > 0) {
                        // stops from deleting nodes
                        // return;
                        console.log("Deleting node : ", diagramMakerAction.payload.nodeIds)
                    }

                    if (diagramMakerAction.type === DiagramMakerActions.NODE_CREATE
                        && "payload" in diagramMakerAction) {
                        // nodes before are even so this odd
                        diagramMakerAction.payload["consumerData"] = {
                            "mahendra": "bagul",
                            odd: Object.keys(getState().nodes).length % 2 === 0,
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
            setDiagramMakerState(JSON.stringify(state))
            // sendDiagramMakerState(JSON.stringify(state))
            console.log("state : ", state);
        });
        // const names = document.getElementsByClassName('dm-workspace');
        // if (names.length == 1){
        //     console.log("names1 :", names)
        //     names[0].attributes["position"] = "relative"
        //     console.log("names2 :", names)
        // }

    }, [plugin, initialData]);

    return <div>
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <div ref={containerRef}></div>
            </Grid>
            <Grid item xs={12} md={6}>
                <JSONPretty id="jsonPretty"
                            style={{
                                display: "inline-block",
                                overflowY: "scroll",
                                height: "500px",
                                width: "350px"
                            }}
                            onJSONPrettyError={e => console.error(e)}
                            data={diagramMakerState}/>
            </Grid>
        </Grid>
    </div>
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

// function Node({selected, width, height}) {
//     return (<div
//         style={{
//             width, height, background: "white", padding: 8, border: selected ? "1px solid red" : undefined
//         }}
//     >
//         Component
//     </div>);
// }