import React, {ChangeEvent} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {setModifiedState} from "../../../utils/localstorage-client";
import {getParsedModifiedState} from "../helper/helper";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import {Checkbox, FormControlLabel, Stack} from "@mui/material";
import {Grpc, Resource, Rest, Ws} from "../models";
import {ModifyRestResource} from "./modify-rest-resource";
import DeleteIcon from '@mui/icons-material/Delete';

interface NewNodePropertiesProps {
    isOpen: boolean;
    nodeId: string;
    onClose: () => void;
}

interface ServerConfig {
    protocol?: string;
    port?: string;
    framework?: string;
    resources?: Resource[];
    openApiFileYamlContent?: string
}

interface ServerTypesConfig {
    isRestServer?: boolean;
    restServerConfig?: ServerConfig;
    isGrpcServer?: boolean;
    grpcServerConfig?: ServerConfig;
    isWsServer?: boolean;
    wsServerConfig?: ServerConfig;
}

// TODO incomplete impl below
const getServerTypesConfig = (parsedModifiedState, nodeId): ServerTypesConfig => {
    const serverTypes = parsedModifiedState.nodes[nodeId]?.consumerData.serverTypes;
    const serverTypesConfig: ServerTypesConfig = {};
    if (serverTypes || serverTypes !== undefined || serverTypes !== "[]") {
        for (let i = 0; i < serverTypes?.length; i++) {
            if (serverTypes[i]["protocol"] === Rest) {
                serverTypesConfig.isRestServer = true;
                serverTypesConfig.restServerConfig = {};
                serverTypesConfig.restServerConfig.port = serverTypes[i]["port"];
                serverTypesConfig.restServerConfig.framework = serverTypes[i]["framework"];
                serverTypesConfig.restServerConfig.resources = serverTypes[i]["resources"];
                serverTypesConfig.restServerConfig.openApiFileYamlContent = serverTypes[i]["openApiFileYamlContent"];
            } else if (serverTypes[i]["protocol"] === Grpc) {
                serverTypesConfig.isGrpcServer = true;
                serverTypesConfig.grpcServerConfig = {};
                serverTypesConfig.grpcServerConfig.port = serverTypes[i]["port"];
            } else if (serverTypes[i]["protocol"] === Ws) {
                serverTypesConfig.isWsServer = true;
                serverTypesConfig.wsServerConfig = {};
                serverTypesConfig.wsServerConfig.port = serverTypes[i]["port"];
            }
        }
    }
    return serverTypesConfig;
};

