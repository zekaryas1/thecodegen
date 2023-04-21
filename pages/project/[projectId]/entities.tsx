import { useEffect, useState } from "react";
import useSWR from "swr";
import { Entity, entityToString } from "../../../lib/models/Entity";
import { EntityService } from "../../../lib/services/EntityService";
import { Column } from "../../../lib/models/Column";
import { ColumnService } from "../../../lib/services/ColumnService";
import { useRouter } from "next/router";
import EditColumnsDialog from "../../../components/Entities/EditColumnsDialog";
import ManageEntityDialog from "../../../components/Entities/ManageEntityDialog";
import EntityListComponent from "../../../components/Entities/EntityList";
import { LoadingIndicator } from "../../../components/LoadingIndicator";
import AdminOrOwner from "../../../components/AdminOrOwner";
import EntitiesToolBar from "../../../components/Entities/EntitiesToolBar";
import MyEditor from "../../../components/MyEditor";
import { Divider } from "primereact/divider";

function Entities() {
  const router = useRouter();
  const { projectId } = router.query;
  const {
    data: entities,
    isLoading,
    mutate,
  } = useSWR(EntityService.getBaseUrl(projectId as string));

  const [selectedEntity, setSelectedEntity] = useState<Entity>({});
  const [editColumnsDialogData, setEditColumnsDialogData] = useState<Column>(
    {}
  );
  const [manageDialogData, setManageDialogData] = useState<Entity>({});
  const [showColumnsDialog, setShowColumnsDialog] = useState(false);
  const [showEntityDialog, setShowEntityDialog] = useState(false);

  useEffect(() => {
    setSelectedEntity((prevState) => {
      const res = entities?.data?.find(
        (entity: Entity) => entity.id === prevState.id
      );
      return res || {};
    });
  }, [entities?.data]);

  const manageEntity = async (entity: Entity) => {
    if (entity.id) {
      await EntityService.update(entity, projectId).then((res) => res.data);
      mutate();
    } else {
      const { data: response } = await EntityService.create(
        entity,
        projectId as string
      ).then((res) => res.data);
      mutate({ ...entities, response });
    }
  };

  const deleteEntity = async (id: string) => {
    await EntityService.delete(id, projectId);
    mutate({ ...entities.data.filter((it: Entity) => it.id !== id) });
  };

  const deleteColumn = async (columnId: string) => {
    await ColumnService.delete(columnId, projectId);
    mutate();
  };

  const addNewColumn = async (data: Column) => {
    await ColumnService.create(data, projectId);
    mutate();
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <AdminOrOwner>
        <EntitiesToolBar
          currentEntity={selectedEntity}
          onAddClick={() => {
            setManageDialogData({});
            setShowEntityDialog(true);
          }}
          onManageClick={() => {
            setManageDialogData(selectedEntity);
            setShowEntityDialog(true);
          }}
          onUpdateColumnsClick={() => {
            setEditColumnsDialogData(selectedEntity);
            setShowColumnsDialog(true);
          }}
        />
        <Divider />
      </AdminOrOwner>

      <div className="grid h-full">
        <div className="col-2 pr-0">
          <EntityListComponent
            currentEntity={selectedEntity}
            listOfEntities={entities?.data}
            setCurrentEntity={setSelectedEntity}
          />
        </div>

        <div className="col pl-0">
          <MyEditor
            height="100vh"
            defaultLanguage="json"
            defaultValue={entityToString(selectedEntity)}
          />
        </div>
      </div>

      {showColumnsDialog && (
        <EditColumnsDialog
          data={editColumnsDialogData}
          onSubmit={addNewColumn}
          onDelete={deleteColumn}
          show={showColumnsDialog}
          onClose={() => {
            setShowColumnsDialog(false);
          }}
        />
      )}

      {showEntityDialog && (
        <ManageEntityDialog
          data={manageDialogData}
          onSubmit={manageEntity}
          onDelete={deleteEntity}
          onClose={() => setShowEntityDialog(false)}
          show={showEntityDialog}
        />
      )}
    </>
  );
}

export default Entities;
