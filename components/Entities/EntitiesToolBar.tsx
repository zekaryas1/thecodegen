import { Button } from "primereact/button";
import { Entity } from "../../lib/models/Entity";
import Conditional from "../Conditional";

interface EntitiesToolBarProps {
  currentEntity: Entity;
  onAddClick: () => void;
  onManageClick: () => void;
  onUpdateColumnsClick: () => void;
}

function EntitiesToolBar({
  currentEntity,
  onAddClick,
  onManageClick,
  onUpdateColumnsClick,
}: EntitiesToolBarProps) {
  return (
    <div className="flex surface-50 mb-3 justify-content-between align-items-center p-3 border-round-lg">
      <div>
        <Button
          className="p-button-outlined p-button-primary p-button-sm mr-3"
          tooltip="Click to add a new entity"
          tooltipOptions={{ position: "bottom" }}
          icon="pi pi-plus"
          label=""
          onClick={onAddClick}
        />
        <Conditional
          if={currentEntity.id}
          show={
            <Button
              className="p-button-outlined p-button-help p-button-sm"
              icon="pi pi-pencil"
              tooltip="Click to manage(edit, delete) the entity"
              tooltipOptions={{ position: "bottom" }}
              label="Manage"
              onClick={onManageClick}
            />
          }
        />
      </div>
      <Conditional
        if={currentEntity.id}
        show={
          <Button
            className="p-button-outlined p-button-success p-button-sm"
            tooltip="Click to update columns and constraints"
            tooltipOptions={{ position: "bottom" }}
            icon="pi pi-refresh"
            label="Update Columns"
            onClick={onUpdateColumnsClick}
          />
        }
        else={
          <Button
            className="p-button-sm p-button-outlined p-button-info"
            tooltipOptions={{ position: "bottom" }}
            tooltip="Start by selecting an entity"
            label="Select an entity to start"
          />
        }
      />
    </div>
  );
}

export default EntitiesToolBar;
