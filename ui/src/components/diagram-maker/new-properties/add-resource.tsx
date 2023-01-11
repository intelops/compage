import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import {Stack} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React, {ChangeEvent} from "react";
import {Resource} from "../models";

interface AddResourceProperties {
    isOpen: boolean;
    onAddResourceClose: () => void;
    handleModifyResourceClick: (resource: Resource) => void;
    resource: Resource
    nodeId: string
}

export const AddResource = (props: AddResourceProperties) => {
    const [data, setData] = React.useState({
        name: props.resource?.name || "",
        fields: props.resource?.fields || new Map<string, string>(),
    });

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            name: event.target.value
        });
    };

    const handleModifyResourceClick = () => {
        const resource: Resource = {fields: data.fields, name: data.name};
        props.handleModifyResourceClick(resource);
    };

    return <React.Fragment>
        <Dialog open={props.isOpen} onClose={props.onAddResourceClose}>
            <DialogTitle>Add resources [REST Server] : {props.nodeId}</DialogTitle>
            <Divider/>
            <DialogContent style={{
                height: "500px",
                width: "450px"
            }}>
                <Stack direction="column" spacing={2}>

                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary"
                        onClick={props.onAddResourceClose}>Cancel</Button>
                <Button variant="contained" onClick={handleModifyResourceClick}>Modify Resource</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
}