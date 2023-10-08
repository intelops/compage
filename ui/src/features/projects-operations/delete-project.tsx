import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {DialogContentText} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React from "react";
import {ProjectDTO} from "./model";

interface DeleteProjectProps {
    isOpen: boolean;
    project: ProjectDTO;
    onDeleteProjectClose: () => void;
    handleDeleteProject: () => void;
}

export const DeleteProject = (deleteProjectProps: DeleteProjectProps) => {
    return <Dialog
        open={deleteProjectProps.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            Delete Project: {deleteProjectProps.project.displayName}?
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure to delete this project?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" color="secondary"
                    onClick={deleteProjectProps.onDeleteProjectClose}>Cancel</Button>
            <Button color="error"
                    variant="contained"
                    onClick={deleteProjectProps.handleDeleteProject} autoFocus>
                Delete
            </Button>
        </DialogActions>
    </Dialog>;
};
