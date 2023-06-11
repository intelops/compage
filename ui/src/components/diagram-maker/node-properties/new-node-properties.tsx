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
import {AddOrUpdateRestServerResource} from "./add-or-update-rest-server-resource";
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
import {DeleteRestServerResource} from "./delete-rest-server-resource";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";
import {DeleteGrpcServerResource} from "./delete-grpc-server-resource";
import {AddOrUpdateGrpcServerResource} from "./add-or-update-grpc-server-resource";

interface NewNodePropertiesProps {
    isOpen: boolean;
    nodeId: string;
    onNodePropertiesClose: () => void;
}


interface NodeTypesConfig {
    isRestServer?: boolean;
    hasRestClients?: boolean;
    restConfig?: RestConfig;
    isGrpcServer?: boolean;
    hasGrpcClients?: boolean;
    grpcConfig?: GrpcConfig;
    isWsServer?: boolean;
    hasWsClients?: boolean;
    wsConfig?: WsConfig;
}

const getNodeTypesConfig = (parsedModifiedState, nodeId): NodeTypesConfig => {
    const restConfig: RestConfig = parsedModifiedState.nodes[nodeId]?.consumerData?.restConfig;
    const grpcConfig: GrpcConfig = parsedModifiedState.nodes[nodeId]?.consumerData?.grpcConfig;
    const wsConfig: WsConfig = parsedModifiedState.nodes[nodeId]?.consumerData?.wsConfig;
    const nodeTypesConfig: NodeTypesConfig = {};
    if (restConfig && Object.keys(restConfig).length > 0) {
        if (restConfig.server && Object.keys(restConfig?.server).length > 0) {
            nodeTypesConfig.isRestServer = true;
            nodeTypesConfig.restConfig = {
                server: restConfig.server
            };
        } else {
            nodeTypesConfig.restConfig = EmptyRestConfig;
        }
        if (restConfig?.clients?.length > 0) {
            nodeTypesConfig.hasRestClients = true;
            nodeTypesConfig.restConfig.clients = restConfig.clients;
        }
        // add template when the at lease rest server or clients are present.
        if (nodeTypesConfig?.restConfig?.server && Object.keys(nodeTypesConfig?.restConfig?.server).length > 0) {
            nodeTypesConfig.restConfig.template = restConfig.template || EmptyRestConfig.template;
        }
    }
    if (grpcConfig && Object.keys(grpcConfig).length > 0) {
        if (grpcConfig.server && Object.keys(grpcConfig?.server).length > 0) {
            nodeTypesConfig.isGrpcServer = true;
            nodeTypesConfig.grpcConfig = {
                server: grpcConfig.server
            };
        } else {
            nodeTypesConfig.grpcConfig = EmptyGrpcConfig;
        }
        if (grpcConfig?.clients?.length > 0) {
            nodeTypesConfig.hasGrpcClients = true;
            nodeTypesConfig.grpcConfig.clients = grpcConfig.clients;
        }
        // add template when the at lease grpc server or clients are present.
        if (nodeTypesConfig?.grpcConfig?.server && Object.keys(nodeTypesConfig?.grpcConfig?.server).length > 0) {
            nodeTypesConfig.grpcConfig.template = grpcConfig.template || EmptyGrpcConfig.template;
        }
    }
    if (wsConfig && Object.keys(wsConfig).length > 0) {
        nodeTypesConfig.wsConfig = {template: wsConfig.template || EmptyWsConfig.template};
        if (wsConfig.server && Object.keys(wsConfig?.server).length > 0) {
            nodeTypesConfig.isWsServer = true;
            nodeTypesConfig.wsConfig = {
                server: wsConfig.server
            };
        } else {
            nodeTypesConfig.wsConfig = EmptyWsConfig;
        }
        if (wsConfig?.clients?.length > 0) {
            nodeTypesConfig.hasWsClients = true;
            nodeTypesConfig.wsConfig.clients = wsConfig.clients;
        }
        // add template when the at lease ws server or clients are present.
        if (nodeTypesConfig?.wsConfig?.server && Object.keys(nodeTypesConfig?.wsConfig?.server).length > 0) {
            nodeTypesConfig.wsConfig.template = wsConfig.template || COMPAGE;
        }
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
        hasRestClients: nodeTypesConfig.hasRestClients || false,
        restConfig: nodeTypesConfig.restConfig || EmptyRestConfig,
        isGrpcServer: nodeTypesConfig.isGrpcServer || false,
        hasGrpcClients: nodeTypesConfig.hasGrpcClients || false,
        grpcConfig: nodeTypesConfig.grpcConfig || EmptyGrpcConfig,
        isWsServer: nodeTypesConfig.isWsServer || false,
        hasWsClients: nodeTypesConfig.hasWsClients || false,
        wsConfig: nodeTypesConfig.wsConfig || EmptyWsConfig,
        // rest
        isAddRestServerResourceOpen: false,
        isUpdateRestServerResourceOpen: false,
        isDeleteRestServerResourceOpen: false,
        currentRestServerResource: EmptyCurrentRestResource,
        // grpc
        isAddGrpcServerResourceOpen: false,
        isUpdateGrpcServerResourceOpen: false,
        isDeleteGrpcServerResourceOpen: false,
        currentGrpcServerResource: EmptyCurrentGrpcResource
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

    const getRestServerPort = (template: string, port: string) => {
        return isCompageTemplate(template) ? port || "8080" : "8080";
    };

    // TODO this is a hack as there is no NODE_UPDATE action in diagram-maker. We may later update this impl when we fork diagram-maker repo.
    // update state with additional properties added from UI (Post node creation)
    const handleNodeUpdate = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (isNameValid()) {
            const restConfig: RestConfig = {};
            const grpcConfig: GrpcConfig = {};
            const wsConfig: WsConfig = {};
            // rest
            if (payload.isRestServer) {
                restConfig.server = {
                    sqlDb: payload.restConfig.server.sqlDb,
                    framework: payload.restConfig.server.framework,
                    port: getRestServerPort(payload.restConfig.template, payload.restConfig.server.port),
                };
                if (isCompageTemplate(payload.restConfig.template)) {
                    restConfig.server.resources = payload.restConfig.server.resources;
                } else {
                    restConfig.server.resources = [];
                    restConfig.server.openApiFileYamlContent = uploadYamlData.content;
                }
            }
            if (payload.hasRestClients) {
                restConfig.clients = payload.restConfig.clients;
            }

            // add template when at lease one of the rest server or clients are added.
            if (Object.keys(restConfig).length > 0) {
                restConfig.template = payload.restConfig.template;
            }

            // grpc
            if (payload.isGrpcServer) {
                grpcConfig.server = {
                    sqlDb: payload.grpcConfig.server.sqlDb,
                    framework: payload.grpcConfig.server.framework,
                    port: payload.grpcConfig.server.port,
                };
                if (isCompageTemplate(payload.grpcConfig.template)) {
                    grpcConfig.server.resources = payload.grpcConfig.server.resources;
                }
            }
            if (payload.hasGrpcClients) {
                grpcConfig.clients = payload.grpcConfig.clients;
            }

            // add template when at lease one of the grpc server or clients are added.
            if (Object.keys(grpcConfig).length > 0) {
                grpcConfig.template = payload.grpcConfig.template;
            }

            // ws
            if (payload.isWsServer) {
                wsConfig.server = {
                    framework: payload.wsConfig.server.framework,
                    port: payload.wsConfig.server.port,
                    resources: []
                };
            }
            if (payload.hasWsClients) {
                wsConfig.clients = payload.wsConfig.clients;
            }

            // add template when at lease one of the ws server or clients are added.
            if (Object.keys(wsConfig).length > 0) {
                wsConfig.template = payload.wsConfig.template;
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
                    }
                };
            } else {
                // adding consumerData to existing node in modifiedState
                modifiedState.nodes[props.nodeId].consumerData = {
                    name: payload.name.value,
                    language: payload.language,
                };
            }
            if (Object.keys(restConfig).length > 0) {
                modifiedState.nodes[props.nodeId].consumerData.restConfig = restConfig;
            }
            if (Object.keys(grpcConfig).length > 0) {
                modifiedState.nodes[props.nodeId].consumerData.grpcConfig = grpcConfig;
            }
            if (Object.keys(wsConfig).length > 0) {
                modifiedState.nodes[props.nodeId].consumerData.wsConfig = wsConfig;
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
                hasGrpcClients: false,
                hasRestClients: false,
                hasWsClients: false,
                grpcConfig: EmptyGrpcConfig,
                restConfig: EmptyRestConfig,
                wsConfig: EmptyWsConfig,
                isAddRestServerResourceOpen: false,
                isUpdateRestServerResourceOpen: false,
                isDeleteRestServerResourceOpen: false,
                currentRestServerResource: EmptyCurrentRestResource,
                isAddGrpcServerResourceOpen: false,
                isUpdateGrpcServerResourceOpen: false,
                isDeleteGrpcServerResourceOpen: false,
                currentGrpcServerResource: EmptyCurrentGrpcResource
            });
            props.onNodePropertiesClose();
        }
    };

    const handleRestTemplateChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
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

    const handleHasRestClientsChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPayload({
            ...payload,
            hasRestClients: event.target.checked
        });
    };

    const handleAddRestResourceClick = () => {
        setPayload({
            ...payload,
            isAddRestServerResourceOpen: !payload.isAddRestServerResourceOpen,
            currentRestServerResource: EmptyCurrentRestResource
        });
    };

    const handleEditRestResourceClick = (resource: Resource) => {
        setPayload({
            ...payload,
            isUpdateRestServerResourceOpen: !payload.isUpdateRestServerResourceOpen,
            currentRestServerResource: resource
        });
    };

    const handleDeleteRestResourceClick = (resourceName: string) => {
        payload.currentRestServerResource = {
            name: resourceName
        };
        setPayload({
            ...payload,
            isDeleteRestServerResourceOpen: !payload.isDeleteRestServerResourceOpen
        });
    };

    const getExistingRestServerResources = () => {
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

    const getRestClientsTemplateContent = () => {
        return <React.Fragment>
            <TextField value={payload.restConfig.template} id="restClientTemplate" label="Template"
                       disabled
                       variant="outlined"/>
            <br/>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 400}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Source Node</TableCell>
                            <TableCell align="center">Port</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            payload.restConfig.clients.map((client, index) => (
                                <TableRow
                                    key={index}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell scope="row">
                                        {client.sourceNodeName}
                                    </TableCell>
                                    <TableCell align="center">
                                        {client.port}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>;
    };

    const getGrpcClientsTemplateContent = () => {
        return <React.Fragment>
            <TextField value={payload.grpcConfig.template} id="grpcClientTemplate" label="Template"
                       disabled
                       variant="outlined"/>
            <br/>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 400}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Source Node</TableCell>
                            <TableCell align="center">Port</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            payload.grpcConfig.clients.map((client, index) => (
                                <TableRow
                                    key={index}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell scope="row">
                                        {client.sourceNodeName}
                                    </TableCell>
                                    <TableCell align="center">
                                        {client.port}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>;
    };

    const getRestTemplateContent = () => {
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
                id="restServerTemplate"
                defaultValue=''
                label="Template"
                type="text"
                value={payload.restConfig.template}
                onChange={handleRestTemplateChange}
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

    const getRestServerSqlDbContent = () => {
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
                id="restServerSqlDb"
                label="Sql Database"
                defaultValue=''
                type="text"
                value={payload.restConfig.server.sqlDb}
                onChange={handleRestServerSqlDbChange}
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

    const getRestServerFrameworkContent = () => {
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
                id="restServerFramework"
                label="Framework"
                defaultValue=''
                type="text"
                value={payload.restConfig.server.framework}
                onChange={handleRestServerFrameworkChange}
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

    const getRestServerPortContent = () => {
        if (isCompageTemplate(payload.restConfig.template)) {
            return <TextField
                required
                size="medium"
                margin="dense"
                id="restServerPort"
                label="Port"
                type="number"
                value={payload.restConfig.server.port}
                onChange={handleRestServerPortChange}
                variant="outlined"
            />;
        }
        return '';
    };

    const getRestServerResourcesContent = () => {
        if (isCompageTemplate(payload.restConfig.template)) {
            return <React.Fragment>
                <Button variant="outlined" color="secondary" onClick={handleAddRestResourceClick}>
                    Add Resource
                </Button>
                {
                    getExistingRestServerResources()
                }
            </React.Fragment>;
        } else {
            return <React.Fragment>
                <UploadYaml nodeId={props.nodeId}/>
            </React.Fragment>;
        }
    };

    // grpc
    const handleAddGrpcServerResourceClick = () => {
        setPayload({
            ...payload,
            isAddGrpcServerResourceOpen: !payload.isAddGrpcServerResourceOpen,
            currentGrpcServerResource: EmptyCurrentGrpcResource
        });
    };

    const handleEditGrpcResourceClick = (resource: Resource) => {
        setPayload({
            ...payload,
            isUpdateGrpcServerResourceOpen: !payload.isUpdateGrpcServerResourceOpen,
            currentGrpcServerResource: resource
        });
    };

    const handleDeleteGrpcResourceClick = (resourceName: string) => {
        payload.currentGrpcServerResource = {
            name: resourceName
        };
        setPayload({
            ...payload,
            isDeleteGrpcServerResourceOpen: !payload.isDeleteGrpcServerResourceOpen
        });
    };
    const getExistingGrpcResources = () => {
        if (payload?.grpcConfig?.server?.resources?.length > 0) {
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
                                payload?.grpcConfig?.server?.resources.map((resource, index) => (
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
                id="grpcServerTemplate"
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

    const getGrpcServerSqlDbContent = () => {
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
                id="grpcServerSqlDb"
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

    const getGrpcServerFrameworkContent = () => {
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
                id="grpcServerFramework"
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

    const getGrpcServerPortContent = () => {
        if (isCompageTemplate(payload.grpcConfig.template)) {
            return <TextField
                required
                size="medium"
                margin="dense"
                id="grpcServerPort"
                label="Port"
                type="number"
                value={payload.grpcConfig.server.port}
                onChange={handleGrpcConfigServerPortChange}
                variant="outlined"
            />;
        }
        return '';
    };

    const getGrpcServerResourcesContent = () => {
        if (isCompageTemplate(payload.grpcConfig.template)) {
            return <React.Fragment>
                <Button variant="outlined" color="secondary" onClick={handleAddGrpcServerResourceClick}>
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

    const handleHasGrpcClientsChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPayload({
            ...payload,
            hasGrpcClients: event.target.checked
        });
    };


    const getGrpcServerConfig = () => {
        if (payload.isGrpcServer) {
            return <React.Fragment>
                {getGrpcTemplateContent()}
                {getGrpcServerFrameworkContent()}
                {getGrpcServerPortContent()}
                {getGrpcServerSqlDbContent()}
                {getGrpcServerResourcesContent()}
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

    const getGrpcClientsCheck = () => {
        if (payload.hasGrpcClients) {
            return <React.Fragment>
                <FormControlLabel
                    label="gRPC Clients"
                    control={<Checkbox
                        id="hasGrpcClients"
                        size="medium" checked={payload.hasGrpcClients} disabled
                        onChange={handleHasGrpcClientsChange}
                    />}
                />
            </React.Fragment>;
        }
        return "";
    };


    const getGrpcClientsConfig = () => {
        if (payload.hasGrpcClients) {
            return <React.Fragment>
                {getGrpcClientsTemplateContent()}
                {/*{getRestClientSourceNodeNameContent()}*/}
                {/*{getRestClientSourcePortContent()}*/}
            </React.Fragment>;
        }
        return '';
    };

    const handleGrpcConfigServerPortChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const grpcConfig: GrpcConfig = payload.grpcConfig;
        grpcConfig.server.port = event.target.value;
        setPayload({
            ...payload,
            grpcConfig,
        });
    };


    const handleAddOrUpdateGrpcServerResource = (resource: Resource) => {
        const grpcConfig: GrpcConfig = payload.grpcConfig;
        // the below check is to identify if the rest resource is added or updated.
        if (payload.isUpdateGrpcServerResourceOpen) {
            // remove the old resource while updating
            grpcConfig.server.resources = grpcConfig.server.resources.filter(res => res.name !== resource.name);
            grpcConfig.server.resources.push(resource);
            payload.isUpdateGrpcServerResourceOpen = false;
        } else if (payload.isAddGrpcServerResourceOpen) {
            payload.isAddGrpcServerResourceOpen = false;
            grpcConfig.server.resources.push(resource);
        }
        setPayload({
            ...payload,
            grpcConfig,
        });
    };

    const handleDeleteGrpcServerResource = () => {
        const currentGrpcServerResource = payload.currentGrpcServerResource;
        payload.grpcConfig.server.resources = payload.grpcConfig.server.resources.filter(resource => resource.name !== currentGrpcServerResource.name);
        setPayload({
            ...payload,
            grpcConfig: payload.grpcConfig,
            isDeleteGrpcServerResourceOpen: !payload.isDeleteGrpcServerResourceOpen
        });
    };

    const onDeleteGrpcServerResourceClose = () => {
        setPayload({
            ...payload,
            isDeleteGrpcServerResourceOpen: !payload.isDeleteGrpcServerResourceOpen
        });
    };

    const onAddOrUpdateGrpcServerResourceClose = () => {
        if (payload.isAddGrpcServerResourceOpen) {
            payload.isAddGrpcServerResourceOpen = false;
        } else if (payload.isUpdateGrpcServerResourceOpen) {
            payload.isUpdateGrpcServerResourceOpen = false;
        }
        setPayload({
            ...payload,
        });
    };

    const getGrpcServerResourceNames = () => {
        if (payload.grpcConfig.server.resources.length > 0) {
            const resourceNames = [];
            payload.grpcConfig.server.resources.forEach(resource => {
                resourceNames.push(resource.name);
            });
            return resourceNames;
        }
        return [];
    };

    const getRestServerConfig = () => {
        if (payload.isRestServer) {
            return <React.Fragment>
                {getRestTemplateContent()}
                {getRestServerFrameworkContent()}
                {getRestServerPortContent()}
                {getRestServerSqlDbContent()}
                {getRestServerResourcesContent()}
            </React.Fragment>;
        }
        return '';
    };

    const getRestServerCheck = () => {
        return <React.Fragment>
            <FormControlLabel
                label="REST Server"
                control={<Checkbox
                    id="isRestServer"
                    size="medium" checked={payload.isRestServer}
                    onChange={handleIsRestServerChange}
                />}
            />
        </React.Fragment>;
    };

    const getRestClientsCheck = () => {
        if (payload.hasRestClients) {
            return <React.Fragment>
                <FormControlLabel
                    label="REST Clients"
                    control={<Checkbox
                        id="hasRestClients"
                        size="medium" checked={payload.hasRestClients} disabled
                        onChange={handleHasRestClientsChange}
                    />}
                />
            </React.Fragment>;
        }
        return "";
    };


    const getRestClientsConfig = () => {
        if (payload.hasRestClients) {
            return <React.Fragment>
                {getRestClientsTemplateContent()}
                {/*{getRestClientSourceNodeNameContent()}*/}
                {/*{getRestClientSourcePortContent()}*/}
            </React.Fragment>;
        }
        return '';
    };

    const handleRestServerSqlDbChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const restConfig: RestConfig = payload.restConfig;
        restConfig.server.sqlDb = event.target.value;
        setPayload({
            ...payload,
            restConfig
        });
    };

    const handleRestServerFrameworkChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const restConfig: RestConfig = payload.restConfig;
        restConfig.server.framework = event.target.value;
        setPayload({
            ...payload,
            restConfig
        });
    };

    const handleRestServerPortChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
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

    const getWsServerConfig = () => {
        if (payload.isWsServer) {
            return <React.Fragment>
                <TextField
                    required
                    size="medium"
                    margin="dense"
                    id="wsServerPort"
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

    const handleAddOrUpdateRestServerResource = (resource: Resource) => {
        const restConfig: RestConfig = payload.restConfig;
        // the below check is to identify if the rest resource is added or updated.
        if (payload.isUpdateRestServerResourceOpen) {
            // remove the old resource while updating
            restConfig.server.resources = restConfig.server.resources.filter(res => res.name !== resource.name);
            restConfig.server.resources.push(resource);
            payload.isUpdateRestServerResourceOpen = false;
        } else if (payload.isAddRestServerResourceOpen) {
            payload.isAddRestServerResourceOpen = false;
            restConfig.server.resources.push(resource);
        }
        setPayload({
            ...payload,
            restConfig,
        });
    };

    const handleDeleteRestServerResource = () => {
        const currentRestServerResource = payload.currentRestServerResource;
        payload.restConfig.server.resources = payload.restConfig.server.resources.filter(resource => resource.name !== currentRestServerResource.name);
        setPayload({
            ...payload,
            restConfig: payload.restConfig,
            isDeleteRestServerResourceOpen: !payload.isDeleteRestServerResourceOpen
        });
    };

    const onDeleteRestServerResourceClose = () => {
        setPayload({
            ...payload,
            isDeleteRestServerResourceOpen: !payload.isDeleteRestServerResourceOpen
        });
    };

    const onAddOrUpdateRestServerResourceClose = () => {
        if (payload.isAddRestServerResourceOpen) {
            payload.isAddRestServerResourceOpen = false;
        } else if (payload.isUpdateRestServerResourceOpen) {
            payload.isUpdateRestServerResourceOpen = false;
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

    const getRestServerResourceNames = () => {
        if (payload.restConfig?.server?.resources?.length > 0) {
            const resourceNames = [];
            payload.restConfig?.server?.resources.forEach(resource => {
                resourceNames.push(resource.name);
            });
            return resourceNames;
        }
        return [];
    };

    return <React.Fragment>
        {payload.isDeleteRestServerResourceOpen && (
            <DeleteRestServerResource isOpen={payload.isDeleteRestServerResourceOpen}
                                      resource={payload.currentRestServerResource}
                                      onDeleteRestServerResourceClose={onDeleteRestServerResourceClose}
                                      handleDeleteRestServerResource={handleDeleteRestServerResource}/>
        )}
        {(payload.isAddRestServerResourceOpen || payload.isUpdateRestServerResourceOpen) && (
            <AddOrUpdateRestServerResource
                isOpen={payload.isAddRestServerResourceOpen || payload.isUpdateRestServerResourceOpen}
                resource={payload.currentRestServerResource}
                resourceNames={getRestServerResourceNames()}
                onAddOrUpdateRestServerResourceClose={onAddOrUpdateRestServerResourceClose}
                nodeId={props.nodeId}
                handleAddOrUpdateRestServerResource={handleAddOrUpdateRestServerResource}/>
        )}
        {payload.isDeleteGrpcServerResourceOpen && (
            <DeleteGrpcServerResource isOpen={payload.isDeleteGrpcServerResourceOpen}
                                      resource={payload.currentGrpcServerResource}
                                      onDeleteGrpcServerResourceClose={onDeleteGrpcServerResourceClose}
                                      handleDeleteGrpcServerResource={handleDeleteGrpcServerResource}/>
        )}
        {(payload.isAddGrpcServerResourceOpen || payload.isUpdateGrpcServerResourceOpen) && (
            <AddOrUpdateGrpcServerResource
                isOpen={payload.isAddGrpcServerResourceOpen || payload.isUpdateGrpcServerResourceOpen}
                resource={payload.currentGrpcServerResource}
                resourceNames={getGrpcServerResourceNames()}
                onAddOrUpdateGrpcServerResourceClose={onAddOrUpdateGrpcServerResourceClose}
                nodeId={props.nodeId}
                handleAddOrUpdateGrpcServerResource={handleAddOrUpdateGrpcServerResource}/>
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
                            {getRestServerConfig()}
                        </Stack>
                        <Stack style={{
                            padding: "10px",
                            borderRadius: "15px",
                            // background:"dimgray",
                            border: payload.hasRestClients ? '1px solid #dadada' : ''
                        }} direction="column" spacing={2}>
                            {getRestClientsCheck()}
                            {getRestClientsConfig()}
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
                            // background:"dimgray",
                            border: payload.hasGrpcClients ? '1px solid #dadada' : ''
                        }} direction="column" spacing={2}>
                            {getGrpcClientsCheck()}
                            {getGrpcClientsConfig()}
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
                    <Button variant="outlined" color="secondary" onClick={props.onNodePropertiesClose}>Cancel</Button>
                    <Button variant="contained"
                            onClick={handleNodeUpdate}
                            disabled={payload.name.value === '' || payload.language === '' || uploadYamlStatus === 'loading'}>Update
                        Node</Button>
                </DialogActions>
            </Dialog>
        )}
    </React.Fragment>;
};
