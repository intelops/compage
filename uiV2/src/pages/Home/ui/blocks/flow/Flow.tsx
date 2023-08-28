import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  DefaultEdgeOptions,
  MarkerType,
  MiniMap,
  Node,
  NodeTypes,
  ReactFlowInstance,
  ReactFlowProvider,
} from "reactflow";
import MicroService from "../../../../../react-flow/nodes/microservice/MicroService.node";
import "reactflow/dist/style.css";
import CustomConnecter from "../../../../../react-flow/connectors/CustomConnecter";
import { nanoid } from "nanoid";
import { CUSTOM_NODE } from "../../../../../react-flow/types";
import Sidebar from "@/react-flow/Sidebar";
import { useReactFlowStore } from "@/store";

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
  style: { strokeWidth: 3, stroke: "black" },
  type: "floating",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "black",
  },
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
  const addNode = useCallback((type: CUSTOM_NODE) => {
    if (!reactFlowInstance) return;
    const position = reactFlowInstance.project({ x: 200, y: 300 }); // Set default position or get it from somewhere

    const newNode: Node = {
      id: nanoid(),
      position,
      type,
      data: { label: `${type} node` },
    };
    addNodeToStore(newNode);
  }, [reactFlowInstance]);

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
          fitView
          // fitViewOptions={fitViewOptions}
          defaultEdgeOptions={defaultEdgeOptions}
          nodeTypes={nodeTypes}
          connectionLineComponent={CustomConnecter}
          connectionLineStyle={{
            strokeWidth: 3,
            stroke: "black",
          }}
        >
          <Background color="#ccc" variant={BackgroundVariant.Dots} />
          <MiniMap
            nodeColor="#ff0072"
            zoomable
            pannable
          />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

export default Flow;
