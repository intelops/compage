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
import MenuItem from "@mui/material/MenuItem";
import {Checkbox, FormControlLabel, Stack} from "@mui/material";
import {GrpcServerConfig, Resource, RestServerConfig, WsServerConfig} from "../models";
import {ModifyRestResource} from "./modify-rest-resource";
import DeleteIcon from '@mui/icons-material/Delete';
import {useAppSelector} from "../../../redux/hooks";
import {selectUploadYamlData, selectUploadYamlStatus} from "../../../features/open-api-yaml-operations/slice";
import {updateModifiedState} from "../../../features/projects/populateModifiedState";
import {sanitizeString} from "../../../utils/backend-api";
import {UploadYaml} from "../../../features/open-api-yaml-operations/component";
import {
    COMPAGE,
    COMPAGE_LANGUAGE_FRAMEWORKS,
    GO,
    isCompageTemplate,
    LANGUAGES,
    OPENAPI,
    OPENAPI_LANGUAGE_FRAMEWORKS
} from "./utils";

interface NewNodePropertiesProps {
    isOpen: boolean;
    nodeId: string;
    onClose: () => void;
}


interface ServerTypesConfig {
    isRestServer?: boolean;
    restServerConfig?: RestServerConfig;
    isGrpcServer?: boolean;
    grpcServerConfig?: GrpcServerConfig;
    isWsServer?: boolean;
    wsServerConfig?: WsServerConfig;
}

const getServerTypesConfig = (parsedModifiedState, nodeId): ServerTypesConfig => {
    const restServerConfig = parsedModifiedState.nodes[nodeId]?.consumerData.restServerConfig;
    const grpcServerConfig = parsedModifiedState.nodes[nodeId]?.consumerData.grpcServerConfig;
    const wsServerConfig = parsedModifiedState.nodes[nodeId]?.consumerData.wsServerConfig;
    const serverTypesConfig: ServerTypesConfig = {};
    if (restServerConfig && restServerConfig !== "{}" && Object.keys(restServerConfig).length > 0) {
        serverTypesConfig.isRestServer = true;
        serverTypesConfig.restServerConfig = {
            framework: restServerConfig.framework,
            openApiFileYamlContent: restServerConfig.openApiFileYamlContent,
            port: restServerConfig.port,
            resources: restServerConfig.resources,
            template: restServerConfig.template
        };
    }
    if (grpcServerConfig && grpcServerConfig !== "{}" && Object.keys(grpcServerConfig).length > 0) {
        serverTypesConfig.isGrpcServer = true;
        serverTypesConfig.grpcServerConfig = {
            framework: grpcServerConfig.framework,
            port: grpcServerConfig.port,
            protoFileContent: grpcServerConfig.protoFileContent,
            resources: grpcServerConfig.resources
        };
    }
    if (wsServerConfig && wsServerConfig !== "{}" && Object.keys(wsServerConfig).length > 0) {
        serverTypesConfig.isWsServer = true;
        serverTypesConfig.wsServerConfig = {
            framework: wsServerConfig.framework,
            port: wsServerConfig.port,
            resources: wsServerConfig.resources
        };
    }
    return serverTypesConfig;
};

