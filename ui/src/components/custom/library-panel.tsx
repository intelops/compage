import React from 'react';
import {PanelNode} from "./panel-node";

interface LibraryPanelProps {
}

export const LibraryPanel = (props: LibraryPanelProps) => {
    return <div style={{
        display: "block",
        margin: "10px 20px 10px 20px",
    }}>
        <PanelNode type="testId-normal" text="Normal"/>
    </div>;
}