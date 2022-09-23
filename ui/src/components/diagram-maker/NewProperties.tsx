import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export const NewPropertiesComponent = (props: { dialogState: { isOpen: boolean; id: string; type: string }, onClose: () => void, payload: { componentType: string }, onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => void, onClick: (event: React.MouseEvent<HTMLElement>) => void }) => {
    return <React.Fragment>
        <Dialog open={props.dialogState.isOpen} onClose={props.onClose}>
            <DialogTitle>Add more properties for {props.dialogState.type} : {props.dialogState.id}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="componentType"
                    label="Component Type"
                    type="text"
                    value={props.payload.componentType}
                    onChange={props.onChange}
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={props.onClick}>Update</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
}
