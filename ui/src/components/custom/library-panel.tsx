import React from 'react';
import {PanelNode} from "./panel-node";

interface LibraryPanelProps {
}

export const LibraryPanel = (props: LibraryPanelProps) => {
    return <div className="library">
        <PanelNode type="testId-normal" text="Normal"/>
    </div>;
}