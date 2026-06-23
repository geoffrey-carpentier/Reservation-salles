import { useTheme } from "../hooks/useTheme.js";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Activer le thème clair" : "Activer le thème sombre"}
      title={isDark ? "Thème clair" : "Thème sombre"}
      className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 4.5a1 1 0 0 1-1-1V2a1 1 0 1 1 2 0v1.5a1 1 0 0 1-1 1Zm0 17a1 1 0 0 1-1-1V19a1 1 0 1 1 2 0v1.5a1 1 0 0 1-1 1ZM4.5 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h1.5a1 1 0 0 1 1 1Zm17 0a1 1 0 0 1-1 1H19a1 1 0 1 1 0-2h1.5a1 1 0 0 1 1 1ZM6.34 7.76a1 1 0 0 1-1.41 0L3.87 6.7a1 1 0 1 1 1.41-1.41l1.06 1.06a1 1 0 0 1 0 1.41Zm11.31 11.31a1 1 0 0 1-1.41 0l-1.06-1.06a1 1 0 1 1 1.41-1.41l1.06 1.06a1 1 0 0 1 0 1.41ZM6.34 16.24a1 1 0 0 1 0 1.41L5.28 18.7a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0Zm11.31-11.31a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12.7 2.1a1 1 0 0 1 .2 1.1A8 8 0 0 0 20.8 11.1a1 1 0 0 1 1.1.2 1 1 0 0 1 .1 1.2A10 10 0 1 1 11.4 1a1 1 0 0 1 1.3 1.1Z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
