import React from 'react';

interface EdgeBadgeProps {
    id: string
}


export const EdgeBadge = (props: EdgeBadgeProps) => {
    return <React.Fragment>
        <div className="edgeBadge">
            {props.id}
        </div>
    </React.Fragment>;
}