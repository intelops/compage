import React from 'react';

interface PotentialNodeProps {
    id: string
}

export const PotentialNode = (props: PotentialNodeProps) => {
    return <React.Fragment>
        <div style={{border: "1px solid red"}} className="rectangle, example-node">
            {props.id}
        </div>
    </React.Fragment>;
}