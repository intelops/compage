import React from 'react';
import Divider from "@mui/material/Divider";
import {getParsedModifiedState} from "../helper/helper";

interface ContextEdgeProps {
    id: string | undefined,
}

export const ContextEdge = (props: ContextEdgeProps) => {
    const parsedModifiedState = getParsedModifiedState();

    const [payload] = React.useState({
        type: parsedModifiedState.edges[props.id]?.consumerData.type !== undefined ? parsedModifiedState.edges[props.id].consumerData.type : "",
        name: parsedModifiedState.edges[props.id]?.consumerData.name !== undefined ? parsedModifiedState.edges[props.id].consumerData.name : "",
        protocol: parsedModifiedState.edges[props.id]?.consumerData.protocol !== undefined ? parsedModifiedState.edges[props.id].consumerData.protocol : "",
    });

    if (!props.id) {
        return <React.Fragment/>;
    }

    const getName = () => {
        if (payload.name) {
            return <><strong>Name</strong> : {payload.name}</>;
        }
        return ""
    }

    const getType = () => {
        if (payload.type) {
            return <><strong>Type</strong> : {payload.type}</>;
        }
        return ""
    }

    const getProtocol = () => {
        if (payload.protocol) {
            return <><strong>Protocol</strong> : {payload.protocol}</>;
        }
        return ""
    }

    return <React.Fragment>
        <div className="contextMenu">
            <strong>Edge </strong>: {props.id}
            <Divider/>
            {getName()}
            <br/>
            {getType()}
            <br/>
            {getProtocol()}
        </div>
    </React.Fragment>;
}