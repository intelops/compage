import {Grid} from '@mui/material';
import React from 'react';
import PanToolIcon from '@mui/icons-material/PanTool';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import EditOffIcon from '@mui/icons-material/EditOff';
import NatureIcon from '@mui/icons-material/Nature';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';

interface ToolPanelProps {
    text: string,
    width: number,
    height: number
}

export const ToolPanel = (props: ToolPanelProps) => {
    return <React.Fragment>
        <div>{props.text}
            <Grid container sx={{alignItems: "center", color: 'text.primary'}}>
                <Grid item xs={12}>
                    <PanToolIcon/>
                </Grid>
                <Grid item xs={12}>
                    <CenterFocusStrongIcon/>
                </Grid>
                <Grid item xs={12}>
                    <CheckBoxIcon/>
                </Grid>
                <Grid item xs={12}>
                    <EditOffIcon/>
                </Grid>
                <Grid item xs={12}>
                    <NatureIcon/>
                </Grid>
                <Grid item xs={12}>
                    <ZoomInIcon/>
                </Grid>
                <Grid item xs={12}>
                    <ZoomOutIcon/>
                </Grid>
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={12}>
                    <UndoIcon/>
                </Grid>
                <Grid item xs={12}>
                    <RedoIcon/>
                </Grid>
                <Grid item xs={12}>
                    <SettingsBackupRestoreIcon/>
                </Grid>
            </Grid>
        </div>
    </React.Fragment>;
}