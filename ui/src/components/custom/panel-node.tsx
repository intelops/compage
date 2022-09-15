import React from 'react';
import GridViewIcon from '@mui/icons-material/GridView';
import Chip from '@mui/material/Chip';

interface PanelNodeProps {
    type: string,
    text: string,
}

export const PanelNode = (props: PanelNodeProps) => {
    return <React.Fragment>
        <div className="circle, example-node, potential-node"
             data-id={props.type}
             data-type="DiagramMaker.PotentialNode"
             data-draggable="true"
             data-event-target="true">
            <Chip icon={<GridViewIcon/>} label={props.text}/>
        </div>
    </React.Fragment>;
}