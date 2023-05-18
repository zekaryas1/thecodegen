import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Entity } from "../../lib/models/Entity";
import { Generator } from "../../lib/models/Generator";
import { Template } from "../../lib/models/Template";
import AdminOrOwner from "../AdminOrOwner";
import Conditional from "../Conditional";

interface CodesToolBarProps {
  currentEntity: Entity;
  updateCurrentEntity: (entity: Entity) => void;
  updateTemplate: (template: Template) => void;
  regenerateResult: () => void;
  currentGenerator: Generator;
  listOfEntities: Entity[];
  addClick: () => void;
  manageClick: () => void;
}

function CodesToolBar({
  addClick,
  manageClick,
  currentEntity,
  updateCurrentEntity,
  listOfEntities,
  currentGenerator,
  updateTemplate,
  regenerateResult,
}: CodesToolBarProps) {
  return (
    <div className="flex surface-50 mb-3 justify-content-between align-items-center p-2 px-3 border-round-lg">
      <AdminOrOwner>
        <div>
          <Button
            className="p-button p-button-sm p-button-outlined mr-3"
            tooltip="Click to add a new generator"
            tooltipOptions={{ position: "bottom" }}
            icon="pi pi-plus"
            onClick={addClick}
          />
          <Conditional
            if={currentGenerator.id}
            show={
              <Button
                label="Manage"
                tooltip="Click to manage(edit, delete) the template"
                tooltipOptions={{ position: "bottom" }}
                icon="pi pi-pencil"
                className="p-button-help p-button-outlined p-button-sm"
                onClick={manageClick}
              />
            }
          />
        </div>
      </AdminOrOwner>
      <div>
        <Dropdown
          filter
          filterPlaceholder="Search entities..."
          dataKey="id"
          value={currentEntity}
          tooltip="Select an Entity to generate code for"
          tooltipOptions={{ position: "bottom" }}
          options={listOfEntities}
          onChange={(e) => {
            updateCurrentEntity(e.value);
          }}
          className="w-20rem surface-50 border-0 surface-border"
          optionLabel="name"
          placeholder="Select an Entity"
        />
      </div>
      <div>
        <AdminOrOwner>
          <Conditional
            if={currentGenerator.id}
            show={
              <Button
                label="Save"
                tooltip="Click to save the template"
                tooltipOptions={{ position: "bottom" }}
                icon="pi pi-save"
                className="p-button-sm p-button-outlined p-button-info"
                onClick={() => {
                  currentGenerator.template &&
                    updateTemplate(currentGenerator.template);
                }}
              />
            }
          />
        </AdminOrOwner>
        <Button
          label="Regenerate"
          tooltip="Click to regenerate the result"
          tooltipOptions={{ position: "bottom" }}
          icon="pi pi-play"
          className="p-button-sm p-button-success ml-3"
          onClick={regenerateResult}
        />
      </div>
    </div>
  );
}

export default CodesToolBar;
