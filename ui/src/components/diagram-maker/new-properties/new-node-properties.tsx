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
import MenuItem from "@mui/material/MenuItem";
import {Checkbox, FormControlLabel, Stack} from "@mui/material";
import {JsonStringify} from "../../../utils/json-helper";

interface NewNodePropertiesProps {
    isOpen: boolean,
    nodeId: string,
    onClose: () => void,
}

export const NewNodeProperties = (props: NewNodePropertiesProps) => {
    const parsedModifiedState = getParsedModifiedState();

    const [payload, setPayload] = React.useState({
        name: parsedModifiedState.nodes[props.nodeId]?.consumerData.name !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.name : "",
        type: parsedModifiedState.nodes[props.nodeId]?.consumerData.type !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.type : "",
        language: parsedModifiedState.nodes[props.nodeId]?.consumerData.language !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.language : "",
        isServer: parsedModifiedState.nodes[props.nodeId]?.consumerData.isServer !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.isServer : false,
        isClient: parsedModifiedState.nodes[props.nodeId]?.consumerData.isClient !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.isClient : false,
        // api resources to be generated
        resources: [],
        url: parsedModifiedState?.nodes[props.nodeId]?.consumerData.url !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.url : "",
    });

    // TODO this is a hack as there is no NODE_UPDATE action in diagram-maker. We may later update this impl when we fork diagram-maker repo.
    // update state with additional properties added from UI (Post node creation)
    const handleUpdate = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        const parsedModifiedState = getParsedModifiedState();
        // update modifiedState with current fields on dialog box
        // P.S. - We will have the fields in consumerData which are on dialogBox, so we can assign them directly. We also refer the older values when payload state is initialized, so the older values will be persisted as they are if not changed.
        if (!(props.nodeId in parsedModifiedState.nodes)) {
            // adding consumerData to new node in modifiedState
            parsedModifiedState.nodes[props.nodeId] = {
                consumerData: {
                    type: payload.type,
                    name: payload.name,
                    isServer: payload.isServer,
                    isClient: payload.isClient,
                    language: payload.language,
                    url: payload.url
                }
            }
        } else {
            // adding consumerData to existing node in modifiedState
            parsedModifiedState.nodes[props.nodeId].consumerData = {
                type: payload.type,
                name: payload.name,
                isServer: payload.isServer,
                isClient: payload.isClient,
                language: payload.language,
                url: payload.url
            }
        }
        const nodeElement = document.getElementById(props.nodeId);
        nodeElement.style.backgroundImage = `url('${payload.url}')`;
        // update modifiedState in the localstorage
        setModifiedState(JsonStringify(parsedModifiedState))
        setPayload({
            name: "",
            type: "",
            language: "",
            url: "",
            isClient: false,
            isServer: false,
            resources: []
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

    const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            language: event.target.value
        });
    };

    const handleIsClientChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPayload({
            ...payload,
            isClient: event.target.checked
        });
    };

    const handleIsServerChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPayload({
            ...payload,
            isServer: event.target.checked
        });
    };

    const handleUrlChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            url: event.target.value
        });
    };

    const languages = ["NodeJs", "Java", "Golang"]
    return <React.Fragment>
        <Dialog open={props.isOpen} onClose={props.onClose}>
            <DialogTitle>Node Properties : {props.nodeId}</DialogTitle>
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
                        id="language"
                        label="Language"
                        type="text"
                        value={payload.language}
                        onChange={handleLanguageChange}
                        variant="outlined">
                        <MenuItem value="">
                            <em>Create new</em>
                        </MenuItem>
                        {languages.map((language: string) => (
                            <MenuItem key={language} value={language}>
                                {language}
                            </MenuItem>
                        ))}
                    </TextField>
                    <FormControlLabel
                        label="Is Server?"
                        control={<Checkbox
                            size="medium"
                            checked={payload.isServer}
                            onChange={handleIsServerChange}
                        />}
                    />
                    <FormControlLabel
                        label="Is Client?"
                        control={<Checkbox
                            size="medium"
                            checked={payload.isClient}
                            onChange={handleIsClientChange}
                        />}
                    />
                    <TextField
                        size="medium"
                        margin="dense"
                        id="url"
                        label="Url"
                        type="text"
                        value={payload.url}
                        onChange={handleUrlChange}
                        variant="outlined"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={props.onClose}>Cancel</Button>
                <Button variant="contained"
                        onClick={handleUpdate}
                        disabled={payload.name === "" || payload.type === "" || payload.language === ""}>Update</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
}
