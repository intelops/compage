import {DiagramMakerNode, Event, WorkspaceActions} from 'diagram-maker';
import {Action, AnyAction} from 'redux';
import {getModifiedState} from "../../../utils/localstorage-client";

export function createDivWithText(text: string) {
    const newDiv = document.createElement('div');
    newDiv.id = text;
    const newContent = document.createTextNode(text);
    newDiv.appendChild(newContent);
    return newDiv;
}

export function createRectangularNode(node: DiagramMakerNode<{ odd?: boolean }>, container: HTMLElement, eventListener: () => void) {
    const id = node.id.substring(0, 10);
    const newDiv = createDivWithText(id);
    newDiv.classList.add('rectangle', 'example-node', 'rectangle-image');
    newDiv.style.display = "flex";
    newDiv.style.flexWrap = "wrap";
    newDiv.style.justifyContent = "center";
    newDiv.style.alignItems = "center";
    newDiv.style.alignContent = "center";
    newDiv.style.flexDirection = "row";
    if (node.diagramMakerData.selected) {
        newDiv.classList.add('selected');
    }
    newDiv.addEventListener('dblclick', eventListener);
    container.innerHTML = '';
    container.appendChild(newDiv);
    return newDiv;
}

export function createRectangularConnectorNode(node: DiagramMakerNode<{ odd?: boolean }>, container: HTMLElement, eventListener: () => void) {
    const id = node.id.substring(0, 13);
    const newDiv = createDivWithText(id);
    newDiv.classList.add('rectangle', 'example-node', 'connector-node');
    if (node.diagramMakerData.selected) {
        newDiv.classList.add('selected');
    }
    container.innerHTML = '';
    const connectorDiv = document.createElement('div');
    connectorDiv.classList.add('outer', 'outer-rectangle');
    connectorDiv.setAttribute('data-id', node.id);
    connectorDiv.setAttribute('data-type', 'DiagramMaker.Connector');
    connectorDiv.setAttribute('data-draggable', 'true');
    connectorDiv.setAttribute('data-event-target', 'true');
    newDiv.setAttribute('data-id', node.id);
    newDiv.setAttribute('data-type', 'DiagramMaker.Connector');
    newDiv.setAttribute('data-dropzone', 'true');
    newDiv.addEventListener('dblclick', eventListener);
    container.appendChild(connectorDiv);
    container.appendChild(newDiv);
    return newDiv;
}

export function createNodeWithInput(node: DiagramMakerNode<any>, container: HTMLElement) {
    if (container.innerHTML !== '') {
        const childDiv = container.children[0];
        if (node.diagramMakerData.selected) {
            childDiv.classList.add('selected');
        } else {
            childDiv.classList.remove('selected');
        }
        return undefined;
    }
    const newDiv = document.createElement('div');
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('data-event-target', 'true');
    input.setAttribute('data-draggable', 'true');
    newDiv.appendChild(input);
    newDiv.classList.add('rectangle', 'example-node');
    if (node.diagramMakerData.selected) {
        newDiv.classList.add('selected');
    }
    container.appendChild(newDiv);
    return newDiv;
}

export function createNodeWithDropdown(node: DiagramMakerNode<any>, container: HTMLElement) {
    if (container.innerHTML !== '') {
        const childDiv = container.children[0];
        if (node.diagramMakerData.selected) {
            childDiv.classList.add('selected');
        } else {
            childDiv.classList.remove('selected');
        }
        return undefined;
    }
    const newDiv = document.createElement('div');
    const select = document.createElement('select');
    const option = document.createElement('option');
    const optionValue = document.createTextNode('test');
    option.appendChild(optionValue);
    select.appendChild(option);
    select.setAttribute('type', 'text');
    select.setAttribute('data-event-target', 'true');
    newDiv.appendChild(select);
    newDiv.classList.add('rectangle', 'example-node');
    if (node.diagramMakerData.selected) {
        newDiv.classList.add('selected');
    }
    container.appendChild(newDiv);
    return newDiv;
}

