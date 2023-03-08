import React from 'react';
import {PanelNode} from "./panel-node";

interface LibraryPanelProps {
}

export const LibraryPanel = (props: LibraryPanelProps) => {
    return <div style={{
        display: "block",
        // margin: "10px 20px 10px 20px",
    }}>
        <PanelNode typeId="node-type-circle" text="Round Node"/>
        <PanelNode typeId="node-type-rectangle" text="Rectangular Node"/>
        <PanelNode typeId="node-type-rectangle-top-bottom" text="Top Bottom Node"/>
        <PanelNode typeId="node-type-start-top-bottom" text="Top Bottom Start Node"/>
        <PanelNode typeId="node-type-end-top-bottom" text="Top Bottom End Node"/>
        <PanelNode typeId="node-type-start" text="Start Node"/>
        <PanelNode typeId="node-type-end" text="End Node"/>
        <PanelNode typeId="node-type-dead" text="Dead Node"/>
    </div>;
};