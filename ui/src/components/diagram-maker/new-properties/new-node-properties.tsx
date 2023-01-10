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
import {Stack} from "@mui/material";
import {isJsonString} from "../helper/utils";

interface NewNodePropertiesProps {
    isOpen: boolean,
    nodeId: string,
    onClose: () => void,
}

export const NewNodeProperties = (props: NewNodePropertiesProps) => {
    const parsedModifiedState = getParsedModifiedState();

    const [payload, setPayload] = React.useState({
        name: parsedModifiedState.nodes[props.nodeId]?.consumerData.name !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.name : "",
        template: parsedModifiedState.nodes[props.nodeId]?.consumerData.template !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.template : "compage",
        language: parsedModifiedState.nodes[props.nodeId]?.consumerData.language !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.language : "",
        serverTypes: parsedModifiedState?.nodes[props.nodeId]?.consumerData.serverTypes !== undefined ? parsedModifiedState.nodes[props.nodeId].consumerData.serverTypes : [],
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
                    template: payload.template,
                    name: payload.name,
                    language: payload.language,
                    serverTypes: payload.serverTypes
                }
            };
        } else {
            // adding consumerData to existing node in modifiedState
            parsedModifiedState.nodes[props.nodeId].consumerData = {
                template: payload.template,
                name: payload.name,
                language: payload.language,
                serverTypes: payload.serverTypes
            };
        }
        // image to node display
        // const nodeElement = document.getElementById(props.nodeId);
        // nodeElement.style.backgroundImage = `url('${payload.url}')`;
        // update modifiedState in the localstorage
        setModifiedState(JSON.stringify(parsedModifiedState));
        setPayload({
            name: "",
            template: "",
            language: "",
            serverTypes: [],
        });
        props.onClose();
    };

    const handleTemplateChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            template: event.target.value
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

    const handleServerTypesChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            serverTypes: event.target.value
        });
    };

    const languages = [/*"NodeJs", "Java", */"Golang"];
    const handleAddPropertiesClick = () => {
        console.log("clicked");
    };
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
                        id="template"
                        label="Template for Component"
                        type="text"
                        disabled
                        value={payload.template}
                        onChange={handleTemplateChange}
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
                        {/*<MenuItem value="">*/}
                        {/*    <em>Create new</em>*/}
                        {/*</MenuItem>*/}
                        {languages.map((language: string) => (
                            <MenuItem key={language} value={language}>
                                {language}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        required
                        size="medium"
                        margin="dense"
                        id="serverTypes"
                        label="Server Types"
                        type="text"
                        error={!isJsonString(payload.serverTypes)}
                        value={payload.serverTypes}
                        onChange={handleServerTypesChange}
                        variant="outlined"
                    />
                    <Button variant="outlined" color="secondary" onClick={handleAddPropertiesClick}>Add
                        Properties</Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={props.onClose}>Cancel</Button>
                <Button variant="contained"
                        onClick={handleUpdate}
                        disabled={!isJsonString(payload.serverTypes) || payload.name === "" || payload.language === ""}>Update</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
};
