import React from "react";
import { CUSTOM_NODE } from "./types";
interface SidebarProps {
  addNode: (node: CUSTOM_NODE) => void;
}
const Sidebar = (props: SidebarProps) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside
      style={{
        width: "20%",
        backgroundColor: "coral",
      }}
    >
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="dndnode "
        onDragStart={(event) => onDragStart(event, "custom-node")}
        onClick={() => props.addNode(CUSTOM_NODE.MICROSERVICE_NODE)}
        draggable
      >
        Custom Node
      </div>
    </aside>
  );
};
export default Sidebar;
