import React, {ChangeEvent} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {setModifiedState} from "../../utils/service";
import {getParsedModifiedState} from "../diagram-maker/helper/helper";

interface NewEdgePropertiesProps {
    isOpen: boolean,
    edgeId: string,
    onClose: () => void,
}

export const NewEdgePropertiesComponent = (props: NewEdgePropertiesProps) => {
    let parsedModifiedState = getParsedModifiedState();

    const [payload, setPayload] = React.useState({
        componentType: parsedModifiedState?.edges[props.edgeId]?.consumerData["componentType"],
    });

    // TODO this is a hack as there is no EDGE_UPDATE action in diagram-maker. We may later update this impl when we fork diagram-maker repo.
    // update state with additional properties added from UI (Post edge creation)
    const handleSet = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        let parsedModifiedState = getParsedModifiedState();
        // update modifiedState with current fields on dialog box
        if (!(props.edgeId in parsedModifiedState.edges)) {
            parsedModifiedState.edges[props.edgeId] = {
                consumerData: {
                    componentType: payload.componentType + "edges"
                }
            }
        } else {
            parsedModifiedState.edges[props.edgeId].consumerData = {
                componentType: payload.componentType
            }
        }
        // update modifiedState in the localstorage
        setModifiedState(JSON.stringify(parsedModifiedState))
        setPayload({componentType: ""})
        props.onClose()
    }

    const handleComponentTypeChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            componentType: event.target.value
        });
    };

    return <React.Fragment>
        <Dialog open={props.isOpen} onClose={props.onClose}>
            <DialogTitle>Edge properties : {props.edgeId}</DialogTitle>
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
