import { ListBox } from "primereact/listbox";
import { Generator } from "../../lib/models/Generator";
import React from "react";

interface Props {
  generators: Generator[];
  currentGenerator: Generator;
  newGeneratorSelected: (options: Generator) => void;
}

function GeneratorListComponent({
  generators,
  currentGenerator,
  newGeneratorSelected,
}: Props) {
  const itemTemplate = (option: Generator) => {
    const itemClicked = () => {
      newGeneratorSelected(option);
    };

    return (
      <p className="py-2 px-3" onClick={itemClicked}>
        <i className="pi pi-file"></i> {option.name}
      </p>
    );
  };

  return (
    <>
      <ListBox
        filter
        filterPlaceholder="Search generators..."
        className="h-full overflow-hidden"
        style={{
          borderRadius: "0px",
          borderRight: "0px",
        }}
        dataKey="id"
        options={generators}
        itemTemplate={itemTemplate}
        optionLabel="name"
        value={currentGenerator}
      />
    </>
  );
}

export default React.memo(GeneratorListComponent);
