import React from 'react';

interface ContextEdgeProps {
    id: string | undefined,
}

export const ContextEdge = (props: ContextEdgeProps) => {
    if (!props.id) {
        return <React.Fragment/>;
    }
    return <React.Fragment>
        <div className="contextMenu">
            This is the edge {props.id}
        </div>
    </React.Fragment>;
}