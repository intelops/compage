import React, {ChangeEvent, useState} from 'react';
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import {Stack} from "@mui/material";
import TextField from "@mui/material/TextField";
import {setCurrentUser} from "../../utils/sessionstorage-client";

interface ArgTypes {
    isOpen: boolean;
    handleClose?: (...args: any) => void;
}

export const Login = ({isOpen, handleClose}: ArgTypes) => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
    });

    const handleEmailChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            email: event.target.value
        });
    };

    const handleDialogClose = async (e: any, reason: "backdropClick" | "escapeKeyDown") => {
        // this prevents dialog box from closing.
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
        }
        if (handleClose) {
            handleClose();
        }
        // TODO hack to reload after getProject is loaded
        await new Promise(r => setTimeout(r, 2000));
        navigate('/home');
    };

    const getEmail = (): React.ReactNode => {
        return <TextField
            required
            fullWidth
            margin="dense"
            id="email"
            label="Email"
            type="text"
            value={data.email}
            onChange={handleEmailChange}
            variant="outlined"
        />;
    };

    const getActionButtons = (): React.ReactNode => {
        return <Button variant="contained"
                       onClick={handleLoginClick}>
            Login
        </Button>;
    };

    const handleLoginClick = () => {
        // TODO change this later - username -> email
        setCurrentUser(data.email);
        if (handleClose) {
            handleClose();
        }
    };

    return <React.Fragment>
        <Dialog disableEscapeKeyDown
                open={isOpen}
                onClose={handleDialogClose}>
            <DialogTitle>Add your email to create projects</DialogTitle>
            <Divider/>
            <DialogContent>
                <Stack direction="column" spacing={2}>
                    {getEmail()}
                    {getActionButtons()}
                </Stack>
            </DialogContent>
        </Dialog>
    </React.Fragment>;
};
