import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import {Stack} from "@mui/material";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React, {ChangeEvent} from "react";
import {Resource} from "../models";

interface AddResourcesProperties {
    isOpen: boolean;
    nodeId: string;
    onRestServerAddResourcesClose: () => void;
    handleUpdateInAddPropertiesClick: (resources: Resource[]) => void;
    resources: Resource[]
}

export const AddResources = (props: AddResourcesProperties) => {
    const [data, setData] = React.useState({
        name: "",
        fields: new Map<string, string>()
    });

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            name: event.target.value
        });
    };

    const handleUpdateInAddPropertiesClick = () => {
        const resource: Resource = {fields: {}, name: data.name}
        props.handleUpdateInAddPropertiesClick([resource]);
    };

    return <Dialog open={props.isOpen} onClose={props.onRestServerAddResourcesClose}>
        <DialogTitle>Add resources [REST Server] : {props.nodeId}</DialogTitle>
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
                    label="Name of Resource"
                    type="text"
                    value={data.name}
                    onChange={handleNameChange}
                    variant="outlined"
                />
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" color="secondary" onClick={props.onRestServerAddResourcesClose}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateInAddPropertiesClick}>Save Resources</Button>
        </DialogActions>
    </Dialog>;
}