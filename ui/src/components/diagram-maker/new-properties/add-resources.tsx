import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import {Stack} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import React from "react";
import {Resource} from "../models";
import {AddResource} from "./add-resource";

interface AddResourcesProperties {
    isOpen: boolean;
    nodeId: string;
    onRestServerAddResourcesClose: () => void;
    handleUpdateInAddPropertiesClick: (resources: Resource[]) => void;
    resources: Resource[]
}

export const AddResources = (props: AddResourcesProperties) => {
    const [data, setData] = React.useState({
        resources: [],
        isAddResourceOpen: false,
        currentResource: {
            name: "",
            fields: new Map<string, string>()
        }
    });


    const handleAddNewResourceClick = () => {
        setData({...data, isAddResourceOpen: true})
    };

    const onAddResourceClose = () => {
        console.log("onAddResourceClose");
        setData({...data, isAddResourceOpen: !data.isAddResourceOpen})
    };

    const handleModifyResourceClick = (resource: Resource) => {
        console.log("handleModifyResourceClick", JSON.stringify(resource));
        data.resources?.push(resource);
        setData({...data, isAddResourceOpen: !data.isAddResourceOpen})
    };

    const handleUpdateResourcesClick = () => {
        const resource: Resource = {fields: {}, name: "dummy"}
        props.handleUpdateInAddPropertiesClick([resource]);
    };

    return <React.Fragment>
        <AddResource isOpen={data.isAddResourceOpen}
                     onAddResourceClose={onAddResourceClose}
                     handleModifyResourceClick={handleModifyResourceClick}
                     resource={data.currentResource}
                     nodeId={props.nodeId}
        ></AddResource>
        <Dialog open={props.isOpen} onClose={props.onRestServerAddResourcesClose}>
            <DialogTitle>Add resources [REST Server] : {props.nodeId}</DialogTitle>
            <Divider/>
            <DialogContent style={{
                height: "500px",
                width: "450px"
            }}>
                <Stack direction="column" spacing={2}>
                    <Button variant="contained" onClick={handleAddNewResourceClick}>Add a resource</Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary"
                        onClick={props.onRestServerAddResourcesClose}>Cancel</Button>
                <Button variant="contained" onClick={handleUpdateResourcesClick}>Save Resources</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
}