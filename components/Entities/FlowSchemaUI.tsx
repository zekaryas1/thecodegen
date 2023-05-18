import { DataTable } from "primereact/datatable";
import { useCallback, useRef } from "react";
import { Handle, Position } from "reactflow";
import { Entity } from "../../lib/models/Entity";
import { Column } from "../../lib/models/Column";

interface FlowSchemaUIProps {
  data: Entity;
}

function FlowSchemaUI({ data }: FlowSchemaUIProps) {
  return (
    <div className="bg-gray-700 p-2 w-12rem">
      <div className="flex justify-content-between align-items-center mb-2 p-2 bg-gray-800">
        <i className="pi pi-circle" style={{ fontSize: "0.7rem" }} />
        <h3>{data.name}</h3>
        <i className="pi pi-arrow-right" style={{ fontSize: "0.7rem" }} />
      </div>

      {data?.columns?.map(function (column: Column, i: number) {
        return (
          <div key={column.id} className="flex bg-gray-500 mb-2 p-2">
            {data.name && (
              <ROW
                key={column.id}
                column={column}
                index={i}
                entityName={data.name}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FlowSchemaUI;

function ROW({
  column,
  index,
  entityName,
}: {
  column: Column;
  index: number;
  entityName: string;
}) {
  const ref = useRef(null);

  return (
    <>
      <Handle
        type="source"
        position={Position.Right}
        id={`${entityName}.${column.name}.s`}
        style={{ top: 42.5 * index + 75 }}
      />
      <p>
        {column.name} - {column.type}
      </p>
      <Handle
        type="target"
        position={Position.Left}
        id={`${entityName}.${column.name}.t`}
        style={{ top: 42.5 * index + 75 }}
      />
    </>
  );
}
