import React from 'react';
import {getParsedModifiedState} from "../helper/helper";
import Divider from "@mui/material/Divider";
import {CompageNode, EmptyGrpcConfig, EmptyRestConfig, EmptyWsConfig} from "../models";

interface ContextNodeProps {
    id: string | undefined;
}

export const ContextNode = (props: ContextNodeProps) => {
    const parsedModifiedState = getParsedModifiedState();
    const node: CompageNode = parsedModifiedState.nodes[props.id];
    const [payload] = React.useState({
        name: node?.consumerData.name !== undefined ? node.consumerData.name : "",
        language: node?.consumerData.language !== undefined ? node.consumerData.language : "",
        // restConfig to be generated
        restConfig: node?.consumerData.restConfig !== undefined ? node.consumerData.restConfig : EmptyRestConfig,
        // grpcConfig to be generated
        grpcConfig: node?.consumerData.grpcConfig !== undefined ? node.consumerData.grpcConfig : EmptyGrpcConfig,
        // wsServerType to be generated
        wsConfig: node?.consumerData.wsConfig !== undefined ? node.consumerData.wsConfig : EmptyWsConfig,
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
        if (payload.restConfig.template) {
            return <><strong>Template</strong>: {payload.restConfig.template}</>;
        }
        return "";
    };

    const getFramework = () => {
        if (payload.restConfig.server.framework) {
            return <><strong>Framework</strong>: {payload.restConfig.server.framework}</>;
        }
        return "";
    };

    const getPort = () => {
        if (payload.restConfig.server.port) {
            return <><strong>Port</strong>: {payload.restConfig.server.port}</>;
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