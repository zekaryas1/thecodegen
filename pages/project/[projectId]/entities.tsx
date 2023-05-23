import { useEffect, useState } from "react";
import useSWR from "swr";
import { Entity, entityToString } from "../../../lib/models/Entity";
import { EntityService } from "../../../lib/services/EntityService";
import { Column } from "../../../lib/models/Column";
import { useRouter } from "next/router";
import EditColumnsDialog from "../../../components/Entities/EditColumnsDialog";
import ManageEntityDialog from "../../../components/Entities/ManageEntityDialog";
import EntityListComponent from "../../../components/Entities/EntityList";
import { LoadingIndicator } from "../../../components/LoadingIndicator";
import AdminOrOwner from "../../../components/AdminOrOwner";
import EntitiesToolBar from "../../../components/Entities/EntitiesToolBar";
import MyEditor from "../../../components/MyEditor";
import { Divider } from "primereact/divider";
import { EntitiesUtils } from "../../../components/Entities/EntitiesUtils";
import Flow, { EdgeType } from "../../../components/Entities/Flow";
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

  const manageEntity = (entity: Entity) => {
    EntitiesUtils.manageEntity({
      projectId: projectId as string,
      entity: entity,
      onSuccessfulCreate(response: Entity) {
        setSelectedEntity(response);
        refreshEntities({ ...entities, response });
      },
      onSuccessfulUpdate() {
        refreshEntities();
      },
    });
  };

  const deleteEntity = (id: string) => {
    EntitiesUtils.deleteEntity({
      projectId: projectId as string,
      id: id,
      onSuccess() {
        refreshEntities({
          ...entities.data.filter((it: Entity) => it.id !== id),
        });
      },
    });
  };

  const deleteColumn = (columnId: string) => {
    EntitiesUtils.deleteColumn({
      projectId: projectId as string,
      columnId: columnId,
      onSuccess() {
        refreshEntities();
      },
    });
  };

  const addNewColumn = (data: Column) => {
    EntitiesUtils.addNewColumn({
      projectId: projectId as string,
      data: data,
      onSuccess() {
        refreshEntities();
      },
    });
  };

  const addNewConstraint = (edgeData: EdgeType, onSuccess: () => void) => {
    const entity = entities.find(
      (entity: Entity) => entity.id === edgeData.source
    );
    const updatedColumn = EntitiesUtils.getNewColumnForEntity(edgeData, entity);
    addNewColumn(updatedColumn);
    onSuccess();
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
                  nodes={EntitiesUtils.generateNodes(entities.data)}
                  edges={EntitiesUtils.generateEdges(entities.data)}
                  onEdgeConnection={addNewConstraint}
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
