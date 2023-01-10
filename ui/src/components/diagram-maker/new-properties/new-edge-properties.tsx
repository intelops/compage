import React, {ChangeEvent} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {setModifiedState} from "../../../utils/localstorage-client";
import {getParsedModifiedState} from "../helper/helper";
import Divider from "@mui/material/Divider";
import {Stack} from "@mui/material";
import {isJsonString} from "../helper/utils";

interface NewEdgePropertiesProps {
    isOpen: boolean;
    edgeId: string;
    onClose: () => void;
}

export const NewEdgeProperties = (props: NewEdgePropertiesProps) => {
    const parsedModifiedState = getParsedModifiedState();

    const [payload, setPayload] = React.useState({
        name: parsedModifiedState.edges[props.edgeId]?.consumerData.name !== undefined ? parsedModifiedState.edges[props.edgeId].consumerData.name : "",
        clientTypes: parsedModifiedState.edges[props.edgeId]?.consumerData.clientTypes !== undefined ? parsedModifiedState.edges[props.edgeId].consumerData.clientTypes : [],
    });

    // TODO this is a hack as there is no EDGE_UPDATE action in diagram-maker. We may later update this impl when we fork diagram-maker repo.
    // update state with additional properties added from UI (Post edge creation)
    const handleUpdate = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        const parsedModifiedState = getParsedModifiedState();
        // update modifiedState with current fields on dialog box
        // P.S. - We will have the fields in consumerData which are on dialogBox, so we can assign them directly. We also refer the older values when payload state is initialized, so the older values will be persisted as they are if not changed.
        if (!(props.edgeId in parsedModifiedState.edges)) {
            // adding consumerData to new edge in modifiedState
            parsedModifiedState.edges[props.edgeId] = {
                consumerData: {
                    clientTypes: payload.clientTypes,
                    name: payload.name,
                }
            };
        } else {
            // adding consumerData to existing edge in modifiedState
            parsedModifiedState.edges[props.edgeId].consumerData = {
                type: payload.clientTypes,
                name: payload.name,
            };
        }
        // update modifiedState in the localstorage
        setModifiedState(JSON.stringify(parsedModifiedState));
        setPayload({
            name: "",
            clientTypes: [],
        });
        props.onClose();
    };

    const handleClientTypesChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            clientTypes: event.target.value
        });
    };

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            name: event.target.value
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
                        id="name"
                        label="Name of edge"
                        type="text"
                        value={payload.name}
                        onChange={handleNameChange}
                        variant="outlined"
                    />
                    <TextField
                        required
                        size="medium"
                        margin="dense"
                        id="type"
                        label="Client Types"
                        type="text"
                        error={!isJsonString(payload.clientTypes)}
                        value={payload.clientTypes}
                        onChange={handleClientTypesChange}
                        variant="outlined"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={props.onClose}>Cancel</Button>
                <Button variant="contained"
                        onClick={handleUpdate}
                        disabled={payload.name === "" && !isJsonString(payload.clientTypes)}>Update</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
};
