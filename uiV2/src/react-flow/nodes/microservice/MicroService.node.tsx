import {
  Handle,
  NodeProps,
  Position,
  ReactFlowState,
  useStore,
} from "reactflow";

type NodeData = {
  value: number;
};
const sourceStyle = { zIndex: 1 };

// type CustomNode = Node<NodeData>;
const connectionNodeIdSelector = (state: ReactFlowState) =>
  state.connectionNodeId;

function MicroService({ data, id }: NodeProps<NodeData>) {
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;
  return (
    <div className="customNode">
      <div
        className="customNodeBody"
        style={{
          backgroundColor: isTarget ? "#ffcce3" : "#ccd9f6",
          borderStyle: isTarget ? "dashed" : "solid",
        }}
      >
        {!isConnecting && (
          <Handle
            className="customHandle"
            position={Position.Right}
            type="source"
            style={sourceStyle}
          />
        )}

        <Handle
          id={`microservice-${id}-1}`}
          className="customHandle"
          position={Position.Left}
          type="target"
        />

        <div className="customNodeTitle">MicroService</div>
        <div className="customNodeContent">{data.value}</div>
      </div>
    </div>
  );
}
export default MicroService;
