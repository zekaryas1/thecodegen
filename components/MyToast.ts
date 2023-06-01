import { createContext } from "react";
import { Toast } from "primereact/toast";

export const ToastContext = createContext<{
  showSuccess: (detail: string) => void;
  showError: (detail: string) => void;
} | null>(null);

export class MyToast {
  static showSuccess = (toast: any, detail?: string) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: detail || "Operation done Successfully",
      life: 3000,
    });
  };

  static showError = (toast: any, detail?: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: detail || "Something went wrong",
      life: 3000,
    });
  };
}
