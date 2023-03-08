import React from 'react';
import {DiagramMakerNode} from "diagram-maker";

interface CircularNodeProps {
    node: DiagramMakerNode<any>;
}

export const CircularNode = (props: CircularNodeProps) => {
    const id = props.node.id.substring(0, 13);
    return <React.Fragment>
        <div data-type="DiagramMaker.Connector"
             data-draggable="true"
             data-event-target="true"
             data-id={props.node.id}
             className="outer">
            <div data-type="DiagramMaker.Connector"
                 data-id={props.node.id}
                 data-dropzone="true"
                 className={"circle example-node " + (props.node.diagramMakerData.selected ? "selected " : "")}>
                {id}
            </div>
        </div>
    </React.Fragment>;
};