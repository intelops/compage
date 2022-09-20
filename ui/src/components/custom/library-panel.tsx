import React from 'react';
import {PanelNode} from "./panel-node";

interface LibraryPanelProps {
}

export const LibraryPanel = (props: LibraryPanelProps) => {
    return <div style={{
        display: "block",
        margin: "10px 20px 10px 20px",
    }}>
        <PanelNode type="node-type-circle" text="Round Node"/>
        <PanelNode type="node-type-rectangle" text="Rectangular Node"/>
        <PanelNode type="node-type-rectangle-top-bottom" text="Top Bottom Node"/>
        <PanelNode type="node-type-start" text="Start Node"/>
        <PanelNode type="node-type-end" text="End Node"/>
        <PanelNode type="node-type-dead" text="Dead Node"/>
    </div>;
}