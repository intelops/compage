import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {DialogContentText} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React from "react";
import {Resource} from "../models";

interface DeleteGrpcResourceProperties {
    isOpen: boolean;
    resource: Resource;
    onDeleteGrpcResourceClose: () => void;
    handleDeleteGrpcResource: () => void;
}

export const DeleteGrpcResource = (props: DeleteGrpcResourceProperties) => {
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
                    onClick={props.onDeleteGrpcResourceClose}>Cancel</Button>
            <Button color="error"
                    variant="contained"
                    onClick={props.handleDeleteGrpcResource} autoFocus>
                Delete
            </Button>
        </DialogActions>
    </Dialog>;
};
