import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {DialogContentText} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React from "react";
import {Resource} from "../models";

interface DeleteRestResourceProperties {
    isOpen: boolean;
    resource: Resource;
    onDeleteRestResourceClose: () => void;
    handleDeleteRestResource: () => void;
}

export const DeleteRestResource = (props: DeleteRestResourceProperties) => {
    return <Dialog
        open={props.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            Delete Resource: {props.resource.name}?
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure to delete this resource?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" color="secondary"
                    onClick={props.onDeleteRestResourceClose}>Cancel</Button>
            <Button variant="contained" onClick={props.handleDeleteRestResource} autoFocus>
                Delete
            </Button>
        </DialogActions>
    </Dialog>;
};
