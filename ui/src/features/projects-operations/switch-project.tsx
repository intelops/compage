import React, {ChangeEvent, useState} from 'react';

import {useAppSelector} from '../../redux/hooks';
import Button from "@mui/material/Button";
import {selectAuthData} from "../auth-operations/slice";
import {Navigate, useNavigate} from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import {Checkbox, FormControlLabel, Stack} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {SwitchToExistingProject} from "./switch-to-existing-project";
import {SwitchToNewProject} from "./switch-to-new-project";


interface ArgTypes {
    isOpen: boolean;
    handleClose?: (...args: any) => void;
}

export const SwitchProject = ({isOpen, handleClose}: ArgTypes) => {
    const authData = useAppSelector(selectAuthData);
    const navigate = useNavigate();

    const [data, setData] = useState({
        isNew: false,
        toggle: true,
    });

    if (!authData.login) {
        return <Navigate to="/login"/>;
    }

    const handleDialogClose = async (e: any, reason: "backdropClick" | "escapeKeyDown") => {
        // this prevents dialog box from closing.
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
        }
        if (handleClose) {
            handleClose();
        }
        setData({...data, toggle: false});
        // TODO hack to reload after getProject is loaded
        await new Promise(r => setTimeout(r, 2000));
        navigate('/home');
    };

    const handleIsNewChange = (event: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            isNew: event.target.checked
        });
    };

    const getContent = () => {
        if (data.isNew) {
            return <SwitchToNewProject handleClose={handleClose}/>;
        }
        // TODO have toggled this here. When the dialog box is opened, the SwitchToExistingProject is shown (dont know why)
        return <SwitchToExistingProject handleClose={handleClose}/>;
    };

    return <React.Fragment>
        <Dialog disableEscapeKeyDown
                open={isOpen && data.toggle}
                onClose={handleDialogClose}>
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
    </React.Fragment>;
};
