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
import MenuItem from "@mui/material/MenuItem";
import {JsonStringify} from "../../../utils/json-helper";

interface NewEdgePropertiesProps {
    isOpen: boolean,
    edgeId: string,
    onClose: () => void,
}

export const NewEdgeProperties = (props: NewEdgePropertiesProps) => {
    const parsedModifiedState = getParsedModifiedState();

    const [payload, setPayload] = React.useState({
        name: parsedModifiedState.edges[props.edgeId]?.consumerData.name !== undefined ? parsedModifiedState.edges[props.edgeId].consumerData.name : "",
        type: parsedModifiedState.edges[props.edgeId]?.consumerData.type !== undefined ? parsedModifiedState.edges[props.edgeId].consumerData.type : "",
        protocol: parsedModifiedState.edges[props.edgeId]?.consumerData.protocol !== undefined ? parsedModifiedState.edges[props.edgeId].consumerData.protocol : "",
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
                    type: payload.type + "_edge",
                    name: payload.name,
                    protocol: payload.protocol
                }
            }
        } else {
            // adding consumerData to existing edge in modifiedState
            parsedModifiedState.edges[props.edgeId].consumerData = {
                type: payload.type + "_edge",
                name: payload.name,
                protocol: payload.protocol
            }
        }
        // update modifiedState in the localstorage
        setModifiedState(JsonStringify(parsedModifiedState))
        setPayload({
            name: "",
            type: "",
            protocol: "",
        })
        props.onClose()
    }

    const handleTypeChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            type: event.target.value
        });
    };

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            name: event.target.value
        });
    };

    const handleProtocolChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            protocol: event.target.value
        });
    };

    const protocols = ["http", "websocket", "grpc"]

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
                        label="Name of Component"
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
                        label="Type of Component"
                        type="text"
                        value={payload.type}
                        onChange={handleTypeChange}
                        variant="outlined"
                    />
                    <TextField
                        required
                        size="medium"
                        select
                        margin="dense"
                        id="protocol"
                        label="Protocol"
                        type="text"
                        value={payload.protocol}
                        onChange={handleProtocolChange}
                        variant="outlined">
                        <MenuItem value="">
                            <em>Create new</em>
                        </MenuItem>
                        {protocols.map((protocol: string) => (
                            <MenuItem key={protocol} value={protocol}>
                                {protocol}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={props.onClose}>Cancel</Button>
                <Button variant="contained"
                        onClick={handleUpdate}
                        disabled={payload.type === "" || payload.name === "" || payload.protocol === ""}>Update</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
}
