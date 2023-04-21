import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { ConfirmPopup } from "primereact/confirmpopup";
import { myConfirmPopUp } from "../MyConfirmPopup";
import { Generator } from "../../lib/models/Generator";
import { DialogProps } from "../../lib/models/InterfaceProps";
import { DIALOG_PROPS, DIALOG_STYLES } from "../../lib/fixed";

function ManageGeneratorDialog({
  onClose,
  show,
  data,
  onSubmit,
  onDelete,
}: DialogProps<Generator>) {
  const [generator, setGenerator] = useState<Generator>(data);

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(generator);
    onClose();
  };

  const acceptDelete = () => {
    if (generator.id) {
      onDelete(generator.id);
    }
    onClose();
  };

  return (
    <Dialog
      header="Manage generators"
      visible={show}
      onHide={onClose}
      {...DIALOG_PROPS}
    >
      <ConfirmPopup />
      <form className="flex flex-column gap-4" onSubmit={submitForm}>
        <InputText
          placeholder="generator name"
          value={generator.name || ""}
          autoFocus={true}
          name="name"
          onChange={(e) => {
            setGenerator({ ...generator, name: e.target.value });
          }}
        />

        <div className="flex justify-content-end gap-2">
          <Button label="Save" />
          <Button
            label="Delete"
            type="button"
            className="p-button-text p-button-danger"
            onClick={(event) =>
              myConfirmPopUp({ event: event, acceptCallBack: acceptDelete })
            }
          />
        </div>
      </form>
    </Dialog>
  );
}

export default ManageGeneratorDialog;
