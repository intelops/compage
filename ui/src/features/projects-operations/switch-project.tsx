import React, {ChangeEvent, useEffect, useState} from 'react';
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import {Checkbox, FormControlLabel, Stack} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {SwitchToExistingProject} from "./switch-to-existing-project";
import {SwitchToNewProject} from "./switch-to-new-project";
import {ListGitPlatformsRequest} from "../git-platforms-operations/model";
import {getCurrentUser} from "../../utils/sessionstorageClient";
import {listGitPlatformsAsync} from "../git-platforms-operations/async-apis/listGitPlatforms";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectListGitPlatformsStatus} from "../git-platforms-operations/slice";


interface SwitchProjectProps {
}

export const SwitchProject = (_switchProjectProps: SwitchProjectProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const listGitPlatformsStatus = useAppSelector(selectListGitPlatformsStatus);

    useEffect(() => {
        const listGitPlatformsRequest: ListGitPlatformsRequest = {
            email: getCurrentUser()
        };
        if (listGitPlatformsStatus !== 'loading') {
            dispatch(listGitPlatformsAsync(listGitPlatformsRequest));
        }
        // eslint-disable-next-line
    }, [dispatch]);

    const [payload, setPayload] = useState({
        isNew: false,
    });

    const handleClose = () => {
        navigate('/home');
    };

    const handleDialogClose = async (_e: any, reason: "backdropClick" | "escapeKeyDown") => {
        // this prevents dialog box from closing.
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
        }
        // TODO hack to reload after getProject is loaded
        await new Promise(r => setTimeout(r, 2000));
        navigate('/home');
    };

    const handleIsNewChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPayload({
            ...payload,
            isNew: event.target.checked
        });
    };

    const getContent = () => {
        if (payload.isNew) {
            return <SwitchToNewProject/>;
        }
        // TODO have toggled this here. When the dialog box is opened, the SwitchToExistingProject is shown (dont know why)
        return <SwitchToExistingProject/>;
    };

    return <React.Fragment>
        <Dialog disableEscapeKeyDown
                open={true}
                onClose={handleDialogClose}>
            <DialogTitle>Switch Project [Create or Choose]</DialogTitle>
            <Divider/>
            <DialogContent>
                <Stack direction="column" spacing={2}>
                    <FormControlLabel
                        label="Create new?"
                        control={<Checkbox
                            size="medium"
                            checked={payload.isNew}
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
