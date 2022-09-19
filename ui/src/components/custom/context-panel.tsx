import React from 'react';

interface ContextPanelProps {
    id: string | undefined,
}

export const ContextPanel = (props: ContextPanelProps) => {
    if (!props.id) {
        return <React.Fragment/>;
    }
    return <React.Fragment>
        <div className="contextMenu">
            This is the panel {props.id}
        </div>
    </React.Fragment>;
}