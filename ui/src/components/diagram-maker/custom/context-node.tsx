import React from 'react';
import {getParsedModifiedState} from "../helper/helper";
import Divider from "@mui/material/Divider";

interface ContextNodeProps {
    id: string | undefined;
}

export const ContextNode = (props: ContextNodeProps) => {
    const parsedModifiedState = getParsedModifiedState();

    const [payload] = React.useState({
        name: parsedModifiedState.nodes[props.id]?.consumerData.name !== undefined ? parsedModifiedState.nodes[props.id].consumerData.name : "",
        type: parsedModifiedState.nodes[props.id]?.consumerData.type !== undefined ? parsedModifiedState.nodes[props.id].consumerData.type : "",
        language: parsedModifiedState.nodes[props.id]?.consumerData.language !== undefined ? parsedModifiedState.nodes[props.id].consumerData.language : "",
        isServer: parsedModifiedState.nodes[props.id]?.consumerData.isServer !== undefined ? parsedModifiedState.nodes[props.id].consumerData.isServer : false,
        template: parsedModifiedState.nodes[props.id]?.consumerData.template !== undefined ? parsedModifiedState.nodes[props.id].consumerData.template : false,
        // restServerConfig to be generated
        restServerConfig: parsedModifiedState.nodes[props.id]?.consumerData.restServerConfig !== undefined ? parsedModifiedState.nodes[props.id].consumerData.restServerConfig : {},
        // grpcServerConfig to be generated
        grpcServerConfig: parsedModifiedState.nodes[props.id]?.consumerData.grpcServerConfig !== undefined ? parsedModifiedState.nodes[props.id].consumerData.grpcServerConfig : {},
        // wsServerType to be generated
        wsServerConfig: parsedModifiedState.nodes[props.id]?.consumerData.wsServerConfig !== undefined ? parsedModifiedState.nodes[props.id].consumerData.wsServerConfig : {},
        url: parsedModifiedState?.nodes[props.id]?.consumerData.url !== undefined ? parsedModifiedState.nodes[props.id].consumerData.url : "",
    });

    if (!props.id) {
        return <React.Fragment/>;
    }

    const getName = () => {
        if (payload.name) {
            return <><strong>Name</strong> : {payload.name}</>;
        }
        return "";
    };

    const getType = () => {
        if (payload.type) {
            return <><strong>Type</strong>: {payload.type}</>;
        }
        return "";
    };

    const getLanguage = () => {
        if (payload.language) {
            return <><strong>Language</strong> : {payload.language}</>;
        }
        return "";
    };

    const getTemplate = () => {
        return <><strong>Template</strong>: {payload.template}</>;
    };

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
            {getTemplate()}
            <br/>
        </div>
    </React.Fragment>;
};