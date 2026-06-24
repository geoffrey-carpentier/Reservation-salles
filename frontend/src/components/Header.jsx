// components/Header.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import ThemeToggle from "./ThemeToggle.jsx";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? "bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100"
        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 dark:bg-gray-900/90 dark:border-gray-700">
      <div className="page-container py-3 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100"
        >
          <span className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center text-sm">
            RS
          </span>
          <span className="hidden sm:inline">Réservation de Salle</span>
        </Link>

        <nav className="flex gap-1">
          <NavLink to="/" className={linkClass} end>
            Accueil
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Mon espace
              </NavLink>
              <NavLink to="/planning" className={linkClass}>
                Planning
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                Profil
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-300">
                {user?.firstname}
              </span>
              <button className="btn btn-danger" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">
                Connexion
              </Link>
              <Link to="/register" className="btn btn-primary">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
export default Header;
