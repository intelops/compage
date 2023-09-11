import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  DefaultEdgeOptions,
  MiniMap,
  Node,
  NodeTypes,
  ReactFlowInstance,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { nanoid } from "nanoid";
import Sidebar from "@/react-flow/Sidebar";
import { useReactFlowStore } from "@/store";
import { CUSTOM_NODE } from "@/react-flow/types";
import MicroService from "@/react-flow/nodes/microservice/MicroService.node";
import CustomConnecter from "@/react-flow/connectors/CustomConnecter";

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
  style: { strokeWidth: 2, stroke: "#8fc3ff" },
  type: "floating",
};

const nodeTypes: NodeTypes = {
  [CUSTOM_NODE.MICROSERVICE_NODE]: MicroService,
};

function Flow() {
  const {
    nodes,
    onNodesChange,
    onEdgesChange,
    edges,
    onConnect,
    addNode: addNodeToStore,
  } = useReactFlowStore();
  const [reactFlowInstance, setReactFlowInstance] = useState<
    ReactFlowInstance | null
  >(null);
  const reactFlowWrapperRef = useRef<HTMLDivElement>(null);

  const addNode = useCallback(
    <T,>(type: CUSTOM_NODE, data: T) => {
      if (!reactFlowInstance) return;
      const position = reactFlowInstance.project({ x: 200, y: 300 }); // Set default position or get it from somewhere

      const newNode: Node<T> = {
        id: nanoid(),
        position,
        type,
        data,
        dragHandle: ".custom-drag-handle",
      };
      addNodeToStore(newNode);
    },
    [reactFlowInstance],
  );

  return (
    <ReactFlowProvider>
      <div
        ref={reactFlowWrapperRef}
        className="reactflow-wrapper"
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
        }}
      >
        <Sidebar
          addNode={addNode}
        />
        <ReactFlow
          onInit={(props: ReactFlowInstance) => setReactFlowInstance(props)}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          // fitView
          // fitViewOptions={fitViewOptions}
          defaultEdgeOptions={defaultEdgeOptions}
          nodeTypes={nodeTypes}
          connectionLineComponent={CustomConnecter}
          connectionLineStyle={{
            strokeWidth: 3,
            stroke: "black",
          }}
          defaultViewport={{
            x: 0,
            y: 0,
            zoom: 1,
          }}
        >
          <Background color="#ccc" variant={BackgroundVariant.Dots} />
          <MiniMap
            nodeColor="#1D88FE"
            zoomable
            pannable
            position="bottom-left"
          />
          <Controls position="top-left" />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

export default Flow;
