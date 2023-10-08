import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {DialogContentText} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React from "react";
import {GitPlatformDTO} from "./model";

interface DeleteGitPlatformProps {
    isOpen: boolean;
    gitPlatform: GitPlatformDTO;
    onDeleteGitPlatformClose: () => void;
    handleDeleteGitPlatform: () => void;
}

export const DeleteGitPlatform = (deleteGitPlatformProps: DeleteGitPlatformProps) => {
    return <Dialog
        open={deleteGitPlatformProps.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            Delete GitPlatform: {deleteGitPlatformProps.gitPlatform.name}?
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure to delete this gitPlatform?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" color="secondary"
                    onClick={deleteGitPlatformProps.onDeleteGitPlatformClose}>Cancel</Button>
            <Button color="error"
                    variant="contained"
                    onClick={deleteGitPlatformProps.handleDeleteGitPlatform} autoFocus>
                Delete
            </Button>
        </DialogActions>
    </Dialog>;
};
