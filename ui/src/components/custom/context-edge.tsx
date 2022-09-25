import React from 'react';
import Divider from "@mui/material/Divider";
import {getParsedModifiedState} from "../diagram-maker/helper/helper";

interface ContextEdgeProps {
    id: string | undefined,
}

export const ContextEdge = (props: ContextEdgeProps) => {
    let parsedModifiedState = getParsedModifiedState();

    const [payload] = React.useState({
        type: parsedModifiedState.nodes[props.id]?.consumerData["type"] !== undefined ? parsedModifiedState.nodes[props.id].consumerData["type"] : "",
    });

    if (!props.id) {
        return <React.Fragment/>;
    }
    return <React.Fragment>
        <div className="contextMenu">
            <strong>Edge </strong>: {props.id}
            <Divider/>
            <strong>Type</strong> : {payload.type}
        </div>
    </React.Fragment>;
}