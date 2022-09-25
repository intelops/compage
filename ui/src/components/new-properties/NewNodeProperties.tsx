import React, {ChangeEvent} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {setModifiedState} from "../../utils/service";
import {getParsedModifiedState} from "../diagram-maker/helper/helper";

interface NewNodePropertiesProps {
    isOpen: boolean,
    nodeId: string,
    onClose: () => void,
}

export const NewNodePropertiesComponent = (props: NewNodePropertiesProps) => {
    let parsedModifiedState = getParsedModifiedState();

    const [payload, setPayload] = React.useState({
        componentType: parsedModifiedState?.nodes[props.nodeId]?.consumerData["componentType"],
        // language: "",
        // isServer: false,
        // isClient: false,
        // // api resources to be generated
        // resources: [],
    });

    // TODO this is a hack as there is no NODE_UPDATE action in diagram-maker. We may later update this impl when we fork diagram-maker repo.
    // update state with additional properties added from UI (Post node creation)
    const handleSet = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        let parsedModifiedState = getParsedModifiedState();
        // update modifiedState with current fields on dialog box
        if (!(props.nodeId in parsedModifiedState.nodes)) {
            parsedModifiedState.nodes[props.nodeId] = {
                consumerData: {
                    componentType: payload.componentType
                }
            }
        } else {
            parsedModifiedState.nodes[props.nodeId].consumerData = {
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
            <DialogTitle>Node Properties : {props.nodeId}</DialogTitle>
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
