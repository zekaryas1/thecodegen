export interface DialogProps<T> {
  onClose: () => void;
  show: boolean;
  data: T;
  onSubmit: (data: T) => void;
  onDelete: (id: string) => void;
}
