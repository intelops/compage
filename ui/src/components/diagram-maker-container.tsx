import ReactDOM from "react-dom";
import {
    ConnectorPlacement,
    ConnectorPlacementType,
    ContextMenuRenderCallbacks,
    DiagramMaker,
    DiagramMakerEdge,
    DiagramMakerNode,
    DiagramMakerPotentialNode,
    Event,
    Shape,
    VisibleConnectorTypes,
    WorkspaceActions
} from "diagram-maker";
import "diagram-maker/dist/diagramMaker.css";
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
    createWorkspaceContextMenu
} from "./utils";

import BoundaryCircularData from './BoundaryCircular/data';

export const DiagramMakerContainer = () => {
    const containerRef = useRef() as any;
    const diagramMakerRef = useRef() as any;

    React.useEffect(() => {
        // let shape, connectorPlacement, showArrowhead, plugin, edgeBadge
        let plugin, connectorPlacement
        let initialData = BoundaryCircularData
        // let connectorPlacement = ConnectorPlacementType.BOUNDARY
        let showArrowhead = true
        let shape = Shape.CIRCLE
        let edgeBadge = true
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
                    if (node.typeId === 'testId-centered') {
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
                contextMenu: {
                    node: (id: string | undefined, container: HTMLElement) => createNodeContextMenu(id, container),
                    edge: (id: string | undefined, container: HTMLElement) => createEdgeContextMenu(id, container),
                    panel: (id: string | undefined, container: HTMLElement) => createPanelContextMenu(id, container),
                    workspace: (container: HTMLElement) => createWorkspaceContextMenu(container),
                } as ContextMenuRenderCallbacks,
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

// function Node({selected, width, height}) {
//     return (<div
//         style={{
//             width, height, background: "white", padding: 8, border: selected ? "1px solid red" : undefined
//         }}
//     >
//         Component
//     </div>);
// }