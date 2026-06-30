import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <p className="text-6xl font-bold text-brand-500 mb-2">404</p>
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Page introuvable
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn btn-primary">
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default NotFound;
