import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import React, { useState } from "react";
import { ConfirmPopup } from "primereact/confirmpopup";
import { DialogProps } from "../../lib/models/InterfaceProps";
import { Project } from "../../lib/models/Project";
import { myConfirmPopUp } from "../MyConfirmPopup";
import { DIALOG_PROPS, PROJECT_DESCRIPTION_MAX_LENGTH } from "../../lib/fixed";
import Conditional from "../Conditional";

function ManageProjectDialog({
  onClose,
  data,
  show,
  onSubmit,
  onDelete,
}: DialogProps<Project>) {
  const [project, setProject] = useState<Project>(data);

  const acceptDelete = () => {
    if (data.id) {
      onDelete(data.id);
    }
    onClose();
  };

  const updateState = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProject((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(project);
    onClose();
  };

  return (
    <Dialog
      header="Manage project"
      visible={show}
      onHide={onClose}
      {...DIALOG_PROPS}
    >
      <ConfirmPopup />
      <form className="flex flex-column gap-4" onSubmit={submitForm}>
        <InputText
          placeholder="Name"
          title="New project's name"
          required
          name="name"
          value={project.name || ""}
          onChange={updateState}
          autoFocus={true}
        />
        <InputText
          placeholder={`Description not more than (${PROJECT_DESCRIPTION_MAX_LENGTH}) characters`}
          name="description"
          required
          maxLength={PROJECT_DESCRIPTION_MAX_LENGTH}
          value={project.description || ""}
          onChange={updateState}
        />

        <div className="flex justify-content-end gap-2">
          <Button label="Save" type="submit" />
          <Conditional
            if={data.id}
            show={
              <Button
                label="Delete"
                type="button"
                className="p-button-text p-button-danger"
                onClick={(event) =>
                  myConfirmPopUp({
                    event: event,
                    acceptCallBack: acceptDelete,
                    additionalMessage:
                      "Data related to this will be deleted, i.e entity, generators...",
                  })
                }
              />
            }
          />
        </div>
      </form>
    </Dialog>
  );
}

export default ManageProjectDialog;
