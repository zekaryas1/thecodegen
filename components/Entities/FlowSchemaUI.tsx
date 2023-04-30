import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import { Entity } from "../../lib/models/Entity";

interface FlowSchemaUIProps {
  data: Entity;
}

function FlowSchemaUI({ data }: FlowSchemaUIProps) {
  const headerBody = () => {
    return <p className="text-primary"> <i className="pi pi-table" /> {data.name}</p>;
  };

  const typeBody = (data: any) => {
    return <p className="font-italic text-xs">{data.type}</p>;
  };

  return (
    <div className="bg-red-100 w-12rem">
      <Handle type="target" position={Position.Top} />
      <DataTable
        value={data.columns}
        header={headerBody}
        stripedRows
        size="small"
        className="p-datatable-gridlines p-datatable-sm"
      >
        <Column field="name" header="name"></Column>
        <Column field="type" header="type" body={typeBody}></Column>
      </DataTable>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
}

export default FlowSchemaUI;
