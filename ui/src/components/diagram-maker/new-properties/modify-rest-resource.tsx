import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import { FormControl, InputLabel, ListSubheader, MenuItem, Select, Stack} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React, {ChangeEvent} from "react";
import {Resource} from "../models";
import TextField from "@mui/material/TextField";
import {sanitizeString} from "../../../utils/backend-api";
import { goDataTypes } from "../../../utils/constants";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface ModifyRestResourceProperties {
    isOpen: boolean;
    onModifyRestResourceClose: () => void;
    handleModifyRestResourceClick: (resource: Resource) => void;
    resource: Resource;
    nodeId: string;
}

const dataTypesParser = (datatype:string)=>{
    switch (datatype) {
        case "int":
            return goDataTypes["int"].map((type:string) => <MenuItem key={type} value={type} >{type}</MenuItem>)
        case "float":
            return goDataTypes["float"].map((type:string) => <MenuItem key={type} value={type} >{type}</MenuItem>)
        case "complex":
            return goDataTypes["complex"].map((type:string) => <MenuItem key={type} value={type} >{type}</MenuItem>)
        case "bool":
            return goDataTypes["bool"].map((type:string) => <MenuItem key={type} value={type} >{type}</MenuItem>)
        case "string":
            return goDataTypes["string"].map((type:string) => <MenuItem key={type} value={type} >{type}</MenuItem>)
        default:
            break;
    }
}

