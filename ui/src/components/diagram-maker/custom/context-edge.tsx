import React from 'react';
import Divider from "@mui/material/Divider";
import {getParsedModifiedState} from "../helper/helper";
import {CompageEdge, EmptyGrpcServerConfig, EmptyRestServerConfig, EmptyWsServerConfig} from "../models";

interface ContextEdgeProps {
    id: string | undefined;
}

export const ContextEdge = (props: ContextEdgeProps) => {
    const parsedModifiedState = getParsedModifiedState();
    const edge: CompageEdge = parsedModifiedState.edges[props.id];
    const [payload] = React.useState({
        name: edge?.consumerData.name !== undefined ? edge.consumerData.name : "",
        port: edge?.consumerData.name !== undefined ? edge.consumerData.name : "",
        // restClientConfig
        restClientConfig: edge?.consumerData.restClientConfig !== undefined ? edge.consumerData.restClientConfig : EmptyRestServerConfig,
        // grpcClientConfig
        grpcClientConfig: edge?.consumerData.grpcClientConfig !== undefined ? edge.consumerData.grpcClientConfig : EmptyGrpcServerConfig,
        // wsServerType
        wsClientConfig: edge?.consumerData.wsClientConfig !== undefined ? edge.consumerData.wsClientConfig : EmptyWsServerConfig,
        externalNode: edge?.consumerData.externalNode !== undefined ? edge.consumerData.externalNode : "",
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

    const getRestClientPort = () => {
        if (payload.restClientConfig.port) {
            return <><strong>Port(REST)</strong> : {payload.restClientConfig.port}</>;
        }
        return "";
    };

    const getGrpcClientPort = () => {
        if (payload.grpcClientConfig.port) {
            return <><strong>Port(gRPC)</strong> : {payload.grpcClientConfig.port}</>;
        }
        return "";
    };

    const getWsClientPort = () => {
        if (payload.wsClientConfig.port) {
            return <><strong>Port(WS)</strong> : {payload.wsClientConfig.port}</>;
        }
        return "";
    };

    const getExternalNode = () => {
        if (payload.externalNode) {
            return <><strong>External Node</strong> : {payload.externalNode}</>;
        }
        return "";
    };

    return <React.Fragment>
        <div className="contextMenu">
            <strong>Edge </strong>: {props.id}
            <Divider/>
            {getName()}
            <br/>
            {getExternalNode()}
            <br/>
            {getRestClientPort()}
            <br/>
            {getGrpcClientPort()}
            <br/>
            {getWsClientPort()}
        </div>
    </React.Fragment>;
};