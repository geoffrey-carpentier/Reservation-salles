import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
        Réservation de la salle de réunion
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        TechSpace Solutions — réservez votre créneau en quelques clics, fini les
        post-its et les doubles réservations.
      </p>

      <div className="flex justify-center gap-3">
        {isAuthenticated ? (
          <Link to="/planning" className="btn btn-primary">
            Voir le planning
          </Link>
        ) : (
          <>
            <Link to="/register" className="btn btn-primary">
              Commencer
            </Link>
            <Link to="/login" className="btn">
              Se connecter
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
