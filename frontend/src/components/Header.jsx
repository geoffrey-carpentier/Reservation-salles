// components/Header.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-indigo-700">
          Réservation de Salle
        </Link>
        <nav className="flex gap-1">
          <NavLink to="/" className={linkClass}>
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
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">{user?.firstname}</span>
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
