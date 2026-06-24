import { useState, useCallback, useRef } from "react";
import { ConfirmContext } from "./confirmCreate.js";

export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null);
  const resolveRef = useRef(null);

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setRequest({ message });
    });
  }, []);

  const handle = (result) => {
    resolveRef.current?.(result);
    setRequest(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {request && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
          <div className="card w-full max-w-sm">
            <p className="text-gray-800 dark:text-gray-100 mb-5">{request.message}</p>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn" onClick={() => handle(false)}>
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handle(true)}
                autoFocus
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
