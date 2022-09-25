import React, {ChangeEvent} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {setModifiedState} from "../../utils/service";
import {getParsedModifiedState} from "../diagram-maker/helper/helper";
import Divider from "@mui/material/Divider";
import {Stack} from "@mui/material";

interface NewEdgePropertiesProps {
    isOpen: boolean,
    edgeId: string,
    onClose: () => void,
}

export const NewEdgeProperties = (props: NewEdgePropertiesProps) => {
    let parsedModifiedState = getParsedModifiedState();

    const [payload, setPayload] = React.useState({
        type: parsedModifiedState.nodes[props.edgeId]?.consumerData["type"] !== undefined ? parsedModifiedState.nodes[props.edgeId].consumerData["type"] : "",
    });

    // TODO this is a hack as there is no EDGE_UPDATE action in diagram-maker. We may later update this impl when we fork diagram-maker repo.
    // update state with additional properties added from UI (Post edge creation)
    const handleUpdate = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        let parsedModifiedState = getParsedModifiedState();
        // update modifiedState with current fields on dialog box
        if (!(props.edgeId in parsedModifiedState.edges)) {
            parsedModifiedState.edges[props.edgeId] = {
                consumerData: {
                    type: payload.type + "_edge"
                }
            }
        } else {
            parsedModifiedState.edges[props.edgeId].consumerData = {
                type: payload.type
            }
        }
        // update modifiedState in the localstorage
        setModifiedState(JSON.stringify(parsedModifiedState))
        setPayload({type: ""})
        props.onClose()
    }

    const handleTypeChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            type: event.target.value
        });
    };

    return <React.Fragment>
        <Dialog open={props.isOpen} onClose={props.onClose}>
            <DialogTitle>Edge properties : {props.edgeId}</DialogTitle>
            <Divider/>
            <DialogContent>
                <Stack direction="column" spacing={2}>
                    <TextField
                        required
                        size="medium"
                        margin="dense"
                        id="type"
                        label="Type of Component"
                        type="text"
                        value={payload.type}
                        onChange={handleTypeChange}
                        variant="outlined"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={props.onClose}>Cancel</Button>
                <Button variant="contained"
                        onClick={handleUpdate}
                        disabled={payload.type === ""}>Update</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
}
