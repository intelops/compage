import React from 'react';
import {getParsedModifiedState} from "../diagram-maker/helper/helper";
import Divider from "@mui/material/Divider";

interface ContextNodeProps {
    id: string | undefined,
}

export const ContextNode = (props: ContextNodeProps) => {
    let parsedModifiedState = getParsedModifiedState();

    const [payload] = React.useState({
        name: parsedModifiedState.nodes[props.id]?.consumerData["name"] !== undefined ? parsedModifiedState.nodes[props.id].consumerData["name"] : "",
        type: parsedModifiedState.nodes[props.id]?.consumerData["type"] !== undefined ? parsedModifiedState.nodes[props.id].consumerData["type"] : "",
        language: parsedModifiedState.nodes[props.id]?.consumerData["language"] !== undefined ? parsedModifiedState.nodes[props.id].consumerData["language"] : "",
        isServer: parsedModifiedState.nodes[props.id]?.consumerData["isServer"] !== undefined ? parsedModifiedState.nodes[props.id].consumerData["isServer"] : false,
        isClient: parsedModifiedState.nodes[props.id]?.consumerData["isClient"] !== undefined ? parsedModifiedState.nodes[props.id].consumerData["isClient"] : false,
        // api resources to be generated
        resources: [],
        url: parsedModifiedState?.nodes[props.id]?.consumerData["url"] !== undefined ? parsedModifiedState.nodes[props.id].consumerData["url"] : "",
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
            return <><strong>Type</strong>: {payload.type}</>;
        }
        return ""
    }

    const getLanguage = () => {
        if (payload.language) {
            return <><strong>Language</strong> : {payload.language}</>;
        }
        return ""
    }

    const getIsServer = () => {
        return <><strong>IsServer</strong>: {payload.isServer ? "Yes" : "No"}</>;
    }

    const getIsClient = () => {
        return <><strong>IsClient</strong>: {payload.isClient ? "Yes" : "No"}</>;
    }

    return <React.Fragment>
        <div className="contextMenu">
            <strong> Node </strong>: {props.id}
            <Divider/>
            {getName()}
            <br/>
            {getType()}
            <br/>
            {getLanguage()}
            <br/>
            {getIsServer()}
            <br/>
            {getIsClient()}
        </div>
    </React.Fragment>;
}