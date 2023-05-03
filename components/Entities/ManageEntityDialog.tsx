import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { ConfirmPopup } from "primereact/confirmpopup";
import { DialogProps } from "../../lib/models/InterfaceProps";
import { Entity } from "../../lib/models/Entity";
import { myConfirmPopUp } from "../MyConfirmPopup";
import { DIALOG_PROPS } from "../../lib/fixed";
import Conditional from "../Conditional";

function ManageEntityDialog({
  data,
  onClose,
  show,
  onSubmit,
  onDelete,
}: DialogProps<Entity>) {
  const [entity, setEntity] = useState<Entity>(data);

  const updateState = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEntity((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  const acceptDelete = () => {
    if (entity.id) {
      onDelete(entity.id);
    }
    onClose();
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(entity);
    onClose();
  };

  return (
    <Dialog
      header="Manage entity"
      visible={show}
      onHide={onClose}
      {...DIALOG_PROPS}
    >
      <ConfirmPopup />
      <form className="flex flex-column gap-4" onSubmit={submitForm}>
        <InputText
          placeholder="Name"
          title="Entity's name"
          name="name"
          required
          autoFocus={true}
          value={entity.name || ""}
          onChange={updateState}
        />

        <div className="flex justify-content-end gap-2">
          <Button label="Save" type="submit" />
          <Conditional
            if={entity.id}
            show={
              <Button
                label="Delete"
                type="button"
                className="p-button-text p-button-danger"
                onClick={(event) =>
                  myConfirmPopUp({ event: event, acceptCallBack: acceptDelete })
                }
              />
            }
          />
        </div>
      </form>
    </Dialog>
  );
}

export default ManageEntityDialog;
