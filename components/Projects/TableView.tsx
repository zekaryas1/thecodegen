import { TABLE_PROPS } from "../../lib/fixed";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Project } from "../../lib/models/Project";
import TimeAgo from "react-timeago";
import SearchFilter, { useFilters } from "../SearchFilter";
import { Button } from "primereact/button";
import Conditional from "../Conditional";

interface TableViewProps {
  isLoading: boolean;
  loggedInUserEmail: string;
  onOpenClicked: (projectId: string) => void;
  onEditClicked: (project: Project) => void;
  projects: Project[];
}

function TableView({
  isLoading,
  projects,
  loggedInUserEmail,
  onOpenClicked,
  onEditClicked,
}: TableViewProps) {
  const [filters, setFilters] = useFilters();

  const header = (
    <SearchFilter
      title="All Projects"
      subTitle="Projects you're part of"
      filters={filters}
      setFilters={setFilters}
    />
  );

  const nameBody = (rowData: Project) => {
    return <p className="font-bold">{rowData.name}</p>;
  };

  const ownerBody = (rowData: Project) => {
    return (
      <Conditional
        if={loggedInUserEmail === rowData.creatorEmail}
        show={<>You</>}
        else={<>{rowData.creatorEmail}</>}
      />
    );
  };

  const createdAtBody = (rowData: Project) => {
    return (
      <Conditional
        if={rowData.createdAt}
        show={<TimeAgo date={rowData.createdAt!} />}
      />
    );
  };

  const actionBody = (project: Project) => {
    return (
      <Conditional
        if={project.isOwner}
        show={
          <Button
            icon="pi pi-pencil"
            className="p-button-text p-button-sm"
            onClick={() => {
              onEditClicked(project);
            }}
          />
        }
        else={<i className="pi pi-eye" />}
      />
    );
  };

  return (
    <DataTable
      loading={isLoading}
      value={projects}
      onRowClick={(event) => onOpenClicked(event.data.id)}
      header={header}
      filters={filters}
      {...TABLE_PROPS}
    >
      <Column field="name" header="Name" body={nameBody}></Column>
      <Column field="description" header="Description"></Column>
      <Column field="createdAt" header="Created" body={createdAtBody}></Column>
      <Column field="creatorEmail" header="Owner" body={ownerBody}></Column>
      <Column field="action" header="Action" body={actionBody}></Column>
    </DataTable>
  );
}

export default TableView;
