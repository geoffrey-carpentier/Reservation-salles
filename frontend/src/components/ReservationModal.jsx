import { useState } from "react";

const DURATIONS = [1, 2, 3, 4];

// slot: { date, dayIndex, hour, startTime } pour une création
// reservation: réservation existante pour une modification
function ReservationModal({ slot, reservation, dayLabel, onClose, onSubmit, onDelete }) {
  const isEdit = Boolean(reservation);
  const startHour = isEdit
    ? new Date(reservation.start_time).getHours()
    : slot.hour;
  const initialDuration = isEdit
    ? Math.max(
        1,
        (new Date(reservation.end_time) - new Date(reservation.start_time)) /
          (1000 * 60 * 60),
      )
    : 1;

  const [title, setTitle] = useState(reservation?.title || "");
  const [duration, setDuration] = useState(initialDuration);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const maxDuration = 19 - startHour;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("L'objet de la réunion est requis");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), duration });
    } catch (err) {
      setError(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Annuler cette réservation ?")) return;
    setLoading(true);
    setError("");
    try {
      await onDelete();
    } catch (err) {
      setError(err.message || "Erreur lors de l'annulation");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          {isEdit ? "Modifier la réservation" : "Réserver un créneau"}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {dayLabel} — {String(startHour).padStart(2, "0")}h00 à{" "}
          {String(startHour + duration).padStart(2, "0")}h00
        </p>

        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm mb-3" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Objet de la réunion
            </label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Durée
            </label>
            <select
              className="form-input"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              disabled={loading}
            >
              {DURATIONS.filter((d) => d <= maxDuration).map((d) => (
                <option key={d} value={d}>
                  {d} heure{d > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
            {isEdit && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={loading}
              >
                Supprimer
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Enregistrement..." : isEdit ? "Enregistrer" : "Réserver"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReservationModal;
