import { useCallback, useMemo, useRef } from "react";
import ReactFlow, {
  addEdge,
  useEdgesState,
  useNodesState,
  MiniMap,
  Controls,
  Background,
} from "reactflow";

import "reactflow/dist/style.css";
import FlowSchemaUI from "./FlowSchemaUI";
import { Entity } from "../../lib/models/Entity";

// const initialNodes = [
//   {
//     id: "1",
//     type: "textUpdater",
//     position: { x: 0, y: 0 },
//     data: {
//       name: "User",
//       columns: [
//         {
//           name: "name",
//           type: "String",
//         },
//         {
//           name: "age",
//           type: "Number",
//         },
//       ],
//     },
//   },
// ];
// const initialEdges = [
//   {
//     id: "e1-1",
//     source: "e31511e4-0771-4f9e-b683-e46128b3d992",
//     target: "70b23402-ea01-44c8-8a69-617082cbbc56",
//     sourceHandle: "Users.id.s",
//     targetHandle: "Posts.user_id.t",
//   },
// ];
export interface NodeType {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Entity;
}

export interface EdgeType {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}

interface FlowProps {
  nodes: NodeType[];
  edges: EdgeType[];
}

function Flow({ nodes: initialNodes, edges: initialEdges }: FlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const nodeTypes = useMemo(() => ({ textUpdater: FlowSchemaUI }), []);

  const reactFlowWrapper = useRef(null);

  const onConnect = useCallback(
    (params: any) => {
      return setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  return (
    <>
      <div
        ref={reactFlowWrapper}
        className="w-full h-full border-1 border-gray-50"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          // fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </>
  );
}

export default Flow;
