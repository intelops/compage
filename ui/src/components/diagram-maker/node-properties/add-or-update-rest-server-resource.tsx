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
import {sanitizeString} from "../../../utils/backendApi";
import {BOOL, COMPLEX, FLOAT, goDataTypes, INT, STRING, STRUCT} from "./go-resource";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from "@mui/icons-material/Edit";
import AllowedMethodCheckBoxGroup from "./allowed-methods";

interface AddOrUpdateRestServerResourceProperties {
    isOpen: boolean;
    onAddOrUpdateRestServerResourceClose: () => void;
    handleAddOrUpdateRestServerResource: (resource: Resource) => void;
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
    return value === '';
};

const getFieldsCollection = (resource: Resource) => {
    const fieldsCollection = [];
    if (resource.fields && Object.keys(resource.fields).length > 0) {
        // tslint:disable-next-line: forin
        for (const key in resource.fields) {
            if (resource.fields.hasOwnProperty(key)) {
                fieldsCollection.push({
                    attribute: key,
                    datatype: resource.fields[key].datatype,
                    isComposite: resource.fields[key].isComposite || false
                });
            }
        }
    }
    return fieldsCollection;
};

export const AddOrUpdateRestServerResource = (addOrUpdateRestServerResourceProperties: AddOrUpdateRestServerResourceProperties) => {
    const [payload, setPayload] = React.useState({
        name: {
            value: addOrUpdateRestServerResourceProperties.resource.name,
            error: false,
            errorMessage: ''
        },
        allowedMethods: addOrUpdateRestServerResourceProperties.resource?.allowedMethods || [],
        fields: JSON.stringify(addOrUpdateRestServerResourceProperties.resource?.fields) || '',
        fieldsCollection: getFieldsCollection(addOrUpdateRestServerResourceProperties.resource),
    });

    // individual states for Attribute Name and Data Type
    const [field, setField] = React.useState({
        attribute: {
            value: '',
            error: false,
            errorMessage: ''
        },
        datatype: '',
        isComposite: false,
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
        // this below means there is more than one field and that means the field is not empty.
        if (payload.fieldsCollection.length > 1) {
            return false;
        }
        if (payload.fieldsCollection.length === 1) {
            return isEmpty(payload.fieldsCollection[0].datatype) || isEmpty(payload.fieldsCollection[0].attribute);
        }
        return false;
    };

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        const sanitizeName = sanitizeString(capitalizeFirstLetter(value));
        setPayload({
            ...payload,
            [name]: {
                ...payload[name],
                value: sanitizeName,
            }
        });
    };

    const isStruct = (value: string) => {
        return addOrUpdateRestServerResourceProperties.resourceNames.includes(value);
    };

    const handleDatatypeChange = (event: SelectChangeEvent) => {
        setField({
            ...field,
            datatype: event.target.value as string,
            // TODO fix
            isComposite: isStruct(event.target.value as string)
        });
    };

    const handleAttributeChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setField({
            ...field,
            [name]: {
                ...field[name],
                value,
            }
        });
    };

    const handleAddField = () => {
        if (field.attribute && field.datatype && isAttributeValid()) {
            if (field.mode.edit) {
                payload.fieldsCollection.splice(field.mode.index, 1);
            }
            payload.fieldsCollection.push({
                attribute: field.attribute.value,
                datatype: field.datatype,
                isComposite: field.isComposite
            });
            setPayload({...payload});
            setField({
                attribute: {
                    value: '',
                    error: false,
                    errorMessage: ''
                },
                datatype: '',
                isComposite: false,
                mode: {edit: false, index: 0}
            });
        }
    };

    const handleEditField = (index: number) => {
        setField({
            attribute: {
                ...field,
                value: payload.fieldsCollection[index].attribute,
                errorMessage: '',
                error: false
            },
            isComposite: payload.fieldsCollection[index].isComposite,
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
        return isEmpty(field.attribute.value) || isEmpty(field.datatype);
    };

    // the first letter of the Resource should always be capital.
    const capitalizeFirstLetter = (input: string) => {
        return input.charAt(0).toUpperCase() + input.slice(1);
    };

    const isAttributeValid = () => {
        let newField = {...field};
        // check for empty name
        if (field.attribute.value === '') {
            newField = {
                ...newField,
                attribute: {
                    ...newField.attribute,
                    error: true,
                    errorMessage: "You must have a name for field."
                }
            };
            setField(newField);
            return false;
        } else {
            // check for invalid names for fields.
            const regex = new RegExp("^[a-zA-Z_$][a-zA-Z_$0-9]*$");
            if (!regex.test(field.attribute.value)) {
                newField = {
                    ...newField,
                    attribute: {
                        ...newField.attribute,
                        error: true,
                        errorMessage: 'You must have a valid name for field.'
                    }
                };
                setField(newField);
                return false;
            }

            // check for duplicate fields in fieldsCollection.
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < payload.fieldsCollection.length; i++) {
                if (!field.mode.edit && payload.fieldsCollection[i].attribute === field.attribute.value) {
                    newField = {
                        ...newField,
                        attribute: {
                            ...newField.attribute,
                            error: true,
                            errorMessage: 'You must have a unique field in the resource.'
                        }
                    };
                    setField(newField);
                    return false;
                }
            }
        }
        return true;
    };

    const isNameValid = () => {
        let newPayload = {...payload};
        // check for empty name
        if (payload.name.value === '') {
            newPayload = {
                ...newPayload,
                name: {
                    ...newPayload.name,
                    error: true,
                    errorMessage: "You must have a name for resource."
                }
            };
            setPayload(newPayload);
            return false;
        } else {
            // check for duplicate resource name only when name has any value in it.
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < addOrUpdateRestServerResourceProperties.resourceNames.length; i++) {
                if (!addOrUpdateRestServerResourceProperties.resource.name && addOrUpdateRestServerResourceProperties.resourceNames[i] === payload.name.value) {
                    newPayload = {
                        ...newPayload,
                        name: {
                            ...newPayload.name,
                            error: true,
                            errorMessage: 'You must have a unique name for resource.'
                        }
                    };
                    setPayload(newPayload);
                    return false;
                }
            }

            // check for invalid names for fields.
            // removed _ from regex as we don't want users to have names starting with _.
            const regex = new RegExp("^[a-zA-Z$][a-zA-Z$0-9]*$");
            if (!regex.test(payload.name.value)) {
                newPayload = {
                    ...newPayload,
                    name: {
                        ...newPayload.name,
                        error: true,
                        errorMessage: 'You must have a valid name for resource.'
                    }
                };
                setPayload(newPayload);
                return false;
            }
        }
        return true;
    };

    const addOrUpdateRestResource = () => {
        const fields = {};
        for (const fld of payload.fieldsCollection) {
            if (fld.isComposite) {
                fields[fld.attribute] = {datatype: fld.datatype, isComposite: fld.isComposite};
            } else {
                fields[fld.attribute] = {datatype: fld.datatype};
            }
        }

        const resource: Resource = {
            name: payload.name.value,
            allowedMethods: payload.allowedMethods,
            fields: JSON.parse(JSON.stringify(fields))
        };

        if (isNameValid()) {
            addOrUpdateRestServerResourceProperties.handleAddOrUpdateRestServerResource(resource);
            setPayload({
                ...payload,
                fields: '',
                name: {
                    value: '',
                    error: false,
                    errorMessage: ''
                },
                fieldsCollection: []
            });
            setField({
                isComposite: false,
                datatype: '',
                attribute: {
                    value: '',
                    error: false,
                    errorMessage: ''
                },
                mode: {edit: false, index: 0}
            });
        }
    };

    const updateAllowedMethods = (allowedMethods: string[]) => {
        setPayload({...payload, allowedMethods});
    };

    const onAddOrUpdateRestResourceClose = (_: any, reason: "backdropClick" | "escapeKeyDown") => {
        // this prevents the dialog box from closing.
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
        }
        addOrUpdateRestServerResourceProperties.onAddOrUpdateRestServerResourceClose();
    };

    return <React.Fragment>
        <Dialog open={addOrUpdateRestServerResourceProperties.isOpen} onClose={onAddOrUpdateRestResourceClose}>
            <DialogTitle>Add or update [REST Server] resource
                : {addOrUpdateRestServerResourceProperties.nodeId}</DialogTitle>
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
                        name="name"
                        value={payload.name.value}
                        error={payload.name.error}
                        helperText={payload.name.error && payload.name.errorMessage}
                        onChange={handleNameChange}
                        variant="outlined"
                    />
                    <AllowedMethodCheckBoxGroup allowedMethods={payload.allowedMethods} updateAllowedMethods={updateAllowedMethods}/>
                    {/*<strong>Selected Methods: </strong> {payload.allowedMethods.join(',')}*/}
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <TextField
                            required
                            size="medium"
                            margin="dense"
                            id="attribute"
                            label="Attribute"
                            type="text"
                            name="attribute"
                            value={field.attribute.value}
                            error={field.attribute.error}
                            helperText={field.attribute.error && field.attribute.errorMessage}
                            onChange={handleAttributeChange}
                            variant="outlined"
                        />
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="datatype-select-input">Data Type</InputLabel>
                            <Select
                                labelId="datatype-select-input"
                                id="grouped-select"
                                label="Data Type"
                                defaultValue=''
                                name="datatype"
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
                                {getCustomStructs(addOrUpdateRestServerResourceProperties.resourceNames)}
                            </Select>
                        </FormControl>
                        <Stack direction="row">
                            <Button onClick={() => handleAddField()}
                                    disabled={isAddButtonDisabled()}>
                                <AddIcon/>
                            </Button>
                        </Stack>
                    </Stack>
                    <br/>
                    <br/>
                    Existing Fields:
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: "450px"}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Attribute</TableCell>
                                    <TableCell align="center">Datatype</TableCell>
                                    <TableCell align="center">Is Composite</TableCell>
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
                                            <TableCell align="center">{fld.isComposite ? "Yes" : "No"}</TableCell>
                                            <TableCell align="left">
                                                <Stack direction="row-reverse" spacing={1}>
                                                    <Button variant="text"
                                                            color="error"
                                                            onClick={() => handleRemoveField(index)}>
                                                        <RemoveIcon/>
                                                    </Button>
                                                    <Button variant="text"
                                                            onClick={() => handleEditField(index)}>
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
                    <span style={{
                        alignSelf: "center"
                    }}>{payload.fieldsCollection.length < 1 ? "No fields" : ''}</span>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary"
                        onClick={addOrUpdateRestServerResourceProperties.onAddOrUpdateRestServerResourceClose}>Cancel</Button>
                <Button variant="contained"
                        disabled={isEmpty(payload.name.value) || isEmptyField()}
                        onClick={addOrUpdateRestResource}>
                    {
                        addOrUpdateRestServerResourceProperties.resource.name ? <>Update Resource</> : <>Add Resource</>
                    }
                </Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
};