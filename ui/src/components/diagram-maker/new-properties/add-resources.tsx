import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import {Stack} from "@mui/material";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React from "react";

export const AddResources = (props: {
    isRestServerAddResourcesOpen: boolean,
    nodeId: string,
    onRestServerAddResourcesClose: () => void,
    handleUpdateInAddPropertiesClick: () => void
}) => {
    return <Dialog open={props.isRestServerAddResourcesOpen} onClose={props.onRestServerAddResourcesClose}>
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
                    label="Name of Component"
                    type="text"
                    value={""}
                    onChange={props.handleUpdateInAddPropertiesClick}
                    variant="outlined"
                />
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" color="secondary" onClick={props.onRestServerAddResourcesClose}>Cancel</Button>
            <Button variant="contained" onClick={props.handleUpdateInAddPropertiesClick}>Save Resources</Button>
        </DialogActions>
    </Dialog>;
}