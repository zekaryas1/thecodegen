import React, { useCallback, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import AttributeColumns from "./AttributeColumns";
import { DialogProps } from "../../lib/models/InterfaceProps";
import { Entity } from "../../lib/models/Entity";
import { Column, ConstraintType } from "../../lib/models/Column";
import { Dropdown, DropdownChangeParams } from "primereact/dropdown";
import { myConfirmPopUp } from "../MyConfirmPopup";
import { ConfirmPopup } from "primereact/confirmpopup";
import { DATA_TYPES, DIALOG_PROPS } from "../../lib/fixed";

function EditColumnsDialog({
  onClose,
  data,
  show,
  onSubmit,
  onDelete,
}: DialogProps<Entity>) {
  const [selectedColumn, setSelectedColumn] = useState<Column>({
    name: "",
    constraint: [],
  });

  const getNewConstraint = () => {
    return {
      id: new Date().toLocaleString(),
      type: "",
      name: "",
      value: "",
      draft: true,
    };
  };

  const updateOrAddConstraint = useCallback(
    (newConstraint: ConstraintType) => {
      //if newConstraint is in setSelectedColumn update it else add
      if (selectedColumn.constraint?.find((it) => it.id === newConstraint.id)) {
        setSelectedColumn((preState) => {
          return {
            ...preState,
            constraint: preState.constraint?.map((it) => {
              return it.id === newConstraint.id ? newConstraint : it;
            }),
          };
        });
      } else {
        setSelectedColumn((preState) => {
          return {
            ...preState,
            constraint: [newConstraint, ...(preState.constraint || [])],
          };
        });
      }
    },
    [selectedColumn.constraint]
  );

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    selectedColumn.entityId = data.id;
    selectedColumn.constraint = selectedColumn.constraint?.filter(
      (constraint) =>
        constraint.name && (constraint.draft === undefined || !constraint.draft)
    );

    onSubmit(selectedColumn);
    onClose();
  };

  const acceptDelete = () => {
    if (selectedColumn.id) {
      onDelete(selectedColumn.id);
    }
    onClose();
  };

  return (
    <Dialog
      header={`Editing ${data.name}`}
      visible={show}
      onHide={onClose}
      {...DIALOG_PROPS}
    >
      <ConfirmPopup />
      <form className="flex flex-column gap-4" onSubmit={submitForm}>
        <Dropdown
          options={data.columns}
          value={selectedColumn}
          dataKey="id"
          onChange={(e) => {
            setSelectedColumn(e.value);
          }}
          optionLabel="name"
          placeholder="Column to edit"
          autoFocus={true}
        />

        <p>Required column fields</p>

        <div className="grid gap-3 ml-0">
          <InputText disabled placeholder="name" className="col-3" />
          <InputText
            placeholder="value"
            name="name"
            required
            onChange={(event) => {
              setSelectedColumn({
                ...selectedColumn,
                name: event.target.value,
              });
            }}
            value={selectedColumn.name}
            className="col-3"
          />
        </div>

        <div className="grid gap-3 ml-0">
          <InputText disabled placeholder="type" className="col-3" />
          <Dropdown
            className="col-3 p-0"
            name="type"
            value={selectedColumn.$type || selectedColumn.type || ""}
            onChange={(event) => {
              setSelectedColumn({
                ...selectedColumn,
                $type: event.value, //used for form handling purpose only
                type: event.value.name || event.value,
              });
            }}
            options={DATA_TYPES}
            optionLabel="name"
            placeholder="type"
            editable
          />
        </div>

        <TrackedConstraints
          constraints={selectedColumn.constraint || []}
          onChangeClick={updateOrAddConstraint}
        />

        <DraftConstraints
          constraints={selectedColumn.constraint || []}
          onChangeClick={updateOrAddConstraint}
        />

        <div className="flex">
          <Button
            label="More draft constraints"
            type="button"
            className="p-button-outlined p-button-secondary"
            icon="pi pi-plus"
            onClick={() => updateOrAddConstraint(getNewConstraint())}
          />
        </div>

        <div className="flex justify-content-end">
          <Button label={selectedColumn.id ? "Edit" : "Save"} type="submit" />
          {selectedColumn.id && (
            <Button
              label="Delete"
              type="button"
              className="p-button-text p-button-danger"
              onClick={(event) =>
                myConfirmPopUp({
                  event: event,
                  acceptCallBack: acceptDelete,
                })
              }
            />
          )}
        </div>
      </form>
    </Dialog>
  );
}

/**
 * Returns a list of AttributeColumns for all non-draft constraints in the selectedColumn.
 *
 * @returns {JSX.Element} The list of AttributeColumns.
 */

const TrackedConstraints = ({
  constraints,
  onChangeClick,
}: {
  constraints: ConstraintType[];
  onChangeClick: (constraint: ConstraintType) => void;
}): JSX.Element => {
  return (
    <>
      <p>Tracked constraints</p>
      {constraints
        .filter((it) => it.draft == undefined || !it.draft)
        .map((constraint) => {
          return (
            <AttributeColumns
              key={constraint.id}
              data={constraint}
              onChangeClick={onChangeClick}
            />
          );
        })}
    </>
  );
};

/**
 * Returns a list of AttributeColumns for all draft constraints in the selectedColumn.
 * @returns {JSX.Element} The list of AttributeColumns for all non-draft constraints in the selectedColumn.
 */
const DraftConstraints = ({
  constraints,
  onChangeClick,
}: {
  constraints: ConstraintType[];
  onChangeClick: (constraint: ConstraintType) => void;
}): JSX.Element => {
  return (
    <>
      <p>Draft constraints</p>
      {constraints
        .filter((it) => it.draft)
        .map((constraint) => {
          return (
            <AttributeColumns
              key={constraint.id}
              data={constraint}
              onChangeClick={onChangeClick}
            />
          );
        })}
    </>
  );
};

export default EditColumnsDialog;
