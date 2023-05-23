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
import { FLOW_KEY } from "../../lib/fixed";
import { EntitiesUtils } from "./EntitiesUtils";

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
      const flow = JSON.parse(localStorage.getItem(FLOW_KEY) || "null");

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;

        const mergedNodes = EntitiesUtils.mergeFlowNodes(nodes, flow);

        setNodes(mergedNodes || []);
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
      localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const syncEdges = useCallback(() => {
    setEdges(initialEdges);
    onSave();
  }, [initialEdges, onSave, setEdges]);

  return (
    <>
      <div
        ref={reactFlowWrapper}
        className="w-full h-full border-1 border-gray-600"
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
              label="Layout"
              title="Save layout to memory"
              icon="pi pi-save"
              className="p-button p-button-sm p-button-outlined mr-3"
              onClick={onSave}
            />
            <Button
              label="Layout"
              title="Restore layout from memory"
              icon="pi pi-refresh"
              className="p-button p-button-sm p-button-outlined mr-3"
              onClick={onRestore}
            />
            <Button
              label="Edges"
              title="Pull latest edge data to layout"
              icon="pi pi-sync"
              className="p-button p-button-sm p-button-outlined p-button-info"
              onClick={syncEdges}
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
