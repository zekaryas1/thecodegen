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
// const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];
interface NodeType {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Entity;
}

interface FlowProps {
  data: NodeType[];
}

function Flow({ data: initialNodes }: FlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const nodeTypes = useMemo(() => ({ textUpdater: FlowSchemaUI }), []);

  // const { setViewport, zoomIn, zoomOut, fitView } = useReactFlow();
  const reactFlowWrapper = useRef(null);

  const onConnect = useCallback(
    (params: any) => {
      return setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // const handlePanToNode = (nodeId) => {
  //   const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
  //   const nodeBounds = document
  //     .querySelector(`[data-id='${nodeId}']`)
  //     .getBoundingClientRect();
  //   const x =
  //     nodeBounds.left -
  //     reactFlowBounds.left -
  //     reactFlowBounds.width / 2 +
  //     nodeBounds.width / 2;
  //   const y =
  //     nodeBounds.top -
  //     reactFlowBounds.top -
  //     reactFlowBounds.height / 2 +
  //     nodeBounds.height / 2;
  //   fitView([x, y, reactFlowBounds.width, reactFlowBounds.height], false);
  // };

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
          <div className="flex">
            {/* <Button
              label="pan to somewhere"
              style={{
                zIndex: 10,
                position: "absolute",
              }}
              onClick={() =>
                handlePanToNode("9ef2b886-9551-4e38-be4a-9b7cba3abae1")
              }
            /> */}
          </div>
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </>
  );
}

export default Flow;
