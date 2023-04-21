import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import React from "react";
import { ConstraintType } from "../../lib/models/Column";
import { DATA_TYPES } from "../../lib/fixed";
import Conditional from "../Conditional";

export interface AttributeColumnsProps {
  data: ConstraintType;
  onChangeClick?: (constraint: ConstraintType) => void;
}

/**
 * A component that renders a form for editing column attributes.
 *
 * @param {object} data - The data of the attribute columns.
 * @param {function} onChangeClick - A callback function that's called when the user
 * clicks the "Save" or "Discard Changes" button. It receives the updated data as an argument.
 * @returns {JSX.Element} The rendered form.
 */
function AttributeColumns({ data, onChangeClick }: AttributeColumnsProps) {
  /**
   * Returns a button component based on the value of the 'draft' property in the 'data' object.
   * The button is responsible for adding/removing the constraint to/from the 'data' object.
   *
   * @return {JSX.Element} A button component based on the value of the 'draft' property.
   * @param {Object} data - An object containing the 'draft' property.
   * @param {boolean} data.draft - A boolean representing whether the button should be in draft mode or not.
   * @param {function} onChangeClick - A function that gets called when the button is clicked.
   */
  const getButtonBasedOnDraft = () => {
    return (
      <Conditional
        if={data.draft}
        show={
          <Button
            icon="pi pi-check"
            className="p-button-rounded p-button-text"
            type="button"
            onClick={() => {
              onChangeClick &&
                onChangeClick({
                  ...data,
                  draft: false,
                });
            }}
          />
        }
        else={
          <Button
            icon="pi pi-times"
            className="p-button-rounded p-button-danger p-button-text"
            type="button"
            onClick={() => {
              onChangeClick &&
                onChangeClick({
                  ...data,
                  draft: true,
                });
            }}
          />
        }
      />
    );
  };

  return (
    <div className="grid gap-3 ml-0">
      <InputText
        placeholder="name"
        name="name"
        value={data.name}
        onChange={(event) => {
          onChangeClick &&
            onChangeClick({
              ...data,
              name: event.target.value,
            });
        }}
        className="col-3"
      />
      <Dropdown
        className="col-3 p-0"
        name="type"
        value={data.$type || data.type || ""}
        onChange={(event) => {
          onChangeClick &&
            onChangeClick({
              ...data,
              $type: event.target.value,
              type: event.target.value.name || event.target.value,
            });
        }}
        options={DATA_TYPES}
        optionLabel="name"
        placeholder="type"
        editable
      />
      <InputText
        placeholder="value"
        name="value"
        value={data.value}
        onChange={(event) => {
          onChangeClick &&
            onChangeClick({
              ...data,
              value: event.target.value,
            });
        }}
        className="col-3"
      />
      <div>{getButtonBasedOnDraft()}</div>
    </div>
  );
}

export default AttributeColumns;
