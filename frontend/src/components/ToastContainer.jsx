import { useToast } from "../hooks/useToast.js";

const STYLES = {
  success: "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900",
  error: "bg-red-600 text-white",
};

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-xs">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          onClick={() => removeToast(toast.id)}
          className={`${STYLES[toast.type] || STYLES.success} rounded-lg shadow-lg px-4 py-3 text-sm cursor-pointer transition-opacity`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
