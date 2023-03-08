import {Grid} from '@mui/material';
import React from 'react';
import PanToolIcon from '@mui/icons-material/PanTool';
import PhotoSizeSelectSmallIcon from '@mui/icons-material/PhotoSizeSelectSmall';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import EditOffIcon from '@mui/icons-material/EditOff';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FitScreenIcon from '@mui/icons-material/FitScreen';

import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import {DiagramMaker, EditorMode} from "diagram-maker";
import Tooltip from "@mui/material/Tooltip";

interface ToolPanelProps {
    diagramMakerRef: () => DiagramMaker;
}

export const ToolPanel = (props: ToolPanelProps) => {
    return <div className="tools">
        <Grid container justifyContent="center" sx={{color: 'text.primary'}}>
            <Grid item xs={12}>
                <Tooltip title="Drag Mode" placement="left-start">
                    <PanToolIcon onClick={() => {
                        props.diagramMakerRef().api.setEditorMode(EditorMode.DRAG);
                    }}/>
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                <Tooltip title="Select Mode" placement="left-start">
                    <PhotoSizeSelectSmallIcon onClick={() => {
                        props.diagramMakerRef().api.setEditorMode(EditorMode.SELECT);
                    }}/>
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                <Tooltip title="Read Only Mode" placement="left-start">
                    <EditOffIcon onClick={() => {
                        props.diagramMakerRef().api.setEditorMode(EditorMode.READ_ONLY);
                    }}/>
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                <Tooltip title="Focus Selected" placement="left-start">
                    <CheckBoxIcon onClick={() => {
                        props.diagramMakerRef().api.focusSelected();
                        // TODO if resetZoom is done, it reduces the panel size in a weird way
                        props.diagramMakerRef().api.fit();
                    }}/>
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                <Tooltip title="Zoom In" placement="left-start">
                    <ZoomInIcon onClick={() => {
                        props.diagramMakerRef().api.zoomIn();
                    }}/>
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                <Tooltip title="Zoom Out" placement="left-start">
                    <ZoomOutIcon onClick={() => {
                        props.diagramMakerRef().api.zoomOut();
                    }}/>
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                <Tooltip title="Reset Zoom" placement="left-start">
                    <SettingsBackupRestoreIcon onClick={() => {
                        props.diagramMakerRef().api.resetZoom();
                        // TODO if resetZoom is done, it reduces the panel size in a weird way
                        props.diagramMakerRef().api.fit();
                    }}/>
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                <Tooltip title="Undo" placement="left-start">
                    <UndoIcon onClick={() => {
                        props.diagramMakerRef().api.undo();
                    }}/>
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                <Tooltip title="Redo" placement="left-start">
                    <RedoIcon onClick={() => {
                        props.diagramMakerRef().api.redo();
                    }}/>
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                <Tooltip title="Fit to screen" placement="left-start">
                    <FitScreenIcon onClick={() => {
                        props.diagramMakerRef().api.fit();
                    }}/>
                </Tooltip>
            </Grid>
        </Grid>
    </div>;
};