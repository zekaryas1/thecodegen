import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import React, { useState } from "react";
import { DialogProps } from "../../lib/models/InterfaceProps";
import { DIALOG_PROPS } from "../../lib/fixed";

function ManageMemberDialog({ onClose, show, onSubmit }: DialogProps<string>) {
  const [email, setEmail] = useState<string>("");

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(email);
    onClose();
  };

  return (
    <Dialog
      header="Invite new member"
      visible={show}
      onHide={onClose}
      {...DIALOG_PROPS}
    >
      <form className="flex flex-column gap-4" onSubmit={submitForm}>
        <InputText
          placeholder="email"
          required
          autoFocus={true}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <div className="flex justify-content-end">
          <Button label="Invite" type="submit" />
        </div>
      </form>
    </Dialog>
  );
}

export default ManageMemberDialog;
