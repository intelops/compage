import React from 'react';
import {getModifiedState} from "../../../utils/localstorage-client";

interface EdgeBadgeProps {
    id: string;
    handleDblClick: any;
}


export const EdgeBadge = (props: EdgeBadgeProps) => {
    const id = props.id.substring(0, 10);
    let modifiedState = getModifiedState();
    // add name given by user to this edge.
    const name = JSON.parse(modifiedState)?.edges[id]?.consumerData?.name;
    let displayName;
    if (name) {
        displayName = name;
    } else {
        displayName = id;
    }
    return <React.Fragment>
        <div className="edgeBadge" onDoubleClick={props.handleDblClick}>
            {displayName}
        </div>
    </React.Fragment>;
};