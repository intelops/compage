import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import {Stack, TextareaAutosize} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React, {ChangeEvent} from "react";
import {Resource} from "../models";
import TextField from "@mui/material/TextField";
import {isJsonString} from "../helper/utils";
import {sanitizeString} from "../../../utils/backend-api";

interface ModifyRestResourceProperties {
    isOpen: boolean;
    onModifyRestResourceClose: () => void;
    handleModifyRestResourceClick: (resource: Resource) => void;
    resource: Resource;
    nodeId: string;
}

export const ModifyRestResource = (props: ModifyRestResourceProperties) => {
    const [data, setData] = React.useState({
        name: props.resource?.name || "",
        fields: JSON.stringify(props.resource?.fields) || "",
    });

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

    const handleFieldsChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            fields: event.target.value
        });
    };

    const handleModifyRestResourceClick = () => {
        const resource: Resource = {fields: JSON.parse(data.fields), name: data.name};
        props.handleModifyRestResourceClick(resource);
        setData({
            ...data,
            fields: "",
            name: ""
        });
    };

    const onClose = (e: any, reason: "backdropClick" | "escapeKeyDown") => {
        // this prevents dialog box from closing.
        if (reason === "backdropClick") {
            return;
        }
        props.onModifyRestResourceClose();
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
                    <TextareaAutosize
                        aria-label="fields"
                        placeholder="Fields"
                        maxRows={6}
                        minRows={5}
                        required
                        id="fields"
                        value={data.fields}
                        onChange={handleFieldsChange}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={props.onModifyRestResourceClose}>Cancel</Button>
                <Button variant="contained"
                        disabled={data.name === ""
                            || !isJsonString(data.fields)
                            // TODO below is now working
                            || Object.keys(data.fields).length === 0}
                        onClick={handleModifyRestResourceClick}>
                    Modify Resource
                </Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
};