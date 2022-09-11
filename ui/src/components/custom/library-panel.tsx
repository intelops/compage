import React from 'react';
import {PanelNode} from "./panel-node";

interface LibraryPanelProps {
    text: string,
    width: string,
    height: string
}

export const LibraryPanel = (props: LibraryPanelProps) => {
    return <React.Fragment>
            <div style={{border: "1px solid red", width: props.width, height: props.height}}>{props.text}
                <PanelNode type="Circle" text="Normal" width="20" height="20"/>
            </div>
    </React.Fragment>;
}