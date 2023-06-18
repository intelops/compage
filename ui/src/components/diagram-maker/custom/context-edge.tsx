import React from 'react';
import Divider from "@mui/material/Divider";
import {getParsedModifiedState} from "../helper/helper";
import {
    CompageEdge, CompageJson,
    CompageNode,
    getEmptyGrpcConfig,
    getEmptyRestConfig,
    getEmptyWsConfig,
    GrpcClient,
    RestClient,
    WsClient
} from "../models";
import {getCurrentConfig} from "../../../utils/localstorage-client";

interface ContextEdgeProps {
    id: string | undefined;
}

export const ContextEdge = (props: ContextEdgeProps) => {
    const parsedModifiedState : CompageJson = getParsedModifiedState();
    const parsedCurrentConfig = JSON.parse(getCurrentConfig());
    const modifiedEdgeState: CompageEdge = parsedModifiedState.edges[props.id];
    const edgeConfig: CompageEdge = parsedCurrentConfig.edges[props.id];
    const destNode: CompageNode = parsedModifiedState.nodes[edgeConfig?.dest];
    const srcNode: CompageNode = parsedModifiedState.nodes[edgeConfig?.src];

    const getRestPort = () => {
        const restClients: RestClient[] = destNode?.consumerData?.restConfig?.clients;
        if (restClients && restClients.length > 0) {
            for (const restClient of restClients) {
                if (srcNode?.consumerData?.name === restClient.sourceNodeName) {
                    return srcNode?.consumerData?.restConfig?.server?.port;
                }
            }
        }
        return getEmptyRestConfig().server.port;
    };
    const getGrpcPort = () => {
        const grpcClients: GrpcClient[] = destNode?.consumerData?.grpcConfig?.clients;
        if (grpcClients && grpcClients.length > 0) {
            for (const grpcClient of grpcClients) {
                if (srcNode?.consumerData?.name === grpcClient.sourceNodeName) {
                    return srcNode?.consumerData?.grpcConfig?.server?.port;
                }
            }
        }
        return getEmptyGrpcConfig().server.port;
    };
    const getWsPort = () => {
        const wsClients: WsClient[] = destNode?.consumerData?.wsConfig?.clients;
        if (wsClients && wsClients.length > 0) {
            for (const wsClient of wsClients) {
                if (srcNode?.consumerData?.name === wsClient.sourceNodeName) {
                    return srcNode?.consumerData?.wsConfig?.server?.port;
                }
            }
        }
        return getEmptyWsConfig().server.port;
    };
    const getSourceNode= () => {
        return srcNode?.consumerData?.name;
    };

    const [payload] = React.useState({
        name: modifiedEdgeState?.consumerData?.name !== undefined ? modifiedEdgeState?.consumerData?.name : "",
        port: modifiedEdgeState?.consumerData?.name !== undefined ? modifiedEdgeState?.consumerData?.name : "",
        // restPort
        restPort: getRestPort(),
        // grpcPort
        grpcPort: getGrpcPort(),
        // wsPort
        wsPort: getWsPort(),
        // sourceNodeName
        sourceNodeName: getSourceNode(),
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

    const getRestServerPort = () => {
        if (payload.restPort) {
            return <><strong>Port(REST)</strong> : {payload.restPort}</>;
        }
        return "";
    };

    const getGrpcServerPort = () => {
        if (payload.grpcPort) {
            return <><strong>Port(gRPC)</strong> : {payload.grpcPort}</>;
        }
        return "";
    };

    const getWsServerPort = () => {
        if (payload.wsPort) {
            return <><strong>Port(WS)</strong> : {payload.wsPort}</>;
        }
        return "";
    };

    const getSourceNodeName = () => {
        if (payload.sourceNodeName) {
            return <><strong>Source Node</strong> : {payload.sourceNodeName}</>;
        }
        return "";
    };

    return <React.Fragment>
        <div className="contextMenu">
            <strong>Edge </strong>: {props.id}
            <Divider/>
            {getName()}
            <br/>
            {getSourceNodeName()}
            <br/>
            {getRestServerPort()}
            <br/>
            {getGrpcServerPort()}
            <br/>
            {getWsServerPort()}
        </div>
    </React.Fragment>;
};