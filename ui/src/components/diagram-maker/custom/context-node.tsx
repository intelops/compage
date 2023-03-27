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
        // restServerType to be generated
        restServerType: parsedModifiedState.nodes[props.id]?.consumerData.restServerType !== undefined ? parsedModifiedState.nodes[props.id].consumerData.restServerType : {},
        // grpcServerType to be generated
        grpcServerType: parsedModifiedState.nodes[props.id]?.consumerData.grpcServerType !== undefined ? parsedModifiedState.nodes[props.id].consumerData.grpcServerType : {},
        // wsServerType to be generated
        wsServerType: parsedModifiedState.nodes[props.id]?.consumerData.wsServerType !== undefined ? parsedModifiedState.nodes[props.id].consumerData.wsServerType : {},
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