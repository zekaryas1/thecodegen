import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";
import { Entity, entityToString } from "../../lib/models/Entity";
import MyEditor from "../MyEditor";

interface Props {
  currentEntity: Entity;
  setCurrentEntity: (entity: Entity) => void;
  listOfEntities: Entity[];
}

const EntitySelectionComponent = ({
  currentEntity,
  listOfEntities,
  setCurrentEntity,
}: Props) => {
  const [editorData, setEditorData] = useState("");

  return (
    <div>
      <div className="flex flex-column mt-3 mb-2">
        <Dropdown
          filter
          value={currentEntity}
          options={listOfEntities}
          onChange={(e) => {
            setCurrentEntity(e.value);
            setEditorData(entityToString(e.value));
          }}
          optionLabel="name"
          placeholder="Select an Entity"
        />
      </div>
      <MyEditor
        height="40vh"
        defaultLanguage="json"
        defaultValue={editorData}
        isReadOnly={true}
      />
    </div>
  );
};

// export default React.memo(EntitySelectionComponent);
