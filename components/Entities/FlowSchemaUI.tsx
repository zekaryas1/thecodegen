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
      <h3 className="mb-2">{data.name}</h3>
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
        style={{ top: 42.5 * index + 60 }}
      />
      <p>
        {column.name} - {column.type}
      </p>
      <Handle
        type="target"
        position={Position.Left}
        id={`${entityName}.${column.name}.t`}
        style={{ top: 42.5 * index + 60 }}
      />
    </>
  );
}
