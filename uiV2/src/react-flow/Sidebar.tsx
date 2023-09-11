import React from "react";
import { CUSTOM_NODE } from "./types";
import { TMicroServiceNodeData } from "./nodes/microservice/Microservice.node.types";
import "./styles.scss";
import { MdDragHandle } from "react-icons/md";
interface SidebarProps {
  addNode: <T>(type: CUSTOM_NODE, data: T) => void;
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
        padding: "20px",
      }}
    >
      <div
        className="node_item"
        onDragStart={(event) => onDragStart(event, "custom-node")}
        onClick={() =>
          props.addNode<TMicroServiceNodeData>(CUSTOM_NODE.MICROSERVICE_NODE, {
            name: "Microservice",
            description: "Microservice description",
          })}
        draggable
      >
        <span>
          Micro Service Node
        </span>
        <MdDragHandle
          size={20}
        />
      </div>
    </aside>
  );
};
export default Sidebar;
