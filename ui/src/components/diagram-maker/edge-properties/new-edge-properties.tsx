/* tslint:disable:no-string-literal */
import React, {ChangeEvent} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {getCurrentConfig, setModifiedState} from "../../../utils/localstorage-client";
import {getParsedModifiedState} from "../helper/helper";
import Divider from "@mui/material/Divider";
import {Checkbox, FormControlLabel, Stack} from "@mui/material";
import {
    CompageEdge,
    CompageNode,
    EmptyGrpcConfig,
    EmptyRestConfig,
    EmptyWsConfig,
    GrpcClient,
    GrpcConfig,
    RestClient,
    RestConfig,
    WsClient,
    WsConfig
} from "../models";

interface NewEdgePropertiesProps {
    isOpen: boolean;
    edgeId: string;
    onEdgePropertiesClose: () => void;
}

interface ClientTypesConfig {
    isRestServer?: boolean;
    restServerPort?: string;
    isGrpcServer?: boolean;
    grpcServerPort?: string;
    isWsServer?: boolean;
    wsServerPort?: string;
    sourceNodeName?: string;
    sourceNodeId?: string;
}

const getClientTypesConfig = (parsedCurrentConfig, parsedModifiedState, edgeId): ClientTypesConfig => {
    // read node's clients array and get these values
    const clientTypesConfig: ClientTypesConfig = {};
    const edgeConfig: CompageEdge = parsedCurrentConfig.edges[edgeId];
    const destNode: CompageNode = parsedModifiedState.nodes[edgeConfig?.dest];
    const srcNode: CompageNode = parsedModifiedState.nodes[edgeConfig?.src];
    const srcNodeConfig: CompageNode = parsedCurrentConfig.nodes[edgeConfig?.src];

    if (srcNode && destNode) {
        // rest - extract clients in dest node
        const restClients: RestClient[] = destNode?.consumerData?.restConfig?.clients;
        if (restClients && restClients.length > 0) {
            for (const restClient of restClients) {
                if (srcNodeConfig.id === restClient.sourceNodeId) {
                    clientTypesConfig.isRestServer = true;
                    clientTypesConfig.restServerPort = srcNode?.consumerData?.restConfig?.server?.port;
                    clientTypesConfig.sourceNodeId = srcNodeConfig?.id;
                    clientTypesConfig.sourceNodeName = srcNode?.consumerData?.name;
                }
            }
        }
        // grpc - extract clients in dest node
        const grpcClients: GrpcClient[] = destNode?.consumerData?.grpcConfig?.clients;
        if (grpcClients && grpcClients.length > 0) {
            for (const grpcClient of grpcClients) {
                if (srcNodeConfig.id === grpcClient.sourceNodeId) {
                    clientTypesConfig.isGrpcServer = true;
                    clientTypesConfig.grpcServerPort = srcNode?.consumerData?.grpcConfig?.server?.port;
                    clientTypesConfig.sourceNodeId = srcNodeConfig?.id;
                    clientTypesConfig.sourceNodeName = srcNode?.consumerData?.name;
                }
            }
        }
        // ws - extract clients in dest node
        const wsClients: WsClient[] = destNode?.consumerData?.wsConfig?.clients;
        if (wsClients && wsClients.length > 0) {
            for (const wsClient of wsClients) {
                if (srcNodeConfig.id === wsClient.sourceNodeId) {
                    clientTypesConfig.isWsServer = true;
                    clientTypesConfig.wsServerPort = srcNode?.consumerData?.wsConfig?.server?.port;
                    clientTypesConfig.sourceNodeId = srcNodeConfig?.id;
                    clientTypesConfig.sourceNodeName = srcNode?.consumerData?.name;
                }
            }
        }
    }
    return clientTypesConfig;
};

