import React, {useRef} from 'react';
import {DiagramMakerNode} from "diagram-maker";

interface CircularNodeProps {
    type?: string,
    text?: string,
    width?: string,
    height?: string
    node: DiagramMakerNode<any>
}

export const CircularNode = (props: CircularNodeProps) => {
    const connectorDiv = useRef(null);
    const newDiv = useRef(null);
    let newDivClass = 'circle example-node';
    if (props.node.diagramMakerData.selected) {
        newDivClass += ' selected';
    }
    const id = props.node.id.substring(0, 13);
    newDiv.current.setAttribute('data-id', props.node.id);
    newDiv.current.setAttribute('data-type', 'DiagramMaker.Connector');
    newDiv.current.setAttribute('data-dropzone', 'true');

    connectorDiv.current.setAttribute('data-id', props.node.id);
    connectorDiv.current.setAttribute('data-type', 'DiagramMaker.Connector');
    connectorDiv.current.setAttribute('data-event-target', 'true');

    return <React.Fragment>
        {/*<Draggable>*/}
        <div ref={connectorDiv}
             style={{border: "1px solid red", width: props.width, height: props.height}}></div>
        {/*</Draggable>*/}
        <div ref={newDiv} className={newDivClass}>{id}</div>
    </React.Fragment>;
}