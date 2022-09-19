import React from 'react';
import {PanelNode} from "./panel-node";

interface LibraryPanelProps {
}

export const LibraryPanel = (props: LibraryPanelProps) => {
    return <div style={{
        display: "block",
        margin: "10px 20px 10px 20px",
    }}>
        <PanelNode type="testId-centered" text="Round Node"/>
        <PanelNode type="testId-normal" text="Rectangular Node"/>
        <PanelNode type="testId-topBottom" text="Top Bottom Node"/>
        <PanelNode type="testId-start" text="Start Node"/>
        <PanelNode type="testId-end" text="End Node"/>
        <PanelNode type="testId-dead" text="Dead Node"/>
    </div>;
}