export const NewEdgeProperties = (props: NewEdgePropertiesProps) => {
    const parsedCurrentConfig = JSON.parse(getCurrentConfig());
    const parsedModifiedState = getParsedModifiedState();
    // TODO sometimes the parsedModifiedState is empty so, recreate it. this breaks, recreates the modifiedState, need to check.
    // if (Object.keys(parsedModifiedState.edges).length < 1) {
    //     updateModifiedState(parsedCurrentConfig);
    //     parsedModifiedState = getParsedModifiedState();
    // }
    const modifiedEdgeState: CompageEdge = parsedModifiedState.edges[props.edgeId];

    const clientTypesConfig: ClientTypesConfig = getClientTypesConfig(parsedCurrentConfig, parsedModifiedState, props.edgeId);

    const [payload, setPayload] = React.useState({
        name: modifiedEdgeState?.consumerData?.name !== undefined ? modifiedEdgeState?.consumerData?.name : "",
        isRestServer: clientTypesConfig.isRestServer || false,
        restServerPort: clientTypesConfig.restServerPort,
        isGrpcServer: clientTypesConfig.isGrpcServer || false,
        grpcServerPort: clientTypesConfig.grpcServerPort,
        isWsServer: clientTypesConfig.isWsServer || false,
        wsServerPort: clientTypesConfig.wsServerPort,
        sourceNodeName: clientTypesConfig.sourceNodeName,
        sourceNodeId: clientTypesConfig.sourceNodeId,
    });

    // TODO this is a hack as there is no EDGE_UPDATE action in diagram-maker. We may later update this impl when we fork diagram-maker repo.
    // update state with additional properties added from UI (Post edge creation)
    const handleEdgeUpdate = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        // update modifiedState with current fields on dialog box
        // P.S. - We will have the fields in consumerData which are on dialogBox, so we can assign them directly. We also refer the older values when payload state is initialized, so the older values will be persisted as they are if not changed.
        if (!(props.edgeId in parsedModifiedState.edges)) {
            // adding consumerData to new edge in parsedModifiedState
            parsedModifiedState.edges[props.edgeId] = {
                consumerData: {},
            };
        }

        // referring edge from config here instead of parsedModifiedState as the parsedModifiedState doesn't have a src and dest.
        const edgeConfig: CompageEdge = parsedCurrentConfig.edges[props.edgeId];
        const dstNode: CompageNode = parsedModifiedState.nodes[edgeConfig.dest];
        modifiedEdgeState.consumerData.name = payload.name;
        // get dest node and add details to it.
        if (payload.isRestServer) {
            if (payload.sourceNodeId && payload.sourceNodeName && payload.restServerPort) {
                const restClient: RestClient = {
                    sourceNodeName: payload.sourceNodeName,
                    sourceNodeId: payload.sourceNodeId,
                    port: payload.restServerPort,
                };
                for (let i = 0; i < dstNode?.consumerData?.restConfig?.clients?.length; i++) {
                    // search for old restClient and delete it.
                    if (dstNode?.consumerData?.restConfig?.clients[i]?.sourceNodeId === payload.sourceNodeId) {
                        dstNode?.consumerData?.restConfig?.clients.splice(i, 1);
                        break;
                    }
                }
                if (dstNode?.consumerData?.restConfig) {
                    dstNode?.consumerData?.restConfig?.clients.push(restClient);
                } else {
                    if (dstNode && dstNode.consumerData) {
                        dstNode.consumerData.restConfig = EmptyRestConfig;
                    } else {
                        dstNode.consumerData = {
                            name: "",
                            annotations: new Map<string, string>(),
                            metadata: new Map<string, string>(),
                            language: "",
                            restConfig: EmptyRestConfig
                        };
                    }
                    // push the client now.
                    dstNode?.consumerData?.restConfig?.clients.push(restClient);
                }
            }
        }
        if (payload.isGrpcServer) {
            if (payload.sourceNodeId && payload.sourceNodeName && payload.grpcServerPort) {
                const grpcClient: GrpcClient = {
                    sourceNodeName: payload.sourceNodeName,
                    sourceNodeId: payload.sourceNodeId,
                    port: payload.grpcServerPort,
                };
                for (let i = 0; i < dstNode?.consumerData?.grpcConfig?.clients?.length; i++) {
                    // search for old grpcClient and delete it.
                    if (dstNode?.consumerData?.grpcConfig?.clients[i]?.sourceNodeId === payload.sourceNodeId) {
                        dstNode?.consumerData?.grpcConfig?.clients.splice(i, 1);
                        break;
                    }
                }
                if (dstNode?.consumerData?.grpcConfig) {
                    dstNode?.consumerData?.grpcConfig?.clients.push(grpcClient);
                } else {
                    if (dstNode && dstNode.consumerData) {
                        dstNode.consumerData.grpcConfig = EmptyGrpcConfig;
                    } else {
                        dstNode.consumerData = {
                            name: "",
                            annotations: new Map<string, string>(),
                            metadata: new Map<string, string>(),
                            language: "",
                            grpcConfig: EmptyGrpcConfig
                        };
                    }
                    // push the client now.
                    dstNode?.consumerData?.grpcConfig?.clients.push(grpcClient);
                }
            }
        }
        if (payload.isWsServer) {
            if (payload.sourceNodeId && payload.sourceNodeName && payload.wsServerPort) {
                const wsClient: WsClient = {
                    sourceNodeName: payload.sourceNodeName,
                    sourceNodeId: payload.sourceNodeId,
                    port: payload.wsServerPort,
                };
                for (let i = 0; i < dstNode?.consumerData?.wsConfig?.clients?.length; i++) {
                    // search for old wsClient and delete it.
                    if (dstNode?.consumerData?.wsConfig?.clients[i]?.sourceNodeId === payload.sourceNodeId) {
                        dstNode?.consumerData?.wsConfig?.clients.splice(i, 1);
                        break;
                    }
                }
                if (dstNode?.consumerData?.wsConfig) {
                    dstNode?.consumerData?.wsConfig?.clients.push(wsClient);
                } else {
                    if (dstNode && dstNode.consumerData) {
                        dstNode.consumerData.wsConfig = EmptyWsConfig;
                    } else {
                        dstNode.consumerData = {
                            name: "",
                            annotations: new Map<string, string>(),
                            metadata: new Map<string, string>(),
                            language: "",
                            wsConfig: EmptyWsConfig
                        };
                    }
                    // push the client now.
                    dstNode?.consumerData?.wsConfig?.clients.push(wsClient);
                }
            }
        }

        // update parsedModifiedState in the localstorage
        setModifiedState(JSON.stringify(parsedModifiedState));
        setPayload({
            name: "",
            isRestServer: false,
            restServerPort: "",
            isGrpcServer: false,
            grpcServerPort: "",
            isWsServer: false,
            wsServerPort: "",
            sourceNodeName: "",
            sourceNodeId: ""
        });
        props.onEdgePropertiesClose();
    };

    const onEdgePropertiesClose = (e: any, reason: "backdropClick" | "escapeKeyDown") => {
        // this prevents dialog box from closing.
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
        }
        props.onEdgePropertiesClose();
    };

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            name: event.target.value
        });
    };

    const handleIsRestServerChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPayload({
            ...payload,
            isRestServer: event.target.checked
        });
    };

    const getRestServerCheck = () => {
        return <React.Fragment>
            <FormControlLabel
                label="Rest Server"
                control={<Checkbox
                    size="medium" checked={payload.isRestServer}
                    onChange={handleIsRestServerChange}
                />}
            />
        </React.Fragment>;
    };

    const getRestServerPort = () => {
        if (payload.isRestServer) {
            // retrieve port from src node.
            const srcNodeId = parsedCurrentConfig.edges[props.edgeId].src;
            const srcNode: CompageNode = parsedModifiedState.nodes[srcNodeId];
            const srcNodeConfig: CompageNode = parsedCurrentConfig.nodes[srcNodeId];
            const restConfig: RestConfig = srcNode?.consumerData?.restConfig;
            if (restConfig && restConfig.server.port) {
                payload.restServerPort = restConfig.server.port;
                payload.sourceNodeName = srcNode.consumerData.name;
                payload.sourceNodeId = srcNodeConfig.id;
            } else {
                // this is a default port for every project generated by openapi-generator
                payload.restServerPort = "8080";
            }
            return <TextField
                required
                size="medium"
                margin="dense"
                id="restServerPort"
                label="Rest Server Port"
                type="text"
                disabled
                value={payload.restServerPort}
                variant="outlined"
            />;
        }
        return "";
    };

    const handleIsGrpcServerChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPayload({
            ...payload,
            isGrpcServer: event.target.checked
        });
    };

    const getGrpcServerCheck = () => {
        return <React.Fragment>
            <FormControlLabel
                label="Grpc Server"
                control={<Checkbox
                    size="medium" checked={payload.isGrpcServer}
                    onChange={handleIsGrpcServerChange}
                />}
            />
        </React.Fragment>;
    };

    const getGrpcServerPort = () => {
        if (payload.isGrpcServer) {
            // retrieve port from src node.
            const srcNodeId: string = parsedCurrentConfig.edges[props.edgeId].src;
            const srcNode: CompageNode = parsedModifiedState.nodes[srcNodeId];
            const srcNodeConfig: CompageNode = parsedCurrentConfig.nodes[srcNodeId];
            const grpcConfig: GrpcConfig = srcNode?.consumerData?.grpcConfig;
            if (grpcConfig && grpcConfig.server.port) {
                payload.grpcServerPort = grpcConfig.server.port;
                payload.sourceNodeName = srcNode.consumerData.name;
                payload.sourceNodeId = srcNodeConfig.id;
            }
            return <TextField
                required
                size="medium"
                margin="dense"
                id="grpcServerPort"
                label="Grpc Server Port"
                type="text"
                disabled
                value={payload.grpcServerPort}
                variant="outlined"
            />;
        }
        return "";
    };

    const handleIsWsServerChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPayload({
            ...payload,
            isWsServer: event.target.checked
        });
    };

    const getWsServerCheck = () => {
        return <React.Fragment>
            <FormControlLabel
                label="Ws Server"
                disabled
                control={<Checkbox
                    size="medium" checked={payload.isWsServer}
                    onChange={handleIsWsServerChange}
                />}
            />
        </React.Fragment>;
    };

    const getWsServerPort = () => {
        if (payload.isWsServer) {
            // retrieve port from src node.
            const srcNodeId: string = parsedCurrentConfig.edges[props.edgeId].src;
            const srcNode: CompageNode = parsedModifiedState.nodes[srcNodeId];
            const srcNodeConfig: CompageNode = parsedCurrentConfig.nodes[srcNodeId];
            const wsConfig: WsConfig = srcNode?.consumerData?.wsConfig;
            if (wsConfig && wsConfig.server.port) {
                payload.wsServerPort = wsConfig.server.port;
                payload.sourceNodeName = srcNode.consumerData.name;
                payload.sourceNodeId = srcNodeConfig.id;
            }
            return <TextField
                required
                size="medium"
                margin="dense"
                id="wsServerPort"
                label="Port"
                type="text"
                value={payload.wsServerPort}
                variant="outlined"
            />;
        }
        return "";
    };

    return <React.Fragment>
        <Dialog open={props.isOpen} onClose={onEdgePropertiesClose}>
            <DialogTitle>Edge properties : {props.edgeId}</DialogTitle>
            <Divider/>
            <DialogContent>
                <Stack direction="column" spacing={2}>
                    <TextField
                        required
                        size="medium"
                        margin="dense"
                        id="name"
                        label="Name of edge"
                        type="text"
                        value={payload.name}
                        onChange={handleNameChange}
                        variant="outlined"
                    />
                    {getRestServerCheck()}
                    {getRestServerPort()}
                    {getGrpcServerCheck()}
                    {getGrpcServerPort()}
                    {/*{getWsServerCheck()}*/}
                    {/*{getWsServerPort()}*/}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={props.onEdgePropertiesClose}>Cancel</Button>
                <Button variant="contained"
                        onClick={handleEdgeUpdate}
                        disabled={payload.name === ""}>Update</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
};
