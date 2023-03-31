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
    GrpcClientConfig,
    GrpcServerConfig,
    RestClientConfig,
    RestServerConfig,
    WsClientConfig,
    WsServerConfig
} from "../models";

interface NewEdgePropertiesProps {
    isOpen: boolean;
    edgeId: string;
    onClose: () => void;
}

interface ClientTypesConfig {
    isRestServer?: boolean;
    restServerPort?: string;
    isGrpcServer?: boolean;
    grpcServerPort?: string;
    isWsServer?: boolean;
    wsServerPort?: string;
}

const getClientTypesConfig = (parsedModifiedState, edgeId): ClientTypesConfig => {
    const clientTypesConfig = {};
    // rest
    const restClientConfig: RestClientConfig = parsedModifiedState.edges[edgeId]?.consumerData?.restClientConfig;
    if (restClientConfig && Object.keys(restClientConfig).length > 0) {
        clientTypesConfig["isRestServer"] = true;
        clientTypesConfig["restServerPort"] = restClientConfig.port;
    }
    // grpc
    const grpcClientConfig: GrpcClientConfig = parsedModifiedState.edges[edgeId]?.consumerData?.grpcClientConfig;
    if (grpcClientConfig && Object.keys(grpcClientConfig).length > 0) {
        clientTypesConfig["isGrpcServer"] = true;
        clientTypesConfig["grpcServerPort"] = grpcClientConfig.port;
    }
    // ws
    const wsClientConfig: WsClientConfig = parsedModifiedState.edges[edgeId]?.consumerData?.wsClientConfig;
    if (wsClientConfig && Object.keys(wsClientConfig).length > 0) {
        clientTypesConfig["isWsServer"] = true;
        clientTypesConfig["wsServerPort"] = wsClientConfig.port;
    }

    return clientTypesConfig;
};

const getExternalNode = (edgeId: string) => {
    const parsedModifiedState = getParsedModifiedState();
    const parsedConfig = JSON.parse(getCurrentConfig());
    const nodeId = parsedConfig.edges[edgeId].src;
    return parsedModifiedState.nodes[nodeId].consumerData.name;
};

export const NewEdgeProperties = (props: NewEdgePropertiesProps) => {
    const parsedModifiedState = getParsedModifiedState();
    const parsedCurrentConfig = JSON.parse(getCurrentConfig());
    const clientTypesConfig: ClientTypesConfig = getClientTypesConfig(parsedModifiedState, props.edgeId);

    const [payload, setPayload] = React.useState({
        name: parsedModifiedState.edges[props.edgeId]?.consumerData.name !== undefined ? parsedModifiedState.edges[props.edgeId].consumerData.name : "",
        isRestServer: clientTypesConfig.isRestServer || false,
        restServerPort: clientTypesConfig.restServerPort,
        isGrpcServer: clientTypesConfig.isGrpcServer || false,
        grpcServerPort: clientTypesConfig.grpcServerPort,
        isWsServer: clientTypesConfig.isWsServer || false,
        wsServerPort: clientTypesConfig.wsServerPort,
    });

    // TODO this is a hack as there is no EDGE_UPDATE action in diagram-maker. We may later update this impl when we fork diagram-maker repo.
    // update state with additional properties added from UI (Post edge creation)
    const handleUpdate = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        const modifiedState = getParsedModifiedState();
        // update modifiedState with current fields on dialog box
        // P.S. - We will have the fields in consumerData which are on dialogBox, so we can assign them directly. We also refer the older values when payload state is initialized, so the older values will be persisted as they are if not changed.
        if (!(props.edgeId in modifiedState.edges)) {
            // adding consumerData to new edge in modifiedState
            modifiedState.edges[props.edgeId] = {
                consumerData: {},
            };
        }

        modifiedState.edges[props.edgeId]["consumerData"]["name"] = payload.name;
        modifiedState.edges[props.edgeId]["consumerData"]["externalNode"] = getExternalNode(props.edgeId);
        if (payload.isRestServer) {
            modifiedState.edges[props.edgeId]["consumerData"]["restClientConfig"] = {port: payload.restServerPort};
        }
        if (payload.isGrpcServer) {
            modifiedState.edges[props.edgeId]["consumerData"]["grpcClientConfig"] = {port: payload.grpcServerPort};
        }
        if (payload.isWsServer) {
            modifiedState.edges[props.edgeId]["consumerData"]["wsClientConfig"] = {port: payload.wsServerPort};
        }

        // update modifiedState in the localstorage
        setModifiedState(JSON.stringify(modifiedState));
        setPayload({
            name: "",
            isRestServer: false,
            restServerPort: "",
            isGrpcServer: false,
            grpcServerPort: "",
            isWsServer: false,
            wsServerPort: ""
        });
        props.onClose();
    };

    const onClose = (e: any, reason: "backdropClick" | "escapeKeyDown") => {
        // this prevents dialog box from closing.
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
        }
        props.onClose();
    };

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            name: event.target.value
        });
    };

    const handleRestServerPortChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            restServerPort: event.target.value
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
            const srcNode = parsedCurrentConfig.edges[props.edgeId].src;
            const restServerConfig: RestServerConfig = parsedModifiedState.nodes[srcNode]?.consumerData?.restServerConfig;
            if (restServerConfig && restServerConfig.port) {
                payload.restServerPort = restServerConfig.port;
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
                onChange={handleRestServerPortChange}
                variant="outlined"
            />;
        }
        return "";
    };

    const handleGrpcServerPortChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            grpcServerPort: event.target.value
        });
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
                disabled
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
            const srcNode = parsedCurrentConfig.edges[props.edgeId].src;
            const grpcServerConfig: GrpcServerConfig = parsedModifiedState.nodes[srcNode]?.consumerData?.grpcServerConfig;
            if (grpcServerConfig && Object.keys(grpcServerConfig).length > 0) {
                payload.grpcServerPort = grpcServerConfig.port;
            }
            return <TextField
                required
                size="medium"
                margin="dense"
                id="grpcServerPort"
                label="Grpc Server Port"
                type="text"
                value={payload.grpcServerPort}
                onChange={handleGrpcServerPortChange}
                variant="outlined"
            />;
        }
        return "";
    };

    const handleWsServerPortChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            wsServerPort: event.target.value
        });
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
            const srcNode = parsedCurrentConfig.edges[props.edgeId].src;
            const wsServerConfig: WsServerConfig = parsedModifiedState.nodes[srcNode]?.consumerData?.wsServerConfig;
            if (wsServerConfig && Object.keys(wsServerConfig).length > 0) {
                payload.wsServerPort = wsServerConfig.port;
            }
            return <TextField
                required
                size="medium"
                margin="dense"
                id="wsServerPort"
                label="Port"
                type="text"
                value={payload.wsServerPort}
                onChange={handleWsServerPortChange}
                variant="outlined"
            />;
        }
        return "";
    };

    return <React.Fragment>
        <Dialog open={props.isOpen} onClose={onClose}>
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
                    {/*{getGrpcServerCheck()}*/}
                    {/*{getGrpcServerPort()}*/}
                    {/*{getWsServerCheck()}*/}
                    {/*{getWsServerPort()}*/}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={props.onClose}>Cancel</Button>
                <Button variant="contained"
                        onClick={handleUpdate}
                        disabled={payload.name === ""}>Update</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
};
