import { Edge, Node, OnConnect, OnEdgesChange, OnNodesChange } from "reactflow";

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  getNodeGivenAnUid: (uid: string) => Node | undefined;
  deleteNodeGivenAnUid: (uid: string) => void;
};
