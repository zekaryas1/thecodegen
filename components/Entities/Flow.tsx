import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  useEdgesState,
  useNodesState,
  MiniMap,
  Controls,
  Background,
  Panel,
  useReactFlow,
} from "reactflow";

import "reactflow/dist/style.css";
import FlowSchemaUI from "./FlowSchemaUI";
import { Entity } from "../../lib/models/Entity";
import { Button } from "primereact/button";
import { Options } from "react-markdown";

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
  [name: string]: any;
}

interface FlowProps {
  nodes: NodeType[];
  edges: EdgeType[];
  onEdgeConnection: (params: EdgeType, onSuccess: () => void) => void;
}

const flowKey = "example-flow";

function Flow({
  nodes: initialNodes,
  edges: initialEdges,
  onEdgeConnection,
}: FlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const nodeTypes = useMemo(() => ({ textUpdater: FlowSchemaUI }), []);
  const [rfInstance, setRfInstance] = useState<any>(null);
  const { setViewport } = useReactFlow();

  const reactFlowWrapper = useRef(null);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey) || "null");

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;

        const updatedNodes = nodes.map((node) => {
          const isSaved = flow.nodes.find((it: any) => it.id == node.id);
          if (isSaved) {
            return {
              ...isSaved,
              data: node.data,
            };
          }
          return node;
        });

        setNodes(updatedNodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [nodes, setEdges, setNodes, setViewport]);

  useEffect(() => {
    onRestore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConnect = useCallback(
    (params: any) => {
      return onEdgeConnection(params, () => {
        setEdges((eds) => addEdge(params, eds));
      });
    },
    [onEdgeConnection, setEdges]
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

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
          onInit={setRfInstance}
        >
          <Panel position="top-right">
            <Button
              label="Save"
              className="p-button p-button-sm p-button-outlined mr-3"
              onClick={onSave}
            />
            <Button
              label="Restore"
              className="p-button p-button-sm p-button-outlined"
              onClick={onRestore}
            />
          </Panel>
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </>
  );
}

export default Flow;
