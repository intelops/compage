import React from 'react';
import Draggable from 'react-draggable';

interface PanelNodeProps {
    type: string,
    text: string,
    width: string,
    height: string
}

export const PanelNode = (props: PanelNodeProps) => {
    return <React.Fragment>
        <Draggable>
            <div style={{border: "1px solid red", width: props.width, height: props.height}}>{props.text}</div>
        </Draggable>
    </React.Fragment>;
}