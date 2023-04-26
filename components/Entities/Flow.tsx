import React, { useCallback, useMemo } from "react";
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
//   {
//     id: "2",
//     type: "textUpdater",
//     position: { x: 0, y: 100 },
//     data: {
//       name: "Post",
//       columns: [
//         {
//           name: "title",
//           type: "String",
//         },
//         {
//           name: "body",
//           type: "String",
//         },
//       ],
//     },
//   },
// ];
// const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

function Flow({initialNodes}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const nodeTypes = useMemo(() => ({ textUpdater: FlowSchemaUI }), []);

  const onConnect = useCallback(
    (params: any) => {
      return setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  return (
    <div className="w-full h-full border-red-200 border-2">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default Flow;