export const NewNodeProperties = (props: NewNodePropertiesProps) => {
    const uploadYamlStatus = useAppSelector(selectUploadYamlStatus);
    const uploadYamlData = useAppSelector(selectUploadYamlData);
    let parsedModifiedState = getParsedModifiedState();
    // sometimes the parsedModifiedState is empty so, recreate it.
    if (Object.keys(parsedModifiedState.nodes).length < 1) {
        updateModifiedState(JSON.parse(getCurrentConfig()));
        parsedModifiedState = getParsedModifiedState();
    }
    const serverTypesConfig: ServerTypesConfig = getServerTypesConfig(parsedModifiedState, props.nodeId);
    const emptyRestServerConfig: RestServerConfig = {
        template: "",
        framework: "",
        port: "",
        resources: [],
        openApiFileYamlContent: ""
    };
    const emptyGrpcServerConfig: GrpcServerConfig = {
        framework: "", port: "", protoFileContent: "", resources: []
    };
    const emptyWsServerConfig: WsServerConfig = {framework: "", port: "", resources: []};

    const [payload, setPayload] = React.useState({
        name: parsedModifiedState.nodes[props.nodeId]?.consumerData.name !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.name : "",
        language: parsedModifiedState.nodes[props.nodeId]?.consumerData.language !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.language : "",
        isRestServer: serverTypesConfig.isRestServer || false,
        restServerConfig: serverTypesConfig.restServerConfig || emptyRestServerConfig,
        isGrpcServer: serverTypesConfig.isGrpcServer || false,
        grpcServerConfig: serverTypesConfig.grpcServerConfig || emptyGrpcServerConfig,
        isWsServer: serverTypesConfig.isWsServer || false,
        wsServerConfig: serverTypesConfig.wsServerConfig || emptyWsServerConfig,
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
        let restServerConfig: RestServerConfig;
        let grpcServerConfig: GrpcServerConfig;
        let wsServerConfig: WsServerConfig;

        if (payload.isRestServer) {
            restServerConfig = {
                framework: payload.restServerConfig.framework,
                port: payload.restServerConfig.port || "8080",
                template: payload.restServerConfig.template,
            };
            if (isCompageTemplate(payload.restServerConfig.template)) {
                restServerConfig.resources = payload.restServerConfig.resources;
            } else {
                restServerConfig.resources = [];
                restServerConfig.openApiFileYamlContent = uploadYamlData.content;
            }
        }
        if (payload.isGrpcServer) {
            grpcServerConfig = {
                framework: payload.grpcServerConfig.framework,
                port: payload.grpcServerConfig.port,
                resources: []
            };
        }
        if (payload.isWsServer) {
            wsServerConfig = {
                framework: payload.wsServerConfig.framework,
                port: payload.wsServerConfig.port,
                resources: []
            };
        }

        const modifiedState = getParsedModifiedState();
        // update modifiedState with current fields on dialog box
        // P.S. - We will have the fields in consumerData which are on dialogBox, so we can assign them directly. We also refer the older values when payload state is initialized, so the older values will be persisted as they are if not changed.
        if (!(props.nodeId in modifiedState.nodes)) {
            // adding consumerData to new node in modifiedState
            modifiedState.nodes[props.nodeId] = {
                consumerData: {
                    name: payload.name,
                    language: payload.language,
                    restServerConfig: restServerConfig,
                    grpcServerConfig: grpcServerConfig,
                    wsServerConfig: wsServerConfig,
                }
            };
        } else {
            // adding consumerData to existing node in modifiedState
            modifiedState.nodes[props.nodeId].consumerData = {
                name: payload.name,
                language: payload.language,
                restServerConfig: restServerConfig,
                grpcServerConfig: grpcServerConfig,
                wsServerConfig: wsServerConfig,
            };
        }
        // image to node display
        // const nodeElement = document.getElementById(props.nodeId);
        // nodeElement.style.backgroundImage = `url('${payload.url}')`;
        // update modifiedState in the localstorage
        setModifiedState(JSON.stringify(modifiedState));
        setPayload({
            name: "",
            language: "",
            isGrpcServer: false,
            isRestServer: false,
            isWsServer: false,
            grpcServerConfig: emptyGrpcServerConfig,
            restServerConfig: emptyRestServerConfig,
            wsServerConfig: emptyWsServerConfig,
            isModifyRestResourceOpen: false,
            currentRestResource: {
                name: "",
                fields: new Map<string, Map<string, string>>()
            }
        });
        props.onClose();
    };

    const handleTemplateChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const restServerConfig = payload.restServerConfig;
        restServerConfig.template = event.target.value;
        setPayload({
            ...payload,
            restServerConfig
        });
    };

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            name: sanitizeString(event.target.value)
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

    const getPortContent = () => {
        if (isCompageTemplate(payload.restServerConfig.template)) {
            return <TextField
                required
                size="medium"
                margin="dense"
                id="restServerConfigPort"
                label="Port"
                type="number"
                value={payload.restServerConfig.port}
                onChange={handleRestServerConfigPortChange}
                variant="outlined"
            />;
        }
        return "";
    };

    const getResourcesContent = () => {
        if (isCompageTemplate(payload.restServerConfig.template)) {
            return <React.Fragment>
                <Button variant="outlined" color="secondary" onClick={handleAddRestResourceClick}>
                    Add Resource
                </Button>
                {
                    getExistingResources()
                }
            </React.Fragment>;
        } else {
            return <React.Fragment>
                <UploadYaml nodeId={props.nodeId}/>
            </React.Fragment>;
        }
    };

    const getRestServerConfig = () => {
        if (payload.isRestServer) {
            let templates;
            if (payload.language === GO) {
                templates = [COMPAGE, OPENAPI];
            } else {
                templates = [OPENAPI]
            }
            // create language:frameworks map based on template chosen
            let map;
            if (isCompageTemplate(payload.restServerConfig.template)) {
                map = new Map(Object.entries(COMPAGE_LANGUAGE_FRAMEWORKS));
            } else {
                map = new Map(Object.entries(OPENAPI_LANGUAGE_FRAMEWORKS));
            }
            const frameworks = map.get(payload.language) || [];

            return <React.Fragment>
                <TextField
                    required
                    size="medium"
                    select
                    margin="dense"
                    id="template"
                    label="Template for Component"
                    type="text"
                    value={payload.restServerConfig.template}
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
                {getPortContent()}
                {getResourcesContent()}
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
            grpcServerConfig: grpcServerConfig,
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
            wsServerConfig: wsServerConfig
        });
    };

    const handleModifyRestResourceClick = (resource: Resource) => {
        const restServerConfig = payload.restServerConfig;
        restServerConfig.resources.push(resource);
        setPayload({
            ...payload,
            restServerConfig: restServerConfig,
            isModifyRestResourceOpen: !payload.isModifyRestResourceOpen
        });
    };

    const onModifyRestResourceClose = () => {
        setPayload({
            ...payload,
            isModifyRestResourceOpen: !payload.isModifyRestResourceOpen
        });
    };

    const onClose = (e: any, reason: "backdropClick" | "escapeKeyDown") => {
        // this prevents dialog box from closing.
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
        }
        props.onClose();
    };

    return <React.Fragment>
        <ModifyRestResource isOpen={payload.isModifyRestResourceOpen}
                            resource={payload.currentRestResource}
                            onModifyRestResourceClose={onModifyRestResourceClose}
                            nodeId={props.nodeId}
                            handleModifyRestResourceClick={handleModifyRestResourceClick}/>

        <Dialog open={props.isOpen} onClose={onClose}>
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
                        id="language"
                        label="Language"
                        type="text"
                        value={payload.language}
                        onChange={handleLanguageChange}
                        variant="outlined">
                        {/*<MenuItem value="">*/}
                        {/*    <em>Create new</em>*/}
                        {/*</MenuItem>*/}
                        {LANGUAGES.map((language: string) => (
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
                        {/*{getGrpcServerCheck()}*/}
                        {/*{getGrpcServerConfig()}*/}
                    </Stack>
                    <Stack style={{
                        padding: "10px",
                        borderRadius: "15px",
                        border: payload.isWsServer ? '1px solid #dadada' : ''
                    }} direction="column" spacing={2}>
                        {/*{getWsServerCheck()}*/}
                        {/*{getWsServerConfig()}*/}
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={props.onClose}>Cancel</Button>
                <Button variant="contained"
                        onClick={handleUpdate}
                        disabled={payload.name === "" || payload.language === "" || uploadYamlStatus === 'loading'}>Update</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
};
