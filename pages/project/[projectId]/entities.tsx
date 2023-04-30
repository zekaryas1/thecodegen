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
import Flow from "../../../components/Entities/Flow";
import { ReactFlowProvider } from "reactflow";
import Conditional from "../../../components/Conditional";

function Entities() {
  const router = useRouter();
  const { projectId } = router.query;
  const {
    data: entities,
    isLoading,
    mutate: refreshEntities,
  } = useSWR(EntityService.getBaseUrl(projectId as string));

  const [selectedEntity, setSelectedEntity] = useState<Entity>({});
  const [editColumnsDialogData, setEditColumnsDialogData] = useState<Column>(
    {}
  );
  const [manageDialogData, setManageDialogData] = useState<Entity>({});
  const [showColumnsDialog, setShowColumnsDialog] = useState(false);
  const [showEntityDialog, setShowEntityDialog] = useState(false);

  const [currentViewOption, setCurrentViewOption] = useState("json");

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
      refreshEntities();
    } else {
      const { data: response } = await EntityService.create(
        entity,
        projectId as string
      ).then((res) => res.data);
      refreshEntities({ ...entities, response });
    }
  };

  const deleteEntity = async (id: string) => {
    await EntityService.delete(id, projectId);
    refreshEntities({ ...entities.data.filter((it: Entity) => it.id !== id) });
  };

  const deleteColumn = async (columnId: string) => {
    await ColumnService.delete(columnId, projectId);
    refreshEntities();
  };

  const addNewColumn = async (data: Column) => {
    await ColumnService.create(data, projectId);
    refreshEntities();
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
          viewOptions={["json", "diagram"]}
          currentViewValue={currentViewOption}
          onViewChange={(newView) => {
            setCurrentViewOption(newView);
          }}
        />
        <Divider />
      </AdminOrOwner>

      <div className="grid min-h-screen mb-4">
        <div className="col-2 pr-0">
          <EntityListComponent
            currentEntity={selectedEntity}
            listOfEntities={entities?.data}
            setCurrentEntity={setSelectedEntity}
          />
        </div>

        <div className="col pl-0">
          <Conditional
            if={currentViewOption === "diagram"}
            show={
              <ReactFlowProvider>
                <Flow
                  data={entities.data.map((it: Entity) => {
                    return {
                      id: it.id,
                      type: "textUpdater",
                      position: { x: 0, y: 0 },
                      data: it,
                    };
                  })}
                />
              </ReactFlowProvider>
            }
            else={
              <MyEditor
                height="100%"
                defaultLanguage="json"
                defaultValue={entityToString(selectedEntity)}
              />
            }
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
