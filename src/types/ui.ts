export type ToastType = "success" | "error" | "warning";

export interface ToastState {
  message: string;
  type: ToastType;
}
