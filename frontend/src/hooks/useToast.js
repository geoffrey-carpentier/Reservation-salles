import { useContext } from "react";
import { ToastContext } from "../contexts/toastCreate.js";

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast doit être utilisé dans un ToastProvider");
  }
  return context;
}
export default useToast;
