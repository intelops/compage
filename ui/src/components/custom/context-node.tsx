import React from 'react';

interface ContextNodeProps {
    id: string | undefined,
}

export const ContextNode = (props: ContextNodeProps) => {
    if (!props.id) {
        return <React.Fragment/>;
    }
    return <React.Fragment>
        <div className="contextMenu">
            This is the node {props.id}
        </div>
    </React.Fragment>;
}