export function createCircularNode(node: DiagramMakerNode<any>, container: HTMLElement, eventListener: () => void) {
    const id = node.id.substring(0, 10);
    let modifiedState = getModifiedState();
    // add name given by user to this node.
    const name = JSON.parse(modifiedState)?.nodes[id]?.consumerData?.name;
    let displayName;
    if (name) {
        displayName = name;
    } else {
        displayName = id;
    }
    const newDiv = createDivWithText(displayName);
    newDiv.style.display = "flex";
    newDiv.style.flexWrap = "wrap";
    newDiv.style.justifyContent = "center";
    newDiv.style.alignItems = "center";
    newDiv.style.alignContent = "center";
    newDiv.style.flexDirection = "row";
    newDiv.classList.add('circle', 'example-node', 'circle-image');
    if (node.diagramMakerData.selected) {
        newDiv.classList.add('selected');
    }
    container.innerHTML = '';
    const connectorDiv = document.createElement('div');
    connectorDiv.classList.add('outer');
    connectorDiv.setAttribute('data-id', node.id);
    connectorDiv.setAttribute('data-type', 'DiagramMaker.Connector');
    connectorDiv.setAttribute('data-draggable', 'true');
    connectorDiv.setAttribute('data-event-target', 'true');
    newDiv.setAttribute('data-id', node.id);
    newDiv.setAttribute('data-type', 'DiagramMaker.Connector');
    newDiv.setAttribute('data-dropzone', 'true');
    newDiv.addEventListener('dblclick', eventListener);
    container.appendChild(connectorDiv);
    container.appendChild(newDiv);
    return newDiv;
}

export function createPluginPanel(container: HTMLElement, state: any) {
    if (container.innerHTML !== '') {
        return undefined;
    }

    const newDiv = document.createElement('div');
    newDiv.setAttribute('data-event-target', 'true');
    newDiv.setAttribute('data-dropzone', 'true');
    newDiv.classList.add('library');

    // Create element that is draggable at the top of the panel
    const draggableElement = document.createElement('div');
    draggableElement.innerText = 'drag here';
    draggableElement.classList.add('draggableElement');
    draggableElement.setAttribute('data-event-target', 'true');
    draggableElement.setAttribute('data-draggable', 'true');
    draggableElement.setAttribute('data-type', 'DiagramMaker.PanelDragHandle');
    draggableElement.setAttribute('data-id', 'plugin');
    newDiv.appendChild(draggableElement);

    // Create a plugin that can drag workspace to a target position
    const testPlugin = createDivWithText('Click this plugin to move workspace to a target position');
    testPlugin.setAttribute('data-event-target', 'true');
    testPlugin.setAttribute('data-type', 'testPlugin');
    testPlugin.setAttribute('data-id', 'testPlugin');
    const {width} = state.plugins.testPlugin.data.size;
    const {height} = state.plugins.testPlugin.data.size;
    testPlugin.style.width = `${width}px`;
    testPlugin.style.height = `${height}px`;
    testPlugin.style.backgroundColor = 'orange';
    testPlugin.style.paddingTop = '15px';
    testPlugin.style.textAlign = 'center';
    newDiv.appendChild(testPlugin);

    container.appendChild(newDiv);
    return newDiv;
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

export function updateActionInLogger(action: Action) {
    const anyAction = action as AnyAction;
    const logger = document.getElementById('diagramMakerLogger');
    if (logger) {
        const type = createDivWithText(`Type is ${action.type}`);
        type.setAttribute('data-type', 'DiagramMaker.ActionType');
        type.setAttribute('data-id', action.type);
        logger.innerHTML = '';
        logger.appendChild(type);
        if (anyAction.payload) {
            const payload = createDivWithText(`Payload is ${JSON.stringify(anyAction.payload)}`);
            payload.setAttribute('data-type', 'DiagramMaker.ActionPayload');
            payload.setAttribute('data-id', action.type);
            logger.appendChild(payload);
        }
    }
}

export function addDevTools() {
    if (process.env.NODE_ENV === 'development') {
        const windowAsAny = window as any;
        // eslint-disable-next-line no-underscore-dangle
        return windowAsAny.__REDUX_DEVTOOLS_EXTENSION__ && windowAsAny.__REDUX_DEVTOOLS_EXTENSION__();
    }
    return undefined;
}

export const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};
