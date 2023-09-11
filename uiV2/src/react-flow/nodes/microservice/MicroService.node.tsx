import "./MicroService.node.styles.scss";
import {
  Handle,
  NodeProps,
  Position,
  ReactFlowState,
  useStore,
} from "reactflow";
import { TMicroServiceNodeData } from "./Microservice.node.types";
import { useReactFlowStore } from "@/store";
import { ReactComponent as DeleteIcon } from "@/assets/deleteIcon.svg";
import { ReactComponent as DragHandleIcon } from "@/assets/drag-handle.svg";
import MicroServiceNodeForm from "./MicroService.node.form";

const connectionNodeIdSelector = (state: ReactFlowState) =>
  state.connectionNodeId;

function MicroService({ data, id }: NodeProps<TMicroServiceNodeData>) {
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const { deleteNodeGivenAnUid } = useReactFlowStore();
  const isConnecting = !!connectionNodeId;

  return (
    <>
      <div className="custom-drag-handle">
        <DragHandleIcon />
      </div>
      <div className="customNode">
        <div className="customNodeHeader">
          <h1>
            {data.name}
          </h1>

          <DeleteIcon
            className="delete-icon"
            onClick={() => deleteNodeGivenAnUid(id)}
          />
        </div>

        <div className="customNodeBody">
          {!isConnecting && (
            <Handle
              className="customHandle"
              position={Position.Right}
              type="source"
            />
          )}

          <Handle
            id={`microservice-${id}-1}`}
            className="customHandle"
            position={Position.Left}
            type="target"
          />
          <MicroServiceNodeForm
            nodeId={id}
          />
        </div>
      </div>
    </>
  );
}
export default MicroService;
