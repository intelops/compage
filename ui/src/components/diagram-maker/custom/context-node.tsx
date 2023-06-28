import React from 'react';
import {getParsedModifiedState} from "../helper/helper";
import Divider from "@mui/material/Divider";
import {CompageJson, CompageNode, getEmptyGrpcConfig, getEmptyRestConfig, getEmptyWsConfig} from "../models";

interface ContextNodeProps {
    id: string | undefined;
}

export const ContextNode = (props: ContextNodeProps) => {
    const parsedModifiedState: CompageJson = getParsedModifiedState();
    const currentNode: CompageNode = parsedModifiedState.nodes[props.id];
    const [payload] = React.useState({
        name: currentNode?.consumerData.name !== undefined ? currentNode.consumerData.name : "",
        language: currentNode?.consumerData.language !== undefined ? currentNode.consumerData.language : "",
        // restConfig to be generated
        restConfig: currentNode?.consumerData.restConfig !== undefined ? currentNode.consumerData.restConfig : getEmptyRestConfig(),
        // grpcConfig to be generated
        grpcConfig: currentNode?.consumerData.grpcConfig !== undefined ? currentNode.consumerData.grpcConfig : getEmptyGrpcConfig(),
        // wsServerType to be generated
        wsConfig: currentNode?.consumerData.wsConfig !== undefined ? currentNode.consumerData.wsConfig : getEmptyWsConfig(),
    });

    if (!props.id) {
        return <React.Fragment/>;
    }

    const getName = () => {
        if (payload?.name) {
            return <><strong>Name</strong> : {payload?.name}</>;
        }
        return "";
    };


    const getLanguage = () => {
        if (payload?.language) {
            return <><strong>Language</strong> : {payload?.language}</>;
        }
        return "";
    };

    const getRestTemplate = () => {
        if (payload?.restConfig?.template) {
            return <><strong>Template</strong>: {payload?.restConfig?.template}</>;
        }
        return "";
    };

    const getRestFramework = () => {
        if (payload?.restConfig?.framework) {
            return <><strong>Framework</strong>: {payload?.restConfig?.framework}</>;
        }
        return "";
    };

    const getRestServerPort = () => {
        if (payload?.restConfig?.server?.port) {
            return <><strong>Port</strong>: {payload?.restConfig?.server?.port}</>;
        }
        return "";
    };

    const getGrpcTemplate = () => {
        if (payload?.grpcConfig?.template) {
            return <><strong>Template</strong>: {payload.grpcConfig?.template}</>;
        }
        return "";
    };

    const getGrpcFramework = () => {
        if (payload?.grpcConfig?.framework) {
            return <><strong>Framework</strong>: {payload.grpcConfig?.framework}</>;
        }
        return "";
    };

    const getGrpcServerPort = () => {
        if (payload?.grpcConfig?.server?.port) {
            return <><strong>Port</strong>: {payload.grpcConfig?.server?.port}</>;
        }
        return "";
    };

    const getGrpcDetails = () => {
        if (payload?.grpcConfig?.server?.port) {
            return <React.Fragment>
                <Divider/>
                <strong style={{color: "green"}}> gRPC Config </strong>
                <Divider/>
                {getGrpcTemplate()}
                <br/>
                {getGrpcFramework()}
                <br/>
                {getGrpcServerPort()}
            </React.Fragment>;
        }
        return <React.Fragment></React.Fragment>;
    };

    const getRestDetails = () => {
        if (payload?.restConfig?.server?.port) {
            return <React.Fragment>
                <Divider/>
                <strong style={{color: "magenta"}}> REST Config </strong>
                <Divider/>
                {getRestTemplate()}
                <br/>
                {getRestFramework()}
                <br/>
                {getRestServerPort()}
            </React.Fragment>;
        }
        return <React.Fragment></React.Fragment>;
    };

    return <React.Fragment>
        <div className="contextMenu">
            <strong style={{color: "green"}}> Node </strong>: {props.id}
            <Divider/>
            {getName()}
            <br/>
            {getLanguage()}
            <br/>
            {getRestDetails()}
            {getGrpcDetails()}
        </div>
    </React.Fragment>;
};