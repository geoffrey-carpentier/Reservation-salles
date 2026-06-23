import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { reservationService } from "../services/api.js";

function Dashboard() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reservationService
      .getMine()
      .then((data) => setReservations(data))
      .catch((err) => setError(err.message || "Impossible de charger vos réservations"))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Annuler cette réservation ?")) return;
    try {
      await reservationService.remove(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message || "Erreur lors de l'annulation");
    }
  };

  const upcoming = reservations
    .filter((r) => new Date(r.end_time) >= new Date())
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-1">Bienvenue {user?.firstname} !</h1>
      <p className="text-gray-600 mb-6">{user?.email}</p>

      <div className="flex gap-3 mb-6">
        <Link to="/planning" className="btn btn-primary">
          Voir le planning
        </Link>
        <Link to="/profile" className="btn">
          Mon profil
        </Link>
      </div>

      <h2 className="text-lg font-semibold mb-3">Mes prochaines réservations</h2>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      {loading ? (
        <p>Chargement...</p>
      ) : upcoming.length === 0 ? (
        <p className="text-gray-500">Aucune réservation à venir.</p>
      ) : (
        <ul className="space-y-2">
          {upcoming.map((r) => (
            <li key={r.id} className="card flex items-center justify-between">
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-sm text-gray-600">
                  {new Date(r.start_time).toLocaleString("fr-FR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  →{" "}
                  {new Date(r.end_time).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/planning" className="btn">
                  Modifier
                </Link>
                <button className="btn btn-danger" onClick={() => handleCancel(r.id)}>
                  Annuler
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
