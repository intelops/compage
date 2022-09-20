import React from 'react';
import GridViewIcon from '@mui/icons-material/GridView';
import Chip from '@mui/material/Chip';
import {getConfig} from "../../utils/config";

interface PanelNodeProps {
    typeId: string,
    text: string,
}

export const PanelNode = (props: PanelNodeProps) => {
    let config = getConfig(props.typeId);
    return <React.Fragment>
        <div style={{marginTop: "10px"}}
             data-id={props.typeId}
             data-type="DiagramMaker.PotentialNode"
             data-draggable="true"
             data-event-target="true">

            <Chip icon={<GridViewIcon/>} label={props.text}/>
        </div>
    </React.Fragment>;
}