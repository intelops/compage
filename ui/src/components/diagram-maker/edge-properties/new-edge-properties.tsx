/* tslint:disable:no-string-literal */
import React, {ChangeEvent} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {getCurrentConfig, setModifiedState} from "../../../utils/localstorageClient";
import {getParsedModifiedState} from "../helper/helper";
import Divider from "@mui/material/Divider";
import {Checkbox, FormControlLabel, Stack} from "@mui/material";
import {
    CompageEdge,
    CompageJson,
    CompageNode,
    getEmptyGrpcConfig,
    getEmptyRestConfig,
    getEmptyWsConfig,
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

const getClientTypesConfig = (srcNodeConfig: CompageNode, srcNodeState: CompageNode, destNodeState: CompageNode): ClientTypesConfig => {
    const clientTypesConfig: ClientTypesConfig = {};
    if (srcNodeState && destNodeState) {
        // rest - extract clients in dest node
        const restClients: RestClient[] = destNodeState?.consumerData?.restConfig?.clients;
        if (restClients && restClients.length > 0) {
            for (const restClient of restClients) {
                if (srcNodeConfig.id === restClient.sourceNodeId) {
                    clientTypesConfig.isRestServer = true;
                    clientTypesConfig.restServerPort = srcNodeState?.consumerData?.restConfig?.server?.port;
                    clientTypesConfig.sourceNodeId = srcNodeConfig?.id;
                    clientTypesConfig.sourceNodeName = srcNodeState?.consumerData?.name;
                }
            }
        }
        // grpc - extract clients in dest node
        const grpcClients: GrpcClient[] = destNodeState?.consumerData?.grpcConfig?.clients;
        if (grpcClients && grpcClients.length > 0) {
            for (const grpcClient of grpcClients) {
                if (srcNodeConfig.id === grpcClient.sourceNodeId) {
                    clientTypesConfig.isGrpcServer = true;
                    clientTypesConfig.grpcServerPort = srcNodeState?.consumerData?.grpcConfig?.server?.port;
                    clientTypesConfig.sourceNodeId = srcNodeConfig?.id;
                    clientTypesConfig.sourceNodeName = srcNodeState?.consumerData?.name;
                }
            }
        }
        // ws - extract clients in dest node
        const wsClients: WsClient[] = destNodeState?.consumerData?.wsConfig?.clients;
        if (wsClients && wsClients.length > 0) {
            for (const wsClient of wsClients) {
                if (srcNodeConfig.id === wsClient.sourceNodeId) {
                    clientTypesConfig.isWsServer = true;
                    clientTypesConfig.wsServerPort = srcNodeState?.consumerData?.wsConfig?.server?.port;
                    clientTypesConfig.sourceNodeId = srcNodeConfig?.id;
                    clientTypesConfig.sourceNodeName = srcNodeState?.consumerData?.name;
                }
            }
        }
    }
    return clientTypesConfig;
};

export const NewEdgeProperties = (props: NewEdgePropertiesProps) => {
    const parsedCurrentConfig = JSON.parse(getCurrentConfig());
    const parsedModifiedState: CompageJson = getParsedModifiedState();
    // TODO sometimes the parsedModifiedState is empty so, recreate it. this breaks, recreates the modifiedState, need to check.
    // if (Object.keys(parsedModifiedState.edges).length < 1 || !parsedModifiedState.edges[props.edgeId]) {
    //     updateModifiedState(parsedCurrentConfig);
    //     parsedModifiedState : CompageJson = getParsedModifiedState();
    // }
    const currentEdgeState: CompageEdge = parsedModifiedState.edges[props.edgeId];
    // read node's clients array and get these values
    const currentEdgeConfig: CompageEdge = parsedCurrentConfig.edges[props.edgeId];
    const destNodeState: CompageNode = parsedModifiedState.nodes[currentEdgeConfig?.dest];
    const srcNodeState: CompageNode = parsedModifiedState.nodes[currentEdgeConfig?.src];
    const srcNodeConfig: CompageNode = parsedCurrentConfig.nodes[currentEdgeConfig?.src];

    const clientTypesConfig: ClientTypesConfig = getClientTypesConfig(srcNodeConfig, srcNodeState, destNodeState);

    const getDefaultName = () => {
        return srcNodeState?.consumerData?.name + "-to-" + destNodeState?.consumerData?.name;
    };

    const getName = () => {
        const name = currentEdgeState?.consumerData?.name;
        // name captured as undefined when destNode wasn't added properties with may include `undefined` in name.
        if (name && !name.includes("undefined")) {
            return name;
        }
        return getDefaultName();
    };

    const [payload, setPayload] = React.useState({
        name: getName(),
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
        let dstNodeState: CompageNode = parsedModifiedState.nodes[currentEdgeConfig.dest];
        if (!(props.edgeId in parsedModifiedState.edges)) {
            // adding consumerData to new node in modifiedState
            parsedModifiedState.edges[props.edgeId] = {
                consumerData: {
                    name: payload.name
                }
            };
        } else {
            parsedModifiedState.edges[props.edgeId].consumerData = {
                name: payload.name
            };
        }
        // get dest node and add details to it.
        if (payload.isRestServer) {
            if (payload.sourceNodeId && payload.sourceNodeName && payload.restServerPort) {
                const restClient: RestClient = {
                    sourceNodeName: payload.sourceNodeName,
                    sourceNodeId: payload.sourceNodeId,
                    port: payload.restServerPort,
                };
                for (let i = 0; i < dstNodeState?.consumerData?.restConfig?.clients?.length; i++) {
                    // search for old restClient and delete it.
                    if (dstNodeState?.consumerData?.restConfig?.clients[i]?.sourceNodeId === payload.sourceNodeId) {
                        dstNodeState?.consumerData?.restConfig?.clients?.splice(i, 1);
                        break;
                    }
                }
                if (dstNodeState?.consumerData?.restConfig) {
                    if (dstNodeState.consumerData.restConfig?.clients) {
                        dstNodeState?.consumerData?.restConfig?.clients?.push(restClient);
                    } else {
                        dstNodeState.consumerData.restConfig.clients = [];
                        dstNodeState.consumerData.restConfig.clients.push(restClient);
                    }
                } else {
                    if (dstNodeState) {
                        if (dstNodeState.consumerData) {
                            dstNodeState.consumerData.restConfig = getEmptyRestConfig();
                        } else {
                            dstNodeState.consumerData = {
                                name: "",
                                annotations: new Map<string, string>(),
                                metadata: new Map<string, string>(),
                                language: "",
                                restConfig: {
                                    clients: getEmptyRestConfig().clients
                                }
                            };
                        }
                    } else {
                        // node is not present in modified state
                        parsedModifiedState.nodes[currentEdgeConfig.dest] = {
                            consumerData: {
                                name: "",
                                annotations: new Map<string, string>(),
                                metadata: new Map<string, string>(),
                                language: "",
                                restConfig: {
                                    clients: getEmptyRestConfig().clients
                                }
                            }
                        };
                        // assign the newly created node to dstNode from modified state.
                        dstNodeState = parsedModifiedState.nodes[currentEdgeConfig.dest];
                    }
                    // push the client now.
                    dstNodeState?.consumerData?.restConfig?.clients?.push(restClient);
                }
            }
        } else {
            if (payload.sourceNodeId && payload.sourceNodeName && payload.restServerPort) {
                for (let i = 0; i < dstNodeState?.consumerData?.restConfig?.clients?.length; i++) {
                    // search for old restClient and delete it.
                    if (dstNodeState?.consumerData?.restConfig?.clients[i]?.sourceNodeId === payload.sourceNodeId) {
                        dstNodeState?.consumerData?.restConfig?.clients?.splice(i, 1);
                        break;
                    }
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
                for (let i = 0; i < dstNodeState?.consumerData?.grpcConfig?.clients?.length; i++) {
                    // search for old grpcClient and delete it.
                    if (dstNodeState?.consumerData?.grpcConfig?.clients[i]?.sourceNodeId === payload.sourceNodeId) {
                        dstNodeState?.consumerData?.grpcConfig?.clients.splice(i, 1);
                        break;
                    }
                }
                if (dstNodeState?.consumerData?.grpcConfig) {
                    if (dstNodeState.consumerData.grpcConfig?.clients) {
                        dstNodeState?.consumerData?.grpcConfig?.clients?.push(grpcClient);
                    } else {
                        dstNodeState.consumerData.grpcConfig.clients = [];
                        dstNodeState.consumerData.grpcConfig.clients.push(grpcClient);
                    }
                } else {
                    if (dstNodeState) {
                        if (dstNodeState.consumerData) {
                            dstNodeState.consumerData.grpcConfig = getEmptyGrpcConfig();
                        } else {
                            dstNodeState.consumerData = {
                                name: "",
                                annotations: new Map<string, string>(),
                                metadata: new Map<string, string>(),
                                language: "",
                                grpcConfig: {
                                    clients: getEmptyGrpcConfig().clients
                                }
                            };
                        }
                    } else {
                        // node is not present in modified state
                        parsedModifiedState.nodes[currentEdgeConfig.dest] = {
                            consumerData: {
                                name: "",
                                annotations: new Map<string, string>(),
                                metadata: new Map<string, string>(),
                                language: "",
                                grpcConfig: {
                                    clients: getEmptyGrpcConfig().clients
                                }
                            }
                        };
                        // assign the newly created node to dstNode from modified state.
                        dstNodeState = parsedModifiedState.nodes[currentEdgeConfig.dest];
                    }
                    // push the client now.
                    dstNodeState?.consumerData?.grpcConfig?.clients.push(grpcClient);
                }
            }
        } else {
            if (payload.sourceNodeId && payload.sourceNodeName && payload.grpcServerPort) {
                for (let i = 0; i < dstNodeState?.consumerData?.grpcConfig?.clients?.length; i++) {
                    // search for old grpcClient and delete it.
                    if (dstNodeState?.consumerData?.grpcConfig?.clients[i]?.sourceNodeId === payload.sourceNodeId) {
                        dstNodeState?.consumerData?.grpcConfig?.clients?.splice(i, 1);
                        break;
                    }
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
                for (let i = 0; i < dstNodeState?.consumerData?.wsConfig?.clients?.length; i++) {
                    // search for old wsClient and delete it.
                    if (dstNodeState?.consumerData?.wsConfig?.clients[i]?.sourceNodeId === payload.sourceNodeId) {
                        dstNodeState?.consumerData?.wsConfig?.clients.splice(i, 1);
                        break;
                    }
                }
                if (dstNodeState?.consumerData?.wsConfig) {
                    if (dstNodeState.consumerData.wsConfig?.clients) {
                        dstNodeState?.consumerData?.wsConfig?.clients?.push(wsClient);
                    } else {
                        dstNodeState.consumerData.wsConfig.clients = [];
                        dstNodeState.consumerData.wsConfig.clients.push(wsClient);
                    }
                } else {
                    if (dstNodeState) {
                        if (dstNodeState.consumerData) {
                            dstNodeState.consumerData.wsConfig = getEmptyWsConfig();
                        } else {
                            dstNodeState.consumerData = {
                                name: "",
                                annotations: new Map<string, string>(),
                                metadata: new Map<string, string>(),
                                language: "",
                                wsConfig: {
                                    clients: getEmptyWsConfig().clients
                                }
                            };
                        }
                    } else {
                        // node is not present in modified state
                        parsedModifiedState.nodes[currentEdgeConfig.dest] = {
                            consumerData: {
                                name: "",
                                annotations: new Map<string, string>(),
                                metadata: new Map<string, string>(),
                                language: "",
                                wsConfig: {
                                    clients: getEmptyWsConfig().clients
                                }
                            }
                        };
                        // assign the newly created node to dstNode from modified state.
                        dstNodeState = parsedModifiedState.nodes[currentEdgeConfig.dest];
                    }
                    // push the client now.
                    dstNodeState?.consumerData?.wsConfig?.clients.push(wsClient);
                }
            }
        } else {
            if (payload.sourceNodeId && payload.sourceNodeName && payload.grpcServerPort) {
                for (let i = 0; i < dstNodeState?.consumerData?.wsConfig?.clients?.length; i++) {
                    // search for old wsClient and delete it.
                    if (dstNodeState?.consumerData?.wsConfig?.clients[i]?.sourceNodeId === payload.sourceNodeId) {
                        dstNodeState?.consumerData?.wsConfig?.clients?.splice(i, 1);
                        break;
                    }
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

    const isRestServerDisabled = () => {
        if (srcNodeState && srcNodeState.consumerData && srcNodeState.consumerData.restConfig && srcNodeState.consumerData.restConfig.server) {
            return srcNodeState.consumerData.restConfig.server.port === "";
        }
        return true;
    };

    const getRestServerCheck = () => {
        return <React.Fragment>
            <FormControlLabel
                label="Rest Server"
                control={<Checkbox
                    size="medium" disabled={isRestServerDisabled()} checked={payload.isRestServer}
                    onChange={handleIsRestServerChange}
                />}
            />
        </React.Fragment>;
    };

    const getRestServerPort = () => {
        if (payload.isRestServer) {
            // retrieve port from src node.
            const restConfig: RestConfig = srcNodeState?.consumerData?.restConfig;
            if (restConfig && restConfig.server.port) {
                payload.restServerPort = restConfig?.server?.port;
            } else {
                // this is a default port for every project generated by openapi-generator
                payload.restServerPort = "8080";
            }
            payload.sourceNodeName = srcNodeState?.consumerData?.name;
            payload.sourceNodeId = srcNodeConfig.id;
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

    const isGrpcServerDisabled = () => {
        if (srcNodeState && srcNodeState.consumerData && srcNodeState.consumerData.grpcConfig && srcNodeState.consumerData.grpcConfig.server) {
            return srcNodeState.consumerData.grpcConfig.server.port === "";
        }
        return true;
    };

    const getGrpcServerCheck = () => {
        return <React.Fragment>
            <FormControlLabel
                label="Grpc Server"
                control={<Checkbox
                    disabled={isGrpcServerDisabled()}
                    size="medium" checked={payload.isGrpcServer}
                    onChange={handleIsGrpcServerChange}
                />}
            />
        </React.Fragment>;
    };

    const getGrpcServerPort = () => {
        if (payload.isGrpcServer) {
            // retrieve port from src node.
            const grpcConfig: GrpcConfig = srcNodeState?.consumerData?.grpcConfig;
            if (grpcConfig && grpcConfig.server.port) {
                payload.grpcServerPort = grpcConfig?.server?.port;
                payload.sourceNodeName = srcNodeState?.consumerData?.name;
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

    // eslint-disable-next-line
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

    // eslint-disable-next-line
    const getWsServerPort = () => {
        if (payload.isWsServer) {
            // retrieve port from src node.
            const wsConfig: WsConfig = srcNodeState?.consumerData?.wsConfig;
            if (wsConfig && wsConfig.server.port) {
                payload.wsServerPort = wsConfig.server.port;
            }
            payload.sourceNodeName = srcNodeState?.consumerData?.name;
            payload.sourceNodeId = srcNodeConfig.id;
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