export const NewNodeProperties = (props: NewNodePropertiesProps) => {
    const parsedModifiedState = getParsedModifiedState();
    const serverTypesConfig: ServerTypesConfig = getServerTypesConfig(parsedModifiedState, props.nodeId);
    const emptyConfig: ServerConfig = {
        framework: "", port: "", protocol: "", resources: []
    };
    const [payload, setPayload] = React.useState({
        name: parsedModifiedState.nodes[props.nodeId]?.consumerData.name !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.name : "",
        template: parsedModifiedState.nodes[props.nodeId]?.consumerData.template !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.template : "compage",
        language: parsedModifiedState.nodes[props.nodeId]?.consumerData.language !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.language : "",
        isRestServer: serverTypesConfig.isRestServer || false,
        restServerConfig: serverTypesConfig.restServerConfig || emptyConfig,
        isGrpcServer: serverTypesConfig.isGrpcServer || false,
        grpcServerConfig: serverTypesConfig.grpcServerConfig || emptyConfig,
        isWsServer: serverTypesConfig.isWsServer || false,
        wsServerConfig: serverTypesConfig.wsServerConfig || emptyConfig,
        isModifyRestResourceOpen: false,
        currentRestResource: {
            name: "",
            fields: new Map<string, Map<string, string>>()
        }
    });

    // TODO this is a hack as there is no NODE_UPDATE action in diagram-maker. We may later update this impl when we fork diagram-maker repo.
    // update state with additional properties added from UI (Post node creation)
    const handleUpdate = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        const serverTypes = [];
        if (payload.isRestServer) {
            const restServerConfig: ServerConfig = {
                framework: payload.restServerConfig.framework,
                port: payload.restServerConfig.port,
                protocol: Rest,
                resources: payload.restServerConfig.resources,
                openApiFileYamlContent: payload.restServerConfig.openApiFileYamlContent
            };
            serverTypes.push(restServerConfig);
        }
        if (payload.isGrpcServer) {
            const grpcServerConfig: ServerConfig = {
                framework: payload.grpcServerConfig.framework,
                port: payload.grpcServerConfig.port,
                protocol: Grpc,
                resources: []
            };
            serverTypes.push(grpcServerConfig);
        }
        if (payload.isWsServer) {
            const wsServerConfig: ServerConfig = {
                framework: payload.wsServerConfig.framework,
                port: payload.wsServerConfig.port,
                protocol: Ws,
                resources: []
            };
            serverTypes.push(wsServerConfig);
        }

        const parsedModifiedState = getParsedModifiedState();
        // update modifiedState with current fields on dialog box
        // P.S. - We will have the fields in consumerData which are on dialogBox, so we can assign them directly. We also refer the older values when payload state is initialized, so the older values will be persisted as they are if not changed.
        if (!(props.nodeId in parsedModifiedState.nodes)) {
            // adding consumerData to new node in modifiedState
            parsedModifiedState.nodes[props.nodeId] = {
                consumerData: {
                    template: payload.template,
                    name: payload.name,
                    language: payload.language,
                    serverTypes
                }
            };
        } else {
            // adding consumerData to existing node in modifiedState
            parsedModifiedState.nodes[props.nodeId].consumerData = {
                template: payload.template,
                name: payload.name,
                language: payload.language,
                serverTypes
            };
        }
        // image to node display
        // const nodeElement = document.getElementById(props.nodeId);
        // nodeElement.style.backgroundImage = `url('${payload.url}')`;
        // update modifiedState in the localstorage
        setModifiedState(JSON.stringify(parsedModifiedState));
        setPayload({
            name: "",
            template: "",
            language: "",
            isGrpcServer: false,
            isRestServer: false,
            isWsServer: false,
            grpcServerConfig: emptyConfig,
            restServerConfig: emptyConfig,
            wsServerConfig: emptyConfig,
            isModifyRestResourceOpen: false,
            currentRestResource: {
                name: "",
                fields: new Map<string, Map<string, string>>()
            }
        });
        props.onClose();
    };

    const handleTemplateChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            template: event.target.value
        });
    };

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            name: event.target.value
        });
    };

    const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            language: event.target.value
        });
    };

    const handleIsRestServerChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPayload({
            ...payload,
            isRestServer: event.target.checked
        });
    };

    const handleAddRestResourceClick = () => {
        setPayload({
            ...payload,
            isModifyRestResourceOpen: !payload.isModifyRestResourceOpen
        });
    };

    const handleUploadOpenApiYamlClick = () => {
        console.log("handleUploadOpenApiYamlClick clicked");
    };

    const handleDeleteRestResourceClick = (d) => {
        payload.restServerConfig.resources = payload.restServerConfig.resources.filter(item => item.name !== d);
        setPayload({
            ...payload,
            restServerConfig: payload.restServerConfig
        });
    };

    const getExistingResources = () => {
        if (payload.restServerConfig.resources?.length > 0) {
            const getResources = () => {
                const resourceNames = [];
                payload.restServerConfig.resources.forEach(resource => {
                    resourceNames.push(resource.name);
                });
                return resourceNames;
            };
            const listItems = getResources().map((d) =>
                <li key={d}>
                    {d}<DeleteIcon onClick={() => {
                    handleDeleteRestResourceClick(d);
                }} fontSize="small"/>
                </li>
            );

            return <div>
                Existing resources :
                <ul>
                    {listItems}
                </ul>
            </div>;
        }

        return "";
    };

    const frameworks = ["net/http"];
    const getRestServerConfig = () => {
        if (payload.isRestServer) {
            const getContent = () => {
                if (payload.template === 'compage') {
                    return <React.Fragment>
                        <Button variant="outlined" color="secondary" onClick={handleAddRestResourceClick}>Add
                            Resource</Button>
                        {
                            getExistingResources()
                        }
                    </React.Fragment>
                } else {
                    return <React.Fragment>
                        {/*<Button variant="outlined" color="secondary"*/}
                        {/*        onClick={handleUploadOpenApiYamlClick}>Upload OpenApi Yaml</Button>*/}
                        <Button onClick={handleUploadOpenApiYamlClick} variant="outlined" color="secondary">Upload</Button>
                    </React.Fragment>
                }
            }

            return <React.Fragment>
                <TextField
                    required
                    size="medium"
                    margin="dense"
                    id="restServerConfigPort"
                    label="Port"
                    type="text"
                    value={payload.restServerConfig.port}
                    onChange={handleRestServerConfigPortChange}
                    variant="outlined"
                />
                <TextField
                    required
                    size="medium"
                    select
                    margin="dense"
                    id="restFramework"
                    label="Framework"
                    type="text"
                    value={payload.restServerConfig.framework}
                    onChange={handleRestServerConfigFrameworkChange}
                    variant="outlined">
                    {frameworks.map((framework: string) => (
                        <MenuItem key={framework} value={framework}>
                            {framework}
                        </MenuItem>
                    ))}
                </TextField>
                {getContent()}
            </React.Fragment>;
        }
        return "";
    };

    const getRestServerCheck = () => {
        return <React.Fragment>
            <FormControlLabel
                label="REST Server"
                control={<Checkbox
                    size="medium" checked={payload.isRestServer}
                    onChange={handleIsRestServerChange}
                />}
            />
        </React.Fragment>;
    };

    const handleRestServerConfigFrameworkChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const restServerConfig = payload.restServerConfig;
        restServerConfig.framework = event.target.value;
        setPayload({
            ...payload,
            restServerConfig
        });
    };

    const handleRestServerConfigOpenApiFileYamlContentChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const restServerConfig = payload.restServerConfig;
        restServerConfig.openApiFileYamlContent = event.target.value;
        setPayload({
            ...payload,
            restServerConfig
        });
    };

    const handleRestServerConfigPortChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const restServerConfig = payload.restServerConfig;
        restServerConfig.port = event.target.value;
        setPayload({
            ...payload,
            restServerConfig
        });
    };

    const handleIsGrpcServerChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPayload({
            ...payload,
            isGrpcServer: event.target.checked
        });
    };

    const getGrpcServerConfig = () => {
        if (payload.isGrpcServer) {
            return <React.Fragment>
                <TextField
                    required
                    size="medium"
                    margin="dense"
                    id="grpcServerConfigPort"
                    label="Port"
                    type="text"
                    value={payload.grpcServerConfig.port}
                    onChange={handleGrpcServerConfigPortChange}
                    variant="outlined"
                />
            </React.Fragment>;
        }
        return "";
    };

    const getGrpcServerCheck = () => {
        return <React.Fragment>
            <FormControlLabel
                label="gRPC Server"
                // remove below when grpc is supported.
                disabled
                control={<Checkbox
                    size="medium" checked={payload.isGrpcServer}
                    onChange={handleIsGrpcServerChange}
                />}
            />
        </React.Fragment>;
    };

    const handleGrpcServerConfigPortChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const grpcServerConfig = payload.grpcServerConfig;
        grpcServerConfig.port = event.target.value;
        setPayload({
            ...payload,
            grpcServerConfig
        });
    };

    const handleIsWsServerChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPayload({
            ...payload,
            isWsServer: event.target.checked
        });
    };

    const getWsServerConfig = () => {
        if (payload.isWsServer) {
            return <React.Fragment>
                <TextField
                    required
                    size="medium"
                    margin="dense"
                    id="wsServerConfigPort"
                    label="Port"
                    type="text"
                    value={payload.wsServerConfig.port}
                    onChange={handleWsServerConfigPortChange}
                    variant="outlined"
                />
            </React.Fragment>;
        }
        return "";
    };

    const getWsServerCheck = () => {
        return <React.Fragment>
            <FormControlLabel
                label="WS Server"
                // remove below when grpc is supported.
                disabled
                control={<Checkbox
                    size="medium" checked={payload.isWsServer}
                    onChange={handleIsWsServerChange}
                />}
            />
        </React.Fragment>;
    };

    const handleWsServerConfigPortChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const wsServerConfig = payload.wsServerConfig;
        wsServerConfig.port = event.target.value;
        setPayload({
            ...payload,
            wsServerConfig
        });
    };

    const templates = ["compage", "openApi"];
    const languages = ["go"];
    const handleModifyRestResourceClick = (resource: Resource) => {
        console.log(resource.fields);
        const restServerConfig = payload.restServerConfig;
        restServerConfig.resources.push(resource);
        setPayload({
            ...payload,
            restServerConfig,
            isModifyRestResourceOpen: !payload.isModifyRestResourceOpen
        });
    };

    const onModifyRestResourceClose = () => {
        console.log("onModifyRestResourceClose clicked");
        setPayload({
            ...payload,
            isModifyRestResourceOpen: !payload.isModifyRestResourceOpen
        });
    };

    return <React.Fragment>
        <ModifyRestResource isOpen={payload.isModifyRestResourceOpen}
                            resource={payload.currentRestResource}
                            onModifyRestResourceClose={onModifyRestResourceClose}
                            nodeId={props.nodeId}
                            handleModifyRestResourceClick={handleModifyRestResourceClick}/>

        <Dialog open={props.isOpen} onClose={props.onClose}>
            <DialogTitle>Node Properties : {props.nodeId}</DialogTitle>
            <Divider/>
            <DialogContent style={{
                height: "500px",
                width: "450px"
            }}>
                <Stack direction="column" spacing={2}>
                    <TextField
                        required
                        size="medium"
                        margin="dense"
                        id="name"
                        label="Name of Component"
                        type="text"
                        value={payload.name}
                        onChange={handleNameChange}
                        variant="outlined"
                    />
                    <TextField
                        required
                        size="medium"
                        select
                        margin="dense"
                        id="template"
                        label="Template for Component"
                        type="text"
                        value={payload.template}
                        onChange={handleTemplateChange}
                        variant="outlined">
                        {templates.map((template: string) => (
                            <MenuItem key={template} value={template}>
                                {template}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        required
                        size="medium"
                        select
                        margin="dense"
                        id="language"
                        label="Language"
                        type="text"
                        value={payload.language}
                        onChange={handleLanguageChange}
                        variant="outlined">
                        {/*<MenuItem value="">*/}
                        {/*    <em>Create new</em>*/}
                        {/*</MenuItem>*/}
                        {languages.map((language: string) => (
                            <MenuItem key={language} value={language}>
                                {language}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Stack style={{
                        padding: "10px",
                        borderRadius: "15px",
                        border: payload.isRestServer ? '1px solid #dadada' : ''
                    }} direction="column" spacing={2}>
                        {getRestServerCheck()}
                        {getRestServerConfig()}
                    </Stack>
                    <Stack style={{
                        padding: "10px",
                        borderRadius: "15px",
                        border: payload.isGrpcServer ? '1px solid #dadada' : ''
                    }} direction="column" spacing={2}>
                        {getGrpcServerCheck()}
                        {getGrpcServerConfig()}
                    </Stack>
                    <Stack style={{
                        padding: "10px",
                        borderRadius: "15px",
                        border: payload.isWsServer ? '1px solid #dadada' : ''
                    }} direction="column" spacing={2}>
                        {getWsServerCheck()}
                        {getWsServerConfig()}
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={props.onClose}>Cancel</Button>
                <Button variant="contained"
                        onClick={handleUpdate}
                        disabled={payload.name === "" || payload.language === ""}>Update</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
};
