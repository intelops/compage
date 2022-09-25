import React, {ChangeEvent} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {getModifiedState, setModifiedState} from "../../utils/service";

interface NewPropertiesProps {
    dialogState: { isOpen: boolean; id: string; type: string },
    onClose: () => void,
}

export const NewPropertiesComponent = (props: NewPropertiesProps) => {
    // TODO this is a hack as there is no NODE_UPDATE action in diagram-maker. We may later update this impl when we fork diagram-maker repo.
    // update state with additional properties added from UI (Post node creation)
    const handleSet = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        // retrieve current modifiedState
        // logic is to store the dialog-state in localstorage and then refer it in updating state.
        let modifiedState = getModifiedState();
        let parsedModifiedState
        if (modifiedState && modifiedState !== "{}") {
            parsedModifiedState = JSON.parse(modifiedState);
        } else {
            parsedModifiedState = {
                nodes: {},
                edges: {}
            }
        }
        // update modifiedState with current fields on dialog box
        if (props.dialogState.type === "node") {
            if (!(props.dialogState.id in parsedModifiedState.nodes)) {
                parsedModifiedState.nodes[props.dialogState.id] = {
                    consumerData: {
                        componentType: payload.componentType
                    }
                }
            } else {
                parsedModifiedState.nodes[props.dialogState.id].consumerData = {
                    componentType: payload.componentType
                }
            }
        } else if (props.dialogState.type === "edge") {
            if (!(props.dialogState.id in parsedModifiedState.edges)) {
                parsedModifiedState.edges[props.dialogState.id] = {
                    consumerData: {
                        componentType: payload.componentType + "edges"
                    }
                }
            } else {
                parsedModifiedState.edges[props.dialogState.id].consumerData = {
                    componentType: payload.componentType
                }
            }
        }
        // update modifiedState in the localstorage
        setModifiedState(JSON.stringify(parsedModifiedState))
        setPayload({componentType: ""})
        props.onClose()
    }

    const [payload, setPayload] = React.useState({
        componentType: ""
    });

    const handleComponentTypeChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            componentType: event.target.value
        });
    };

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
                    value={payload.componentType}
                    onChange={handleComponentTypeChange}
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={handleSet}>Update</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
}