export const ModifyRestResource = (props: ModifyRestResourceProperties) => {
    const [data, setData] = React.useState({
        name: props.resource?.name || "",
        fields: JSON.stringify(props.resource?.fields) || "",
    });

    // individual states for Attribute Name and Data Type
    const [field, setField] = React.useState({
        attribute : "", 
        datatype:""
    })

    //attribute validation
    const [attributeStatus, setAttributeStatus] = React.useState([{attribute:false}])

    // Dynamic Collection for adding select fields
    const [fieldCollection, setFieldCollection] = React.useState([{attribute: "", datatype: ""}])

    // attributes of fields
    let attributes = fieldCollection.map((field:any)=> field.attribute).filter((value)=>value !== "")
    
    const attributeValidation = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement> , index:number)=>{
        let value = ""
        value = value + event.target.value;
        if(attributes.includes(value)){
            attributeStatus[index].attribute = true
        }
        else{
            attributeStatus[index].attribute = false
        }
        setField({...field,attribute:event.target.value})
        
    }
    
    // first letter of the Resource should always be capital.
    const capitalizeFirstLetter = (input: string) => {
        return input.charAt(0).toUpperCase() + input.slice(1);
    };

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            name: sanitizeString(capitalizeFirstLetter(event.target.value))
        });
    };

    const handleFieldsChange = () => {
        let fieldsToJson = {};
        if(field.attribute === "" || field.datatype === ""){
            for (var i = 0; i < fieldCollection.length - 1; i++) {
                fieldsToJson[fieldCollection[i].attribute] = fieldCollection[i].datatype;
              }
        }
        else{
            fieldCollection.filter((value)=> value.attribute !== "" && value.datatype !== "").forEach((value:any)=>fieldsToJson[value.attribute] = value.datatype)
            if(field.attribute !== "" || field.datatype !== ""){
                let temp = {}
                temp[field.attribute] = field.datatype
                fieldsToJson = {
                    ...fieldsToJson,
                    ...temp
                }
            }
        }
        return fieldsToJson;
    };

    const handleModifyRestResourceClick = () => {
        let fieldsToJson = handleFieldsChange()
        data.fields = JSON.stringify(fieldsToJson)
        const resource: Resource = {fields: JSON.parse(data.fields), name: data.name};
        props.handleModifyRestResourceClick(resource);
        setData({
            ...data,
            fields: "",
            name: ""
        });
        setFieldCollection([{attribute: "", datatype: ""}])
    };

    const onClose = (e: any, reason: "backdropClick" | "escapeKeyDown") => {
        // this prevents dialog box from closing.
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
        }
        props.onModifyRestResourceClose();
    };


    const handleAddField = (index:number)=>{
        if(field.attribute && field.datatype && attributeStatus[index].attribute === false){
            fieldCollection[index].attribute = field.attribute
            fieldCollection[index].datatype = field.datatype
            setField({attribute:"",datatype:""})
            setFieldCollection([...fieldCollection,{attribute:"",datatype:""}])
            setAttributeStatus([...attributeStatus, {attribute:false} ])
        }
    }

    const handleRemoveField = (index:number)=>{
        if(fieldCollection.length > 1){
            setFieldCollection([...fieldCollection.slice(0, index),...fieldCollection.slice(index+1)])
        }
    }

    const addButtonStatus = (index:number)=>{
        if(field.attribute === "" && field.datatype === "" && fieldCollection[index].attribute === "" && fieldCollection[index].datatype === "" && attributeStatus[index].attribute ){
            return true
        }
        if(fieldCollection[index].attribute !== "" && fieldCollection[index].datatype !== "" || attributeStatus[index].attribute){
            return true
        }
        if((field.attribute === "" && field.datatype === "") || (field.attribute === "" && field.datatype !== "") || (field.attribute !== "" && field.datatype === "")){
            return true
        }
        if(field.attribute !== "" || field.datatype !== "" ){
            return false
        }
    }

    const removeButtonStatus = (index:number)=>{
        if((fieldCollection.length > 1) && fieldCollection[index].attribute !== "" && fieldCollection[index].datatype !== ""){
            return false
        }
        return true
    }

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
    
    return <React.Fragment>
        <Dialog open={props.isOpen} onClose={onClose}>
            <DialogTitle>Modify [REST Server] resource : {props.nodeId}</DialogTitle>
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
                        value={data.name}
                        onChange={handleNameChange}
                        variant="outlined"
                    />
                    <Stack direction="column" spacing={1}>
                        {
                            fieldCollection.map((fieldType, index)=>{
                                return (
                                    <Stack key={index} direction="row" alignItems="center" spacing={1}>
                                        <TextField
                                            required
                                            size="medium"
                                            margin="dense"
                                            id="attribute"
                                            label="Attribute"
                                            type="text"
                                            error={attributeStatus[index].attribute}
                                            helperText={attributeStatus[index].attribute ? "Attribute already exists!" : null}
                                            value={fieldType.attribute === "" ? field.attribute : fieldType.attribute }
                                            onChange={(e)=>attributeValidation(e, index)}
                                            variant="outlined"
                                        />
                                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                                            <InputLabel id="field-select-input">Data Type</InputLabel>
                                            <Select
                                                labelId="field-select-input"
                                                defaultValue=""
                                                onChange={(e)=>{
                                                    setField({
                                                        ...field,
                                                        datatype:e.target.value
                                                    })
                                                }}
                                                id="grouped-select"
                                                label="Data Type"
                                                MenuProps={MenuProps}
                                            >
                                                <ListSubheader>int</ListSubheader>
                                                {
                                                    dataTypesParser("int")
                                                }
                                                <ListSubheader>float</ListSubheader>
                                                {
                                                    dataTypesParser("float")
                                                }
                                                <ListSubheader>complex</ListSubheader>
                                                {
                                                    dataTypesParser("complex")
                                                }
                                                <ListSubheader>bool</ListSubheader>
                                                {
                                                    dataTypesParser("bool")
                                                }
                                                <ListSubheader>string</ListSubheader>
                                                {
                                                    dataTypesParser("string")
                                                }
                                            </Select>
                                        </FormControl>
                                        <Stack direction="row">
                                            <Button onClick={()=>handleAddField(index)} disabled={addButtonStatus(index)} >
                                                <AddIcon/>
                                            </Button>
                                            <Button disabled={removeButtonStatus(index)} onClick={()=>handleRemoveField(index)}>
                                                <RemoveIcon/>
                                            </Button>
                                        </Stack>
                                    </Stack>
                                )
                            })
                        }
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={props.onModifyRestResourceClose}>Cancel</Button>
                <Button variant="contained"
                        disabled={data.name === "" || (fieldCollection[0].attribute === "" || fieldCollection[0].attribute === "")}
                        onClick={handleModifyRestResourceClick}>
                    Modify Resource
                </Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
};
