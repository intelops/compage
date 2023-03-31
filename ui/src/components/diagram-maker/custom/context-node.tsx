import React from 'react';
import {getParsedModifiedState} from "../helper/helper";
import Divider from "@mui/material/Divider";
import {CompageNode, EmptyGrpcServerConfig, EmptyRestServerConfig, EmptyWsServerConfig} from "../models";

interface ContextNodeProps {
    id: string | undefined;
}

export const ContextNode = (props: ContextNodeProps) => {
    const parsedModifiedState = getParsedModifiedState();
    const node: CompageNode = parsedModifiedState.nodes[props.id];
    const [payload] = React.useState({
        name: node?.consumerData.name !== undefined ? node.consumerData.name : "",
        language: node?.consumerData.language !== undefined ? node.consumerData.language : "",
        // restServerConfig to be generated
        restServerConfig: node?.consumerData.restServerConfig !== undefined ? node.consumerData.restServerConfig : EmptyRestServerConfig,
        // grpcServerConfig to be generated
        grpcServerConfig: node?.consumerData.grpcServerConfig !== undefined ? node.consumerData.grpcServerConfig : EmptyGrpcServerConfig,
        // wsServerType to be generated
        wsServerConfig: node?.consumerData.wsServerConfig !== undefined ? node.consumerData.wsServerConfig : EmptyWsServerConfig,
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


    const getLanguage = () => {
        if (payload.language) {
            return <><strong>Language</strong> : {payload.language}</>;
        }
        return "";
    };

    const getTemplate = () => {
        if (payload.restServerConfig.template) {
            return <><strong>Template</strong>: {payload.restServerConfig.template}</>;
        }
        return "";
    };

    const getFramework = () => {
        if (payload.restServerConfig.framework) {
            return <><strong>Framework</strong>: {payload.restServerConfig.framework}</>;
        }
        return "";
    };

    const getPort = () => {
        if (payload.restServerConfig.port) {
            return <><strong>Port</strong>: {payload.restServerConfig.port}</>;
        }
        return "";
    };

    return <React.Fragment>
        <div className="contextMenu">
            <strong> Node </strong>: {props.id}
            <Divider/>
            {getName()}
            <br/>
            {getLanguage()}
            <br/>
            {getTemplate()}
            <br/>
            {getFramework()}
            <br/>
            {getPort()}
        </div>
    </React.Fragment>;
};