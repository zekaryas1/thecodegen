import { confirmPopup } from "primereact/confirmpopup";
import React from "react";

export const myConfirmPopUp = (inputs: {
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>;
  acceptCallBack?: () => void;
  rejectCallBack?: () => void;
  additionalMessage?: string;
}) => {
  const { event, acceptCallBack, rejectCallBack, additionalMessage } = inputs;

  confirmPopup({
    target: event.currentTarget,
    message: "Are you sure you want to do this?" + (additionalMessage || ""),
    icon: "pi pi-info-circle",
    acceptClassName: "p-button-danger",
    accept() {
      acceptCallBack && acceptCallBack();
    },
    reject() {
      rejectCallBack && rejectCallBack();
    },
  });
};
