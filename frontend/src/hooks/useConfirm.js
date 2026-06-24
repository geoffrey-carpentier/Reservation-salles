import { useContext } from "react";
import { ConfirmContext } from "../contexts/confirmCreate.js";

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm doit être utilisé dans un ConfirmProvider");
  }
  return context.confirm;
}
export default useConfirm;
