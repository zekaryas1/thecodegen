import { Button } from "primereact/button";
import { ListBox } from "primereact/listbox";
import React from "react";
import { Entity, entityToString } from "../../lib/models/Entity";
import AdminOrOwner from "../AdminOrOwner";

interface Props {
  currentEntity: Entity;
  setCurrentEntity: (entity: Entity) => void;
  listOfEntities: Entity[];
}

const EntityListComponent = ({
  currentEntity,
  setCurrentEntity,
  listOfEntities,
}: Props) => {
  const itemTemplate = (entity: Entity) => {
    return (
      <p
        className="py-2 px-3"
        onClick={() => {
          setCurrentEntity(entity);
        }}
      >
        <i className="pi pi-database" /> {entity.name}
      </p>
    );
  };

  return (
    <>
      <ListBox
        filter
        filterPlaceholder="Search entities..."
        className="h-screen overflow-hidden"
        style={{
          borderRadius: "0px",
          borderRight: "0px",
        }}
        dataKey="id"
        title="Entities"
        value={currentEntity}
        itemTemplate={itemTemplate}
        options={listOfEntities}
        optionLabel="name"
      />
    </>
  );
};

export default React.memo(EntityListComponent);
