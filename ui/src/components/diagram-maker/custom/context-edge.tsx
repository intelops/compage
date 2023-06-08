import React from 'react';
import Divider from "@mui/material/Divider";
import {getParsedModifiedState} from "../helper/helper";
import {
    CompageEdge,
    CompageNode,
    EmptyGrpcConfig,
    EmptyRestConfig,
    EmptyWsConfig,
    GrpcClient,
    RestClient, WsClient
} from "../models";

interface ContextEdgeProps {
    id: string | undefined;
}

export const ContextEdge = (props: ContextEdgeProps) => {
    const parsedModifiedState = getParsedModifiedState();
    const edge: CompageEdge = parsedModifiedState.edges[props.id];
    const destNode: CompageNode = parsedModifiedState.nodes[edge.dest];
    const srcNode: CompageNode = parsedModifiedState.nodes[edge.src];

    const getRestPort = () => {
        const restClients: RestClient[] = destNode?.consumerData?.restConfig.clients;
        if (restClients && restClients.length > 0) {
            for (const restClient of restClients) {
                if (srcNode.consumerData.name === restClient.externalNode) {
                    return srcNode.consumerData.restConfig.server.port;
                }
            }
        }
        return EmptyRestConfig;
    };
    const getGrpcPort = () => {
        const grpcClients: GrpcClient[] = destNode?.consumerData?.grpcConfig.clients;
        if (grpcClients && grpcClients.length > 0) {
            for (const grpcClient of grpcClients) {
                if (srcNode.consumerData.name === grpcClient.externalNode) {
                    return srcNode.consumerData.grpcConfig.server.port;
                }
            }
        }
        return EmptyGrpcConfig;
    };
    const getWsPort = () => {
        const wsClients: WsClient[] = destNode?.consumerData?.wsConfig.clients;
        if (wsClients && wsClients.length > 0) {
            for (const wsClient of wsClients) {
                if (srcNode.consumerData.name === wsClient.externalNode) {
                    return srcNode.consumerData.wsConfig.server.port;
                }
            }
        }
        return EmptyWsConfig;
    };
    const getExternalNodeName = () => {
        return srcNode.consumerData.name;
    };

    const [payload] = React.useState({
        name: edge?.consumerData.name !== undefined ? edge.consumerData.name : "",
        port: edge?.consumerData.name !== undefined ? edge.consumerData.name : "",
        // restPort
        restPort: getRestPort(),
        // grpcPort
        grpcPort: getGrpcPort(),
        // wsPort
        wsPort: getWsPort(),
        // externalName
        externalNode: getExternalNodeName(),
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
        if (payload.restPort) {
            return <><strong>Port(REST)</strong> : {payload.restPort}</>;
        }
        return "";
    };

    const getGrpcClientPort = () => {
        if (payload.grpcPort) {
            return <><strong>Port(gRPC)</strong> : {payload.grpcPort}</>;
        }
        return "";
    };

    const getWsClientPort = () => {
        if (payload.wsPort) {
            return <><strong>Port(WS)</strong> : {payload.wsPort}</>;
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
            {getRestClientPort()}
            <br/>
            {getGrpcClientPort()}
            <br/>
            {getWsClientPort()}
        </div>
    </React.Fragment>;
};