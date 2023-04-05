import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import {
    FormControl,
    InputLabel,
    ListSubheader,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React, {ChangeEvent} from "react";
import {Resource} from "../models";
import TextField from "@mui/material/TextField";
import {sanitizeString} from "../../../utils/backend-api";
import {BOOL, COMPLEX, FLOAT, goDataTypes, INT, STRING, STRUCT} from "./go-rest-resource";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from "@mui/icons-material/Edit";

interface AddOrUpdateRestResourceProperties {
    isOpen: boolean;
    onAddOrUpdateRestResourceClose: () => void;
    handleAddOrUpdateRestResource: (resource: Resource) => void;
    resource: Resource;
    resourceNames: string[];
    nodeId: string;
}

const getCustomStructs = (resourceNames: string[]) => {
    if (resourceNames.length > 0) {
        const structDataTypes = {
            [STRUCT]: resourceNames
        };
        return structDataTypes[STRUCT].map((type: string) => <MenuItem key={type}
                                                                       value={type}> {type} </MenuItem>);
    }
    return undefined;
};

export const dataTypesParser = (datatype: string) => {
    switch (datatype) {
        case INT:
            return goDataTypes[INT].map((type: string) => <MenuItem key={type} value={type}> {type} </MenuItem>);
        case FLOAT:
            return goDataTypes[FLOAT].map((type: string) => <MenuItem key={type} value={type}> {type} </MenuItem>);
        case COMPLEX:
            return goDataTypes[COMPLEX].map((type: string) => <MenuItem key={type} value={type}> {type} </MenuItem>);
        case BOOL:
            return goDataTypes[BOOL].map((type: string) => <MenuItem key={type} value={type}> {type} </MenuItem>);
        case STRING:
            return goDataTypes[STRING].map((type: string) => <MenuItem key={type} value={type}> {type} </MenuItem>);
        default:
            break;
    }
};

const isEmpty = (value: string) => {
    return value === "";
};

const getFieldsCollection = (resource: Resource) => {
    const fieldsCollection = [];
    if (resource.fields && Object.keys(resource.fields).length > 0) {
        // tslint:disable-next-line: forin
        for (const key in resource.fields) {
            if (resource.fields.hasOwnProperty(key)) {
                fieldsCollection.push({attribute: key, datatype: resource.fields[key]});
            }
        }
    }
    return fieldsCollection;
};

export const AddOrUpdateRestResource = (props: AddOrUpdateRestResourceProperties) => {
    const [payload, setPayload] = React.useState({
        name: props.resource.name,
        fields: JSON.stringify(props.resource?.fields) || "",
        fieldsCollection: getFieldsCollection(props.resource),
    });

    // individual states for Attribute Name and Data Type
    const [field, setField] = React.useState({
        attribute: "",
        datatype: "",
        mode: {
            index: 0,
            edit: false
        }
    });

    // Styles for select field in MUI
    const ITEM_HEIGHT = 45;
    const ITEM_PADDING_TOP = 4;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 120,
            },
        },
    };

    const isEmptyField = () => {
        if (payload.fieldsCollection.length <= 0) {
            return true;
        }
        // this below means there are more than 1 fields and that means field is not empty.
        if (payload.fieldsCollection.length > 1) {
            return false;
        }
        if (payload.fieldsCollection.length === 1) {
            return isEmpty(payload.fieldsCollection[0].datatype) || isEmpty(payload.fieldsCollection[0].attribute);
        }
        return false;
    };

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const sanitizeName = sanitizeString(capitalizeFirstLetter(event.target.value));
        if (props.resourceNames.includes(sanitizeName)) {
            console.log("duplicateName");
        }
        setPayload({
            ...payload,
            name: sanitizeName
        });
    };

    const handleDatatypeChange = (event: SelectChangeEvent) => {
        setField({
            ...field,
            datatype: event.target.value as string
        });
    };

    const handleAttributeChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setField({
            ...field,
            attribute: event.target.value
        });
    };

    const handleAddField = () => {
        if (field.attribute && field.datatype) {
            if (field.mode.edit) {
                payload.fieldsCollection.splice(field.mode.index, 1);
            }
            payload.fieldsCollection.push({attribute: field.attribute, datatype: field.datatype});
            setPayload({...payload});
            setField({attribute: "", datatype: "", mode: {edit: false, index: 0}});
        }
    };

    const handleEditField = (index: number) => {
        console.log(payload.fieldsCollection[index]);
        setField({
            attribute: payload.fieldsCollection[index].attribute,
            datatype: payload.fieldsCollection[index].datatype,
            // set the index and mode as true
            mode: {edit: true, index}
        });
    };

    const handleRemoveField = (index: number) => {
        if (payload.fieldsCollection.length > 1) {
            if (index <= payload.fieldsCollection.length) {
                payload.fieldsCollection.splice(index, 1);
                const fieldsCollection = payload.fieldsCollection;
                setPayload({...payload, fieldsCollection});
            }
        } else if (payload.fieldsCollection.length > 0) {
            const fieldsCollection = [];
            setPayload({...payload, fieldsCollection});
        }
    };

    const isAddButtonDisabled = () => {
        return isEmpty(field.attribute) || isEmpty(field.datatype);
    };

    // first letter of the Resource should always be capital.
    const capitalizeFirstLetter = (input: string) => {
        return input.charAt(0).toUpperCase() + input.slice(1);
    };

    const addOrUpdateRestResource = () => {
        const fields = {};
        for (const fld of payload.fieldsCollection) {
            fields[fld.attribute] = fld.datatype;
        }
        const resource: Resource = {fields: JSON.parse(JSON.stringify(fields)), name: payload.name};
        props.handleAddOrUpdateRestResource(resource);
        setPayload({
            ...payload,
            fields: "",
            name: "",
            fieldsCollection: []
        });
        setField({datatype: "", attribute: "", mode: {edit: false, index: 0}});
    };

    const onAddOrUpdateRestResourceClose = (e: any, reason: "backdropClick" | "escapeKeyDown") => {
        // this prevents dialog box from closing.
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
        }
        props.onAddOrUpdateRestResourceClose();
    };

    return <React.Fragment>
        <Dialog open={props.isOpen} onClose={onAddOrUpdateRestResourceClose}>
            <DialogTitle>Add or update [REST Server] resource : {props.nodeId}</DialogTitle>
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
                        label="Name"
                        type="text"
                        value={payload.name}
                        onChange={handleNameChange}
                        variant="outlined"
                    />
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <TextField
                            required
                            size="medium"
                            margin="dense"
                            id="attribute"
                            label="Attribute"
                            type="text"
                            value={field.attribute}
                            onChange={handleAttributeChange}
                            variant="outlined"
                        />
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="datatype-select-input">Data Type</InputLabel>
                            <Select
                                labelId="datatype-select-input"
                                id="grouped-select"
                                label="Data Type"
                                defaultValue=""
                                value={field.datatype}
                                onChange={(e) => {
                                    handleDatatypeChange(e);
                                }}
                                MenuProps={MenuProps}
                            >
                                <ListSubheader color="primary">INT</ListSubheader>
                                {
                                    dataTypesParser(INT)
                                }
                                <Divider/>
                                <ListSubheader color="primary">FLOAT</ListSubheader>
                                {
                                    dataTypesParser(FLOAT)
                                }
                                <Divider/>
                                <ListSubheader color="primary">COMPLEX</ListSubheader>
                                {
                                    dataTypesParser(COMPLEX)
                                }
                                <Divider/>
                                <ListSubheader color="primary">BOOL</ListSubheader>
                                {
                                    dataTypesParser(BOOL)
                                }
                                <Divider/>
                                <ListSubheader color="primary">STRING</ListSubheader>
                                {
                                    dataTypesParser(STRING)
                                }
                                <Divider/>
                                <ListSubheader color="primary">STRUCT</ListSubheader>
                                {getCustomStructs(props.resourceNames)}
                            </Select>
                        </FormControl>
                        <Stack direction="row">
                            <Button onClick={() => handleAddField()}
                                    disabled={isAddButtonDisabled()}>
                                <AddIcon/>
                            </Button>
                        </Stack>
                    </Stack>
                    <hr/>
                    <br/>
                    Existing Fields:
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 450}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Attribute</TableCell>
                                    <TableCell align="center">Datatype</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    payload.fieldsCollection.map((fld, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell scope="row">
                                                {fld.attribute}
                                            </TableCell>
                                            <TableCell align="center">{fld.datatype}</TableCell>
                                            <TableCell align="left">
                                                <Stack direction="row-reverse" spacing={1}>
                                                    <Button variant="contained"
                                                            color="error"
                                                            onClick={() => handleRemoveField(index)}>
                                                        <RemoveIcon/>
                                                    </Button>
                                                    <Button variant="outlined" onClick={() => handleEditField(index)}>
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
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary"
                        onClick={props.onAddOrUpdateRestResourceClose}>Cancel</Button>
                <Button variant="contained"
                        disabled={isEmpty(payload.name) || isEmptyField()}
                        onClick={addOrUpdateRestResource}>
                    {
                        props.resource.name ? <>Update Resource</> : <>Add Resource</>
                    }
                </Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
};