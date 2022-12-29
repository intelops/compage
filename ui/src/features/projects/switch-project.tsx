import React, {ChangeEvent, useState} from 'react';

import {useAppSelector} from '../../redux/hooks';
import Button from "@mui/material/Button";
import {selectAuthData} from "../auth/slice";
import {Navigate} from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import {Checkbox, FormControlLabel, Stack} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {SwitchToExistingProject} from "./switch-to-existing-project";
import {SwitchToNewProject} from "./switch-to-new-project";


interface ArgTypes {
    isOpen: boolean
    handleClose: (...args: any) => void;
}

export const SwitchProject = ({isOpen, handleClose}: ArgTypes) => {
    const authData = useAppSelector(selectAuthData);

    const [data, setData] = useState({
        isNew: false,
    });

    if (!authData.login) {
        return <Navigate to="/login"/>;
    }

    const handleIsNewChange = (event: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            isNew: event.target.checked
        });
    };

    const getContent = () => {
        if (data.isNew) {
            return <SwitchToNewProject handleClose={handleClose}/>
        }
        // TODO have toggled this here. When the dialog box is opened, the SwitchToExistingProject is shown (dont know why)
        return <SwitchToExistingProject handleClose={handleClose}/>;
    };

    return <React.Fragment>
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>Switch Project [Create or Choose]</DialogTitle>
            <Divider/>
            <DialogContent>
                <Stack direction="column" spacing={2}>
                    <FormControlLabel
                        label="Create new?"
                        control={<Checkbox
                            size="medium"
                            checked={data.isNew}
                            onChange={handleIsNewChange}
                        />}
                    />
                    {getContent()}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>
}