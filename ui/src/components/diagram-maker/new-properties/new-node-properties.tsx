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
    EmptyGrpcServerConfig,
    EmptyRestServerConfig,
    EmptyWsServerConfig,
    GrpcServerConfig,
    Resource,
    RestServerConfig,
    WsServerConfig
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


interface ServerTypesConfig {
    isRestServer?: boolean;
    restServerConfig?: RestServerConfig;
    isGrpcServer?: boolean;
    grpcServerConfig?: GrpcServerConfig;
    isWsServer?: boolean;
    wsServerConfig?: WsServerConfig;
}

const getServerTypesConfig = (parsedModifiedState, nodeId): ServerTypesConfig => {
    const restServerConfig: RestServerConfig = parsedModifiedState.nodes[nodeId]?.consumerData.restServerConfig;
    const grpcServerConfig: GrpcServerConfig = parsedModifiedState.nodes[nodeId]?.consumerData.grpcServerConfig;
    const wsServerConfig: WsServerConfig = parsedModifiedState.nodes[nodeId]?.consumerData.wsServerConfig;
    const serverTypesConfig: ServerTypesConfig = {};
    if (restServerConfig && Object.keys(restServerConfig).length > 0) {
        serverTypesConfig.isRestServer = true;
        serverTypesConfig.restServerConfig = {
            framework: restServerConfig.framework,
            sqlDb: restServerConfig.sqlDb,
            openApiFileYamlContent: restServerConfig.openApiFileYamlContent,
            port: restServerConfig.port,
            resources: restServerConfig.resources,
            template: restServerConfig.template
        };
    }
    if (grpcServerConfig && Object.keys(grpcServerConfig).length > 0) {
        serverTypesConfig.isGrpcServer = true;
        serverTypesConfig.grpcServerConfig = {
            framework: grpcServerConfig.framework,
            template: grpcServerConfig.template,
            sqlDb: grpcServerConfig.sqlDb,
            port: grpcServerConfig.port,
            protoFileContent: grpcServerConfig.protoFileContent,
            resources: grpcServerConfig.resources
        };
    }
    if (wsServerConfig && Object.keys(wsServerConfig).length > 0) {
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
    const [payload, setPayload] = React.useState({
        name: {
            value: parsedModifiedState.nodes[props.nodeId]?.consumerData.name !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.name : '',
            error: false,
            errorMessage: ''
        },
        language: parsedModifiedState.nodes[props.nodeId]?.consumerData.language !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.language : '',
        isRestServer: serverTypesConfig.isRestServer || false,
        restServerConfig: serverTypesConfig.restServerConfig || EmptyRestServerConfig,
        isGrpcServer: serverTypesConfig.isGrpcServer || false,
        grpcServerConfig: serverTypesConfig.grpcServerConfig || EmptyGrpcServerConfig,
        isWsServer: serverTypesConfig.isWsServer || false,
        wsServerConfig: serverTypesConfig.wsServerConfig || EmptyWsServerConfig,
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
            let restServerConfig: RestServerConfig;
            let grpcServerConfig: GrpcServerConfig;
            let wsServerConfig: WsServerConfig;

            if (payload.isRestServer) {
                restServerConfig = {
                    sqlDb: payload.restServerConfig.sqlDb,
                    framework: payload.restServerConfig.framework,
                    port: getPort(payload.restServerConfig.template, payload.restServerConfig.port),
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
                    template: payload.grpcServerConfig.template,
                    sqlDb: payload.grpcServerConfig.sqlDb,
                    framework: payload.grpcServerConfig.framework,
                    port: payload.grpcServerConfig.port,
                };
                if (isCompageTemplate(payload.grpcServerConfig.template)) {
                    grpcServerConfig.resources = payload.grpcServerConfig.resources;
                }
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
                        name: payload.name.value,
                        language: payload.language,
                        restServerConfig,
                        grpcServerConfig,
                        wsServerConfig,
                    }
                };
            } else {
                // adding consumerData to existing node in modifiedState
                modifiedState.nodes[props.nodeId].consumerData = {
                    name: payload.name.value,
                    language: payload.language,
                    restServerConfig,
                    grpcServerConfig,
                    wsServerConfig,
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
                grpcServerConfig: EmptyGrpcServerConfig,
                restServerConfig: EmptyRestServerConfig,
                wsServerConfig: EmptyWsServerConfig,
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
        const restServerConfig: RestServerConfig = payload.restServerConfig;
        restServerConfig.template = event.target.value;
        setPayload({
            ...payload,
            restServerConfig
        });
    };


    const handleGrpcTemplateChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const grpcServerConfig: GrpcServerConfig = payload.grpcServerConfig;
        grpcServerConfig.template = event.target.value;
        setPayload({
            ...payload,
            grpcServerConfig
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
        if (payload.restServerConfig.resources?.length > 0) {
            return <>
                <br/>
                Existing resources :
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
                                payload.restServerConfig.resources.map((resource, index) => (
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
                value={payload.restServerConfig.template}
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
        if (isCompageTemplate(payload.restServerConfig.template)) {
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
                value={payload.restServerConfig.sqlDb}
                onChange={handleRestServerConfigSqlDbChange}
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
        if (isCompageTemplate(payload.restServerConfig.template)) {
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
                value={payload.restServerConfig.framework}
                onChange={handleRestServerConfigFrameworkChange}
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
        return '';
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
        if (payload.grpcServerConfig.resources?.length > 0) {
            return <>
                <br/>
                Existing resources :
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
                                payload.grpcServerConfig.resources.map((resource, index) => (
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
                value={payload.grpcServerConfig.template}
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
        if (isCompageTemplate(payload.grpcServerConfig.template)) {
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
                value={payload.grpcServerConfig.sqlDb}
                onChange={handleGrpcServerConfigSqlDbChange}
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
        if (isCompageTemplate(payload.grpcServerConfig.template)) {
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
                value={payload.grpcServerConfig.framework}
                onChange={handleGrpcServerConfigFrameworkChange}
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
        if (isCompageTemplate(payload.grpcServerConfig.template)) {
            return <TextField
                required
                size="medium"
                margin="dense"
                id="grpcServerConfigPort"
                label="Port"
                type="number"
                value={payload.grpcServerConfig.port}
                onChange={handleGrpcServerConfigPortChange}
                variant="outlined"
            />;
        }
        return '';
    };

    const getGrpcResourcesContent = () => {
        if (isCompageTemplate(payload.grpcServerConfig.template)) {
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

    const handleGrpcServerConfigSqlDbChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const grpcServerConfig: GrpcServerConfig = payload.grpcServerConfig;
        grpcServerConfig.sqlDb = event.target.value;
        setPayload({
            ...payload,
            grpcServerConfig
        });
    };

    const handleGrpcServerConfigFrameworkChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const grpcServerConfig: GrpcServerConfig = payload.grpcServerConfig;
        grpcServerConfig.framework = event.target.value;
        setPayload({
            ...payload,
            grpcServerConfig
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

    const handleGrpcServerConfigPortChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const grpcServerConfig: GrpcServerConfig = payload.grpcServerConfig;
        grpcServerConfig.port = event.target.value;
        setPayload({
            ...payload,
            grpcServerConfig,
        });
    };


    const handleAddOrUpdateGrpcResource = (resource: Resource) => {
        const grpcServerConfig: RestServerConfig = payload.grpcServerConfig;
        // the below check is to identify if the rest resource is added or updated.
        if (payload.isUpdateGrpcResourceOpen) {
            // remove the old resource while updating
            payload.grpcServerConfig.resources = payload.grpcServerConfig.resources.filter(res => res.name !== resource.name);
            grpcServerConfig.resources.push(resource);
            payload.isUpdateGrpcResourceOpen = false;
        } else if (payload.isAddGrpcResourceOpen) {
            payload.isAddGrpcResourceOpen = false;
            grpcServerConfig.resources.push(resource);
        }
        setPayload({
            ...payload,
            grpcServerConfig,
        });
    };

    const handleDeleteGrpcResource = () => {
        const currentGrpcResource = payload.currentGrpcResource;
        payload.grpcServerConfig.resources = payload.grpcServerConfig.resources.filter(resource => resource.name !== currentGrpcResource.name);
        setPayload({
            ...payload,
            grpcServerConfig: payload.grpcServerConfig,
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
        if (payload.grpcServerConfig.resources.length > 0) {
            const resourceNames = [];
            payload.grpcServerConfig.resources.forEach(resource => {
                resourceNames.push(resource.name);
            });
            return resourceNames;
        }
        return [];
    };

    const getRestServerConfig = () => {
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

    const handleRestServerConfigSqlDbChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const restServerConfig: RestServerConfig = payload.restServerConfig;
        restServerConfig.sqlDb = event.target.value;
        setPayload({
            ...payload,
            restServerConfig
        });
    };

    const handleRestServerConfigFrameworkChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const restServerConfig: RestServerConfig = payload.restServerConfig;
        restServerConfig.framework = event.target.value;
        setPayload({
            ...payload,
            restServerConfig
        });
    };

    const handleRestServerConfigPortChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const restServerConfig: RestServerConfig = payload.restServerConfig;
        restServerConfig.port = event.target.value;
        setPayload({
            ...payload,
            restServerConfig
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

    const handleWsServerConfigPortChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const wsServerConfig: WsServerConfig = payload.wsServerConfig;
        wsServerConfig.port = event.target.value;
        setPayload({
            ...payload,
            wsServerConfig
        });
    };

    const handleAddOrUpdateRestResource = (resource: Resource) => {
        const restServerConfig: RestServerConfig = payload.restServerConfig;
        // the below check is to identify if the rest resource is added or updated.
        if (payload.isUpdateRestResourceOpen) {
            // remove the old resource while updating
            payload.restServerConfig.resources = payload.restServerConfig.resources.filter(res => res.name !== resource.name);
            restServerConfig.resources.push(resource);
            payload.isUpdateRestResourceOpen = false;
        } else if (payload.isAddRestResourceOpen) {
            payload.isAddRestResourceOpen = false;
            restServerConfig.resources.push(resource);
        }
        setPayload({
            ...payload,
            restServerConfig,
        });
    };

    const handleDeleteRestResource = () => {
        const currentRestResource = payload.currentRestResource;
        payload.restServerConfig.resources = payload.restServerConfig.resources.filter(resource => resource.name !== currentRestResource.name);
        setPayload({
            ...payload,
            restServerConfig: payload.restServerConfig,
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
        if (payload.restServerConfig.resources.length > 0) {
            const resourceNames = [];
            payload.restServerConfig.resources.forEach(resource => {
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
                            {/*{getWsServerCheck()}*/}
                            {/*{getWsServerConfig()}*/}
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
