import React from 'react';

interface EdgeBadgeProps {
    id: string
    handleDblClick: any
}


export const EdgeBadge = (props: EdgeBadgeProps) => {
    const id = props.id.substring(0, 10)
    return <React.Fragment>
        <div className="edgeBadge" onDoubleClick={props.handleDblClick}>
            {id}
        </div>
    </React.Fragment>;
}