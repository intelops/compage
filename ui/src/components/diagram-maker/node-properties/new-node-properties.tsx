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
import {
    Checkbox,
    FormControlLabel,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {
    EmptyCurrentGrpcResource,
    EmptyCurrentRestResource,
    EmptyGrpcConfig,
    EmptyRestConfig,
    EmptyWsConfig,
    GrpcConfig,
    Resource,
    RestConfig,
    WsConfig
} from "../models";
import {AddOrUpdateRestResource} from "./add-or-update-rest-resource";
import {useAppSelector} from "../../../redux/hooks";
import {selectUploadYamlData, selectUploadYamlStatus} from "../../../features/open-api-yaml-operations/slice";
import {updateModifiedState} from "../../../features/projects-operations/populateModifiedState";
import {sanitizeString} from "../../../utils/backend-api";
import {UploadYaml} from "../../../features/open-api-yaml-operations/component";
import {
    COMPAGE,
    COMPAGE_LANGUAGE_FRAMEWORKS,
    COMPAGE_LANGUAGE_GRPC_FRAMEWORKS,
    COMPAGE_LANGUAGE_SQL_DBS,
    GO,
    isCompageTemplate,
    LANGUAGES,
    OPENAPI,
    OPENAPI_LANGUAGE_FRAMEWORKS
} from "./utils";
import "./new-node-properties.scss";
import {DeleteRestResource} from "./delete-rest-resource";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";
import {DeleteGrpcResource} from "./delete-grpc-resource";
import {AddOrUpdateGrpcResource} from "./add-or-update-grpc-resource";

interface NewNodePropertiesProps {
    isOpen: boolean;
    nodeId: string;
    onNodePropertiesClose: () => void;
}


interface NodeTypesConfig {
    isRestServer?: boolean;
    restConfig?: RestConfig;
    isGrpcServer?: boolean;
    grpcConfig?: GrpcConfig;
    isWsServer?: boolean;
    wsConfig?: WsConfig;
}

const getNodeTypesConfig = (parsedModifiedState, nodeId): NodeTypesConfig => {
    const restConfig: RestConfig = parsedModifiedState.nodes[nodeId]?.consumerData.restConfig;
    const grpcConfig: GrpcConfig = parsedModifiedState.nodes[nodeId]?.consumerData.grpcConfig;
    const wsConfig: WsConfig = parsedModifiedState.nodes[nodeId]?.consumerData.wsConfig;
    const nodeTypesConfig: NodeTypesConfig = {};
    if (restConfig && Object.keys(restConfig).length > 0) {
        nodeTypesConfig.isRestServer = true;
        nodeTypesConfig.restConfig = {
            server: {
                framework: restConfig.server.framework,
                sqlDb: restConfig.server.sqlDb,
                openApiFileYamlContent: restConfig.server.openApiFileYamlContent,
                port: restConfig.server.port,
                resources: restConfig.server.resources,
            },
            template: restConfig.template,
            clients: restConfig.clients
        };
    }
    if (grpcConfig && Object.keys(grpcConfig).length > 0) {
        nodeTypesConfig.isGrpcServer = true;
        nodeTypesConfig.grpcConfig = {
            template: grpcConfig.template,
            server: {
                framework: grpcConfig.server.framework,
                sqlDb: grpcConfig.server.sqlDb,
                port: grpcConfig.server.port,
                protoFileContent: grpcConfig.server.protoFileContent,
                resources: grpcConfig.server.resources
            },
            clients: grpcConfig.clients
        };
    }
    if (wsConfig && Object.keys(wsConfig).length > 0) {
        nodeTypesConfig.isWsServer = true;
        nodeTypesConfig.wsConfig = {
            server: {
                framework: wsConfig.server.framework,
                port: wsConfig.server.port,
                resources: wsConfig.server.resources
            },
            template: wsConfig.template,
            clients: wsConfig.clients
        };
    }
    return nodeTypesConfig;
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
    const nodeTypesConfig: NodeTypesConfig = getNodeTypesConfig(parsedModifiedState, props.nodeId);
    const [payload, setPayload] = React.useState({
        name: {
            value: parsedModifiedState.nodes[props.nodeId]?.consumerData.name !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.name : '',
            error: false,
            errorMessage: ''
        },
        language: parsedModifiedState.nodes[props.nodeId]?.consumerData.language !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.language : '',
        isRestServer: nodeTypesConfig.isRestServer || false,
        restConfig: nodeTypesConfig.restConfig || EmptyRestConfig,
        isGrpcServer: nodeTypesConfig.isGrpcServer || false,
        grpcConfig: nodeTypesConfig.grpcConfig || EmptyGrpcConfig,
        isWsServer: nodeTypesConfig.isWsServer || false,
        wsConfig: nodeTypesConfig.wsConfig || EmptyWsConfig,
        // rest
        isAddRestResourceOpen: false,
        isUpdateRestResourceOpen: false,
        isDeleteRestResourceOpen: false,
        currentRestResource: EmptyCurrentRestResource,
        // grpc
        isAddGrpcResourceOpen: false,
        isUpdateGrpcResourceOpen: false,
        isDeleteGrpcResourceOpen: false,
        currentGrpcResource: EmptyCurrentGrpcResource
    });

    const isNameValid = () => {
        let newPayload = {...payload};
        // check for empty name
        if (payload.name.value === '') {
            newPayload = {
                ...newPayload,
                name: {
                    ...newPayload.name,
                    error: true,
                    errorMessage: "You must have a name for Node."
                }
            };
            setPayload(newPayload);
            return false;
        } else {
            // check for duplicate node name only when name has any value in it.
            const modifiedState = getParsedModifiedState();
            // tslint:disable-next-line: forin
            for (const key in modifiedState.nodes) {
                const node = modifiedState.nodes[key];
                console.log("modifiedState.nodes :", node);
                if (props.nodeId !== key
                    && node.consumerData.name === payload.name.value) {
                    newPayload = {
                        ...newPayload,
                        name: {
                            ...newPayload.name,
                            error: true,
                            errorMessage: 'You must have a unique name for node.'
                        }
                    };
                    setPayload(newPayload);
                    return false;
                }
            }

            // check for invalid names for fields.
            const regex = new RegExp("^[a-zA-Z-$][a-zA-Z-_$0-9]*$");
            if (!regex.test(payload.name.value)) {
                newPayload = {
                    ...newPayload,
                    name: {
                        ...newPayload.name,
                        error: true,
                        errorMessage: 'You must have a valid name for node.'
                    }
                };
                setPayload(newPayload);
                return false;
            }
        }
        return true;
    };

    const getPort = (template: string, port: string) => {
        return isCompageTemplate(template) ? port || "8080" : "8080";
    };

    // TODO this is a hack as there is no NODE_UPDATE action in diagram-maker. We may later update this impl when we fork diagram-maker repo.
    // update state with additional properties added from UI (Post node creation)
    const handleUpdateNode = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (isNameValid()) {
            let restConfig: RestConfig;
            let grpcConfig: GrpcConfig;
            let wsConfig: WsConfig;

            if (payload.isRestServer) {
                restConfig = {
                    server: {
                        sqlDb: payload.restConfig.server.sqlDb,
                        framework: payload.restConfig.server.framework,
                        port: getPort(payload.restConfig.template, payload.restConfig.server.port),
                    },
                    template: payload.restConfig.template,
                    clients: payload.restConfig.clients
                };
                if (isCompageTemplate(payload.restConfig.template)) {
                    restConfig.server.resources = payload.restConfig.server.resources;
                } else {
                    restConfig.server.resources = [];
                    restConfig.server.openApiFileYamlContent = uploadYamlData.content;
                }
            }
            if (payload.isGrpcServer) {
                grpcConfig = {
                    template: payload.grpcConfig.template,
                    server: {
                        sqlDb: payload.grpcConfig.server.sqlDb,
                        framework: payload.grpcConfig.server.framework,
                        port: payload.grpcConfig.server.port,
                    },
                    clients: payload.grpcConfig.clients
                };
                if (isCompageTemplate(payload.grpcConfig.template)) {
                    grpcConfig.server.resources = payload.grpcConfig.server.resources;
                }
            }
            if (payload.isWsServer) {
                wsConfig = {
                    template: payload.wsConfig.template,
                    server: {
                        framework: payload.wsConfig.server.framework,
                        port: payload.wsConfig.server.port,
                        resources: []
                    },
                    clients: payload.wsConfig.clients
                };
            }

            const modifiedState = getParsedModifiedState();
            // update modifiedState with current fields on dialog box
            // P.S. - We will have the fields in consumerData which are on dialogBox, so we can assign them directly. We also refer the older values when payload state is initialized, so the older values will be persisted as they are if not changed.
            if (!(props.nodeId in modifiedState.nodes)) {
                // adding consumerData to new node in modifiedState
                modifiedState.nodes[props.nodeId] = {
                    consumerData: {
                        name: payload.name.value,
                        language: payload.language,
                        restConfig,
                        grpcConfig,
                        wsConfig,
                    }
                };
            } else {
                // adding consumerData to existing node in modifiedState
                modifiedState.nodes[props.nodeId].consumerData = {
                    name: payload.name.value,
                    language: payload.language,
                    restConfig,
                    grpcConfig,
                    wsConfig,
                };
            }
            // image to node display
            // const nodeElement = document.getElementById(props.nodeId);
            // nodeElement.style.backgroundImage = `url('${payload.url}')`;
            // update modifiedState in the localstorage
            setModifiedState(JSON.stringify(modifiedState));
            setPayload({
                name: {
                    value: '',
                    error: false,
                    errorMessage: ''
                },
                language: '',
                isGrpcServer: false,
                isRestServer: false,
                isWsServer: false,
                grpcConfig: EmptyGrpcConfig,
                restConfig: EmptyRestConfig,
                wsConfig: EmptyWsConfig,
                isAddRestResourceOpen: false,
                isUpdateRestResourceOpen: false,
                isDeleteRestResourceOpen: false,
                currentRestResource: EmptyCurrentRestResource,
                isAddGrpcResourceOpen: false,
                isUpdateGrpcResourceOpen: false,
                isDeleteGrpcResourceOpen: false,
                currentGrpcResource: EmptyCurrentGrpcResource
            });
            props.onNodePropertiesClose();
        }
    };

    const handleTemplateChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const restConfig: RestConfig = payload.restConfig;
        restConfig.template = event.target.value;
        setPayload({
            ...payload,
            restConfig
        });
    };


    const handleGrpcTemplateChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const grpcConfig: GrpcConfig = payload.grpcConfig;
        grpcConfig.template = event.target.value;
        setPayload({
            ...payload,
            grpcConfig
        });
    };

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        const sanitizeName = sanitizeString(value);
        setPayload({
            ...payload,
            [name]: {
                ...payload[name],
                value: sanitizeName,
            }
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
            isAddRestResourceOpen: !payload.isAddRestResourceOpen,
            currentRestResource: EmptyCurrentRestResource
        });
    };

    const handleEditRestResourceClick = (resource: Resource) => {
        setPayload({
            ...payload,
            isUpdateRestResourceOpen: !payload.isUpdateRestResourceOpen,
            currentRestResource: resource
        });
    };

    const handleDeleteRestResourceClick = (resourceName: string) => {
        payload.currentRestResource = {
            name: resourceName
        };
        setPayload({
            ...payload,
            isDeleteRestResourceOpen: !payload.isDeleteRestResourceOpen
        });
    };

    const getExistingResources = () => {
        if (payload.restConfig.server.resources?.length > 0) {
            return <>
                <br/>
                Existing REST resources :
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 400}}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Resource</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                payload.restConfig.server.resources.map((resource, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell scope="row">
                                            {resource.name}
                                        </TableCell>
                                        <TableCell align="left">
                                            <Stack direction="row-reverse" spacing={1}>
                                                <Button variant="text"
                                                        color="error"
                                                        onClick={() => handleDeleteRestResourceClick(resource.name)}>
                                                    <RemoveIcon/>
                                                </Button>
                                                <Button variant="text"
                                                        onClick={() => handleEditRestResourceClick(resource)}>
                                                    <EditIcon/>
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </>;
        }

        return '';
    };

    const getTemplateContent = () => {
        let templates;
        if (payload.language === GO) {
            templates = [COMPAGE, OPENAPI];
        } else {
            templates = [OPENAPI];
        }
        if (templates.length > 0) {
            return <TextField
                required
                size="medium"
                select
                margin="dense"
                id="template"
                defaultValue=''
                label="Template"
                type="text"
                value={payload.restConfig.template}
                onChange={handleTemplateChange}
                variant="outlined">
                {
                    templates.map((template: string) => (
                        <MenuItem key={template} value={template}>
                            {template}
                        </MenuItem>
                    ))
                }
            </TextField>;
        }
        return '';
    };

    const getSqlDbContent = () => {
        // create language:sqlDbs map based on template chosen
        let map;
        if (isCompageTemplate(payload.restConfig.template)) {
            map = new Map(Object.entries(COMPAGE_LANGUAGE_SQL_DBS));
        } else {
            map = new Map();
        }
        const sqlDbs = map.get(payload.language) || [];

        if (sqlDbs.length > 0) {
            return <TextField
                required
                size="medium"
                select
                margin="dense"
                id="restSqlDb"
                label="Sql Database"
                defaultValue=''
                type="text"
                value={payload.restConfig.server.sqlDb}
                onChange={handleRestConfigServerSqlDbChange}
                variant="outlined">
                {sqlDbs.map((sqlDb: string) => (
                    <MenuItem key={sqlDb} value={sqlDb}>
                        {sqlDb}
                    </MenuItem>
                ))}
            </TextField>;
        }
        return '';
    };

    const getFrameworkContent = () => {
        // create language:frameworks map based on template chosen
        let map;
        if (isCompageTemplate(payload.restConfig.template)) {
            map = new Map(Object.entries(COMPAGE_LANGUAGE_FRAMEWORKS));
        } else {
            map = new Map(Object.entries(OPENAPI_LANGUAGE_FRAMEWORKS));
        }
        const frameworks = map.get(payload.language) || [];

        if (frameworks.length > 0) {
            return <TextField
                required
                size="medium"
                select
                margin="dense"
                id="restFramework"
                label="Framework"
                defaultValue=''
                type="text"
                value={payload.restConfig.server.framework}
                onChange={handleRestConfigServerFrameworkChange}
                variant="outlined">
                {frameworks.map((framework: string) => (
                    <MenuItem key={framework} value={framework}>
                        {framework}
                    </MenuItem>
                ))}
            </TextField>;
        }
        return '';
    };

    const getPortContent = () => {
        if (isCompageTemplate(payload.restConfig.template)) {
            return <TextField
                required
                size="medium"
                margin="dense"
                id="restConfigPort"
                label="Port"
                type="number"
                value={payload.restConfig.server.port}
                onChange={handleRestConfigServerPortChange}
                variant="outlined"
            />;
        }
        return '';
    };

    const getResourcesContent = () => {
        if (isCompageTemplate(payload.restConfig.template)) {
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

    // grpc
    const handleAddGrpcResourceClick = () => {
        setPayload({
            ...payload,
            isAddGrpcResourceOpen: !payload.isAddGrpcResourceOpen,
            currentGrpcResource: EmptyCurrentGrpcResource
        });
    };

    const handleEditGrpcResourceClick = (resource: Resource) => {
        setPayload({
            ...payload,
            isUpdateGrpcResourceOpen: !payload.isUpdateGrpcResourceOpen,
            currentGrpcResource: resource
        });
    };

    const handleDeleteGrpcResourceClick = (resourceName: string) => {
        payload.currentGrpcResource = {
            name: resourceName
        };
        setPayload({
            ...payload,
            isDeleteGrpcResourceOpen: !payload.isDeleteGrpcResourceOpen
        });
    };
    const getExistingGrpcResources = () => {
        if (payload.grpcConfig.server.resources?.length > 0) {
            return <>
                <br/>
                Existing gRPC resources :
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 400}}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Resource</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                payload.grpcConfig.server.resources.map((resource, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell scope="row">
                                            {resource.name}
                                        </TableCell>
                                        <TableCell align="left">
                                            <Stack direction="row-reverse" spacing={1}>
                                                <Button variant="text"
                                                        color="error"
                                                        onClick={() => handleDeleteGrpcResourceClick(resource.name)}>
                                                    <RemoveIcon/>
                                                </Button>
                                                <Button variant="text"
                                                        onClick={() => handleEditGrpcResourceClick(resource)}>
                                                    <EditIcon/>
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </>;
        }

        return '';
    };

    const getGrpcTemplateContent = () => {
        let templates;
        if (payload.language === GO) {
            templates = [COMPAGE];
        } else {
            templates = [];
        }
        if (templates.length > 0) {
            return <TextField
                required
                size="medium"
                select
                margin="dense"
                id="grpcTemplate"
                defaultValue=''
                label="Template"
                type="text"
                value={payload.grpcConfig.template}
                onChange={handleGrpcTemplateChange}
                variant="outlined">
                {
                    templates.map((template: string) => (
                        <MenuItem key={template} value={template}>
                            {template}
                        </MenuItem>
                    ))
                }
            </TextField>;
        }
        return '';
    };

    const getGrpcSqlDbContent = () => {
        // create language:sqlDbs map based on template chosen
        let map;
        if (isCompageTemplate(payload.grpcConfig.template)) {
            map = new Map(Object.entries(COMPAGE_LANGUAGE_SQL_DBS));
        } else {
            map = new Map();
        }
        const sqlDbs = map.get(payload.language) || [];

        if (sqlDbs.length > 0) {
            return <TextField
                required
                size="medium"
                select
                margin="dense"
                id="grpcSqlDb"
                label="Sql Database"
                defaultValue=''
                type="text"
                value={payload.grpcConfig.server.sqlDb}
                onChange={handleGrpcConfigServerSqlDbChange}
                variant="outlined">
                {sqlDbs.map((sqlDb: string) => (
                    <MenuItem key={sqlDb} value={sqlDb}>
                        {sqlDb}
                    </MenuItem>
                ))}
            </TextField>;
        }
        return '';
    };

    const getGrpcFrameworkContent = () => {
        // create language:frameworks map based on template chosen
        let map;
        if (isCompageTemplate(payload.grpcConfig.template)) {
            map = new Map(Object.entries(COMPAGE_LANGUAGE_GRPC_FRAMEWORKS));
        } else {
            map = new Map();
        }
        const frameworks = map.get(payload.language) || [];

        if (frameworks.length > 0) {
            return <TextField
                required
                size="medium"
                select
                margin="dense"
                id="grpcFramework"
                label="Framework"
                defaultValue=''
                type="text"
                value={payload.grpcConfig.server.framework}
                onChange={handleGrpcConfigServerFrameworkChange}
                variant="outlined">
                {frameworks.map((framework: string) => (
                    <MenuItem key={framework} value={framework}>
                        {framework}
                    </MenuItem>
                ))}
            </TextField>;
        }
        return '';
    };

    const getGrpcPortContent = () => {
        if (isCompageTemplate(payload.grpcConfig.template)) {
            return <TextField
                required
                size="medium"
                margin="dense"
                id="grpcConfigPort"
                label="Port"
                type="number"
                value={payload.grpcConfig.server.port}
                onChange={handleGrpcConfigServerPortChange}
                variant="outlined"
            />;
        }
        return '';
    };

    const getGrpcResourcesContent = () => {
        if (isCompageTemplate(payload.grpcConfig.template)) {
            return <React.Fragment>
                <Button variant="outlined" color="secondary" onClick={handleAddGrpcResourceClick}>
                    Add Resource
                </Button>
                {
                    getExistingGrpcResources()
                }
            </React.Fragment>;
        }
        return <React.Fragment>
        </React.Fragment>;
    };

    const handleGrpcConfigServerSqlDbChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const grpcConfig: GrpcConfig = payload.grpcConfig;
        grpcConfig.server.sqlDb = event.target.value;
        setPayload({
            ...payload,
            grpcConfig
        });
    };

    const handleGrpcConfigServerFrameworkChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const grpcConfig: GrpcConfig = payload.grpcConfig;
        grpcConfig.server.framework = event.target.value;
        setPayload({
            ...payload,
            grpcConfig
        });
    };

    const handleIsGrpcServerChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPayload({
            ...payload,
            isGrpcServer: event.target.checked
        });
    };

    const getGrpcConfig = () => {
        if (payload.isGrpcServer) {
            return <React.Fragment>
                {getGrpcTemplateContent()}
                {getGrpcFrameworkContent()}
                {getGrpcPortContent()}
                {getGrpcSqlDbContent()}
                {getGrpcResourcesContent()}
            </React.Fragment>;
        }
        return '';
    };

    const getGrpcServerCheck = () => {
        return <React.Fragment>
            <FormControlLabel
                label="gRPC Server"
                control={<Checkbox
                    size="medium" checked={payload.isGrpcServer}
                    onChange={handleIsGrpcServerChange}
                />}
            />
        </React.Fragment>;
    };

    const handleGrpcConfigServerPortChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const grpcConfig: GrpcConfig = payload.grpcConfig;
        grpcConfig.server.port = event.target.value;
        setPayload({
            ...payload,
            grpcConfig,
        });
    };


    const handleAddOrUpdateGrpcResource = (resource: Resource) => {
        const grpcConfig: GrpcConfig = payload.grpcConfig;
        // the below check is to identify if the rest resource is added or updated.
        if (payload.isUpdateGrpcResourceOpen) {
            // remove the old resource while updating
            grpcConfig.server.resources = grpcConfig.server.resources.filter(res => res.name !== resource.name);
            grpcConfig.server.resources.push(resource);
            payload.isUpdateGrpcResourceOpen = false;
        } else if (payload.isAddGrpcResourceOpen) {
            payload.isAddGrpcResourceOpen = false;
            grpcConfig.server.resources.push(resource);
        }
        setPayload({
            ...payload,
            grpcConfig,
        });
    };

    const handleDeleteGrpcResource = () => {
        const currentGrpcResource = payload.currentGrpcResource;
        payload.grpcConfig.server.resources = payload.grpcConfig.server.resources.filter(resource => resource.name !== currentGrpcResource.name);
        setPayload({
            ...payload,
            grpcConfig: payload.grpcConfig,
            isDeleteGrpcResourceOpen: !payload.isDeleteGrpcResourceOpen
        });
    };

    const onDeleteGrpcResourceClose = () => {
        setPayload({
            ...payload,
            isDeleteGrpcResourceOpen: !payload.isDeleteGrpcResourceOpen
        });
    };

    const onAddOrUpdateGrpcResourceClose = () => {
        if (payload.isAddGrpcResourceOpen) {
            payload.isAddGrpcResourceOpen = false;
        } else if (payload.isUpdateGrpcResourceOpen) {
            payload.isUpdateGrpcResourceOpen = false;
        }
        setPayload({
            ...payload,
        });
    };

    const getGrpcResourceNames = () => {
        if (payload.grpcConfig.server.resources.length > 0) {
            const resourceNames = [];
            payload.grpcConfig.server.resources.forEach(resource => {
                resourceNames.push(resource.name);
            });
            return resourceNames;
        }
        return [];
    };

    const getRestConfig = () => {
        if (payload.isRestServer) {
            return <React.Fragment>
                {getTemplateContent()}
                {getFrameworkContent()}
                {getPortContent()}
                {getSqlDbContent()}
                {getResourcesContent()}
            </React.Fragment>;
        }
        return '';
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

    const handleRestConfigServerSqlDbChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const restConfig: RestConfig = payload.restConfig;
        restConfig.server.sqlDb = event.target.value;
        setPayload({
            ...payload,
            restConfig
        });
    };

    const handleRestConfigServerFrameworkChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const restConfig: RestConfig = payload.restConfig;
        restConfig.server.framework = event.target.value;
        setPayload({
            ...payload,
            restConfig
        });
    };

    const handleRestConfigServerPortChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const restConfig: RestConfig = payload.restConfig;
        restConfig.server.port = event.target.value;
        setPayload({
            ...payload,
            restConfig
        });
    };

    const handleIsWsServerChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPayload({
            ...payload,
            isWsServer: event.target.checked
        });
    };

    const getWsConfig = () => {
        if (payload.isWsServer) {
            return <React.Fragment>
                <TextField
                    required
                    size="medium"
                    margin="dense"
                    id="wsConfigPort"
                    label="Port"
                    type="text"
                    value={payload.wsConfig.server.port}
                    onChange={handleWsConfigServerPortChange}
                    variant="outlined"
                />
            </React.Fragment>;
        }
        return '';
    };

    const getWsServerCheck = () => {
        return <React.Fragment>
            <FormControlLabel
                label="WS Server"
                // remove below when ws is supported.
                disabled
                control={<Checkbox
                    size="medium" checked={payload.isWsServer}
                    onChange={handleIsWsServerChange}
                />}
            />
        </React.Fragment>;
    };

    const handleWsConfigServerPortChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const wsConfig: WsConfig = payload.wsConfig;
        wsConfig.server.port = event.target.value;
        setPayload({
            ...payload,
            wsConfig
        });
    };

    const handleAddOrUpdateRestResource = (resource: Resource) => {
        const restConfig: RestConfig = payload.restConfig;
        // the below check is to identify if the rest resource is added or updated.
        if (payload.isUpdateRestResourceOpen) {
            // remove the old resource while updating
            restConfig.server.resources = restConfig.server.resources.filter(res => res.name !== resource.name);
            restConfig.server.resources.push(resource);
            payload.isUpdateRestResourceOpen = false;
        } else if (payload.isAddRestResourceOpen) {
            payload.isAddRestResourceOpen = false;
            restConfig.server.resources.push(resource);
        }
        setPayload({
            ...payload,
            restConfig,
        });
    };

    const handleDeleteRestResource = () => {
        const currentRestResource = payload.currentRestResource;
        payload.restConfig.server.resources = payload.restConfig.server.resources.filter(resource => resource.name !== currentRestResource.name);
        setPayload({
            ...payload,
            restConfig: payload.restConfig,
            isDeleteRestResourceOpen: !payload.isDeleteRestResourceOpen
        });
    };

    const onDeleteRestResourceClose = () => {
        setPayload({
            ...payload,
            isDeleteRestResourceOpen: !payload.isDeleteRestResourceOpen
        });
    };

    const onAddOrUpdateRestResourceClose = () => {
        if (payload.isAddRestResourceOpen) {
            payload.isAddRestResourceOpen = false;
        } else if (payload.isUpdateRestResourceOpen) {
            payload.isUpdateRestResourceOpen = false;
        }
        setPayload({
            ...payload,
        });
    };

    const onClose = (e: any, reason: "backdropClick" | "escapeKeyDown") => {
        // this prevents dialog box from closing.
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
        }
        props.onNodePropertiesClose();
    };

    const getResourceNames = () => {
        if (payload.restConfig.server.resources.length > 0) {
            const resourceNames = [];
            payload.restConfig.server.resources.forEach(resource => {
                resourceNames.push(resource.name);
            });
            return resourceNames;
        }
        return [];
    };

    return <React.Fragment>
        {payload.isDeleteRestResourceOpen && (
            <DeleteRestResource isOpen={payload.isDeleteRestResourceOpen}
                                resource={payload.currentRestResource}
                                onDeleteRestResourceClose={onDeleteRestResourceClose}
                                handleDeleteRestResource={handleDeleteRestResource}/>
        )}
        {(payload.isAddRestResourceOpen || payload.isUpdateRestResourceOpen) && (
            <AddOrUpdateRestResource isOpen={payload.isAddRestResourceOpen || payload.isUpdateRestResourceOpen}
                                     resource={payload.currentRestResource}
                                     resourceNames={getResourceNames()}
                                     onAddOrUpdateRestResourceClose={onAddOrUpdateRestResourceClose}
                                     nodeId={props.nodeId}
                                     handleAddOrUpdateRestResource={handleAddOrUpdateRestResource}/>
        )}
        {payload.isDeleteGrpcResourceOpen && (
            <DeleteGrpcResource isOpen={payload.isDeleteGrpcResourceOpen}
                                resource={payload.currentGrpcResource}
                                onDeleteGrpcResourceClose={onDeleteGrpcResourceClose}
                                handleDeleteGrpcResource={handleDeleteGrpcResource}/>
        )}
        {(payload.isAddGrpcResourceOpen || payload.isUpdateGrpcResourceOpen) && (
            <AddOrUpdateGrpcResource isOpen={payload.isAddGrpcResourceOpen || payload.isUpdateGrpcResourceOpen}
                                     resource={payload.currentGrpcResource}
                                     resourceNames={getGrpcResourceNames()}
                                     onAddOrUpdateGrpcResourceClose={onAddOrUpdateGrpcResourceClose}
                                     nodeId={props.nodeId}
                                     handleAddOrUpdateGrpcResource={handleAddOrUpdateGrpcResource}/>
        )}
        {props.isOpen && (
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
                            name="name"
                            value={payload.name.value}
                            error={payload.name.error}
                            helperText={payload.name.error && payload.name.errorMessage}
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
                            {getRestConfig()}
                        </Stack>
                        <Stack style={{
                            padding: "10px",
                            borderRadius: "15px",
                            border: payload.isGrpcServer ? '1px solid #dadada' : ''
                        }} direction="column" spacing={2}>
                            {getGrpcServerCheck()}
                            {getGrpcConfig()}
                        </Stack>
                        <Stack style={{
                            padding: "10px",
                            borderRadius: "15px",
                            border: payload.isWsServer ? '1px solid #dadada' : ''
                        }} direction="column" spacing={2}>
                            {/*{getWsServerCheck()}*/}
                            {/*{getWsConfig()}*/}
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="secondary" onClick={props.onNodePropertiesClose}>Cancel</Button>
                    <Button variant="contained"
                            onClick={handleUpdateNode}
                            disabled={payload.name.value === '' || payload.language === '' || uploadYamlStatus === 'loading'}>Update
                        Node</Button>
                </DialogActions>
            </Dialog>
        )}
    </React.Fragment>;
};
