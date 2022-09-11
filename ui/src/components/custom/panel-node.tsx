import React from 'react';

interface PanelNodeProps {
    type: string,
    text: string,
    width: string,
    height: string
}

export const PanelNode = (props: PanelNodeProps) => {
    return <React.Fragment>
        <div style={{border: "1px solid red", width: props.width, height: props.height}}>{props.text}</div>
    </React.Fragment>;
}