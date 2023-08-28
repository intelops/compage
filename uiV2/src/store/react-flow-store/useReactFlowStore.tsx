import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "reactflow";
import { RFState } from "./types";

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useReactFlowStore = create<RFState>()(devtools((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  addNode: (node: Node) => {
    set({
      nodes: get().nodes.concat(node),
    });
  },
  getNodeGivenAnUid: (uid: string) => {
    return get().nodes.find((node) => node.id === uid);
  },
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
})));

export default useReactFlowStore;
