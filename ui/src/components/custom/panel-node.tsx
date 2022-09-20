import React from 'react';
import GridViewIcon from '@mui/icons-material/GridView';
import Tooltip from "@mui/material/Tooltip";
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import SwipeRightAltRoundedIcon from '@mui/icons-material/SwipeRightAltRounded';
import SwipeLeftAltIcon from '@mui/icons-material/SwipeLeftAlt';
import SwipeDownAltIcon from '@mui/icons-material/SwipeDownAlt';
import SwipeUpAltIcon from '@mui/icons-material/SwipeUpAlt';
import CircleIcon from '@mui/icons-material/Circle';

interface PanelNodeProps {
    typeId: string,
    text: string,
}

export const PanelNode = (props: PanelNodeProps) => {
    const getIcon = (typeId: string, text: string) => {
        switch (typeId) {
            case "node-type-circle":
                return <SwapHorizRoundedIcon>{text}</SwapHorizRoundedIcon>
            case "node-type-rectangle":
                return <SwapHorizRoundedIcon>{text}</SwapHorizRoundedIcon>
            case "node-type-rectangle-top-bottom":
                return <SwapVertRoundedIcon>{text}</SwapVertRoundedIcon>
            case "node-type-start-top-bottom":
                return <SwipeDownAltIcon>{text}</SwipeDownAltIcon>
            case "node-type-end-top-bottom":
                return <SwipeUpAltIcon>{text}</SwipeUpAltIcon>
            case "node-type-start":
                return <SwipeRightAltRoundedIcon>{text}</SwipeRightAltRoundedIcon>
            case "node-type-end":
                return <SwipeLeftAltIcon>{text}</SwipeLeftAltIcon>
            case "node-type-dead":
                return <CircleIcon>{text}</CircleIcon>
            default:
                return <GridViewIcon>{text}</GridViewIcon>;
        }
    }

    return <React.Fragment>
        <div style={{marginTop: "10px"}}
             data-id={props.typeId}
             data-type="DiagramMaker.PotentialNode"
             data-draggable="true"
             data-event-target="true">
            <Tooltip title={props.text} placement="left-start">
                {getIcon(props.typeId, props.text)}
            </Tooltip>
        </div>
    </React.Fragment>;
}