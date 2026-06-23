import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { reservationService } from "../services/api.js";
import ReservationModal from "../components/ReservationModal.jsx";
import {
  WORKING_HOURS,
  getMonday,
  addDays,
  toISODate,
  buildSlotDateTime,
  formatDayLabel,
  isPastSlot,
} from "../utils/date.js";

function Planning() {
  const { user } = useAuth();
  const [weekOffset, setWeekOffset] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState(null); // { mode: 'create'|'edit', slot, reservation }

  const monday = addDays(getMonday(), weekOffset * 7);

  const loadWeek = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await reservationService.getWeek(toISODate(monday));
      setReservations(data);
    } catch (err) {
      setError(err.message || "Impossible de charger le planning");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekOffset]);

  useEffect(() => {
    loadWeek();
  }, [loadWeek]);

  const findReservation = (dayIndex, hour) => {
    const slotStart = new Date(buildSlotDateTime(monday, dayIndex, hour));
    return reservations.find((r) => {
      const start = new Date(r.start_time);
      const end = new Date(r.end_time);
      return slotStart >= start && slotStart < end;
    });
  };

  const closeModal = () => setModalState(null);

  const handleCellClick = (dayIndex, hour) => {
    const reservation = findReservation(dayIndex, hour);
    if (reservation) {
      if (reservation.user_id === user?.id) {
        setModalState({ mode: "edit", reservation });
      }
      return; // créneau occupé par un autre utilisateur : pas d'action
    }
    if (isPastSlot(monday, dayIndex, hour)) return;
    setModalState({ mode: "create", slot: { dayIndex, hour } });
  };

  const handleSubmit = async ({ title, duration }) => {
    if (modalState.mode === "create") {
      const { dayIndex, hour } = modalState.slot;
      const startTime = buildSlotDateTime(monday, dayIndex, hour);
      const endTime = buildSlotDateTime(monday, dayIndex, hour + duration);
      await reservationService.create({ title, startTime, endTime });
    } else {
      const r = modalState.reservation;
      const startHour = new Date(r.start_time).getHours();
      const dayIndex = (new Date(r.start_time).getDay() + 6) % 7; // lun=0
      const startTime = buildSlotDateTime(monday, dayIndex, startHour);
      const endTime = buildSlotDateTime(monday, dayIndex, startHour + duration);
      await reservationService.update(r.id, { title, startTime, endTime });
    }
    closeModal();
    await loadWeek();
  };

  const handleDelete = async () => {
    await reservationService.remove(modalState.reservation.id);
    closeModal();
    await loadWeek();
  };

  const dayLabelForModal = () => {
    if (!modalState) return "";
    if (modalState.mode === "create") {
      return formatDayLabel(monday, modalState.slot.dayIndex);
    }
    const dayIndex = (new Date(modalState.reservation.start_time).getDay() + 6) % 7;
    return formatDayLabel(monday, dayIndex);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Planning de la salle</h1>
        <div className="flex gap-2">
          <button className="btn" onClick={() => setWeekOffset((w) => w - 1)}>
            ← Semaine précédente
          </button>
          <button className="btn" onClick={() => setWeekOffset(0)}>
            Aujourd'hui
          </button>
          <button className="btn" onClick={() => setWeekOffset((w) => w + 1)}>
            Semaine suivante →
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {loading ? (
        <p>Chargement du planning...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100 w-20">Heure</th>
                {Array.from({ length: 5 }, (_, i) => (
                  <th key={i} className="border p-2 bg-gray-100">
                    {formatDayLabel(monday, i)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WORKING_HOURS.map((hour) => (
                <tr key={hour}>
                  <td className="border p-2 font-medium bg-gray-50">
                    {String(hour).padStart(2, "0")}h00
                  </td>
                  {Array.from({ length: 5 }, (_, dayIndex) => {
                    const reservation = findReservation(dayIndex, hour);
                    const mine = reservation?.user_id === user?.id;
                    const past = isPastSlot(monday, dayIndex, hour);
                    return (
                      <td
                        key={dayIndex}
                        onClick={() => handleCellClick(dayIndex, hour)}
                        className={`border p-2 align-top h-14 ${
                          reservation
                            ? mine
                              ? "bg-indigo-100 cursor-pointer hover:bg-indigo-200"
                              : "bg-red-50"
                            : past
                              ? "bg-gray-50 text-gray-300"
                              : "cursor-pointer hover:bg-green-50"
                        }`}
                      >
                        {reservation ? (
                          <div>
                            <p className="font-medium truncate">{reservation.title}</p>
                            <p className="text-xs text-gray-600">
                              {reservation.firstname} {reservation.lastname}
                            </p>
                          </div>
                        ) : (
                          !past && <span className="text-xs text-gray-400">Libre</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-4 mt-4 text-sm text-gray-600">
        <span><span className="inline-block w-3 h-3 bg-indigo-100 border mr-1" /> Mes réservations</span>
        <span><span className="inline-block w-3 h-3 bg-red-50 border mr-1" /> Occupé</span>
        <span><span className="inline-block w-3 h-3 bg-white border mr-1" /> Libre</span>
      </div>

      {modalState && (
        <ReservationModal
          slot={modalState.slot}
          reservation={modalState.reservation}
          dayLabel={dayLabelForModal()}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onDelete={modalState.mode === "edit" ? handleDelete : undefined}
        />
      )}
    </div>
  );
}

export default Planning;
