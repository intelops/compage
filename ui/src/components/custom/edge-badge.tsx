import React from 'react';

interface EdgeBadgeProps {
    id: string
}


export const EdgeBadge = (props: EdgeBadgeProps) => {
    return <React.Fragment>
        <div className="edgeBadge" onDoubleClick={() => {
            // setDialogState({isOpen: true, id: node.id, type: "node", payload: {}})
            alert("Selected : " + props.id)
        }}>
            {props.id}
        </div>
    </React.Fragment>;
}