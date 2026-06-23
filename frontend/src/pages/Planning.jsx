import { useEffect, useState, useCallback, Fragment } from "react";
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

function isToday(date) {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function Planning() {
  const { user } = useAuth();
  const [weekOffset, setWeekOffset] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState(null); // { mode: 'create'|'edit', slot, reservation }

  const monday = addDays(getMonday(), weekOffset * 7);
  const currentHour = new Date().getHours();

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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Planning de la salle
        </h1>
        <div className="flex gap-2">
          <button className="btn" onClick={() => setWeekOffset((w) => w - 1)}>
            ← Précédente
          </button>
          <button className="btn btn-primary" onClick={() => setWeekOffset(0)}>
            Aujourd'hui
          </button>
          <button className="btn" onClick={() => setWeekOffset((w) => w + 1)}>
            Suivante →
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 dark:text-red-400 mb-3">{error}</p>}

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Chargement du planning...</p>
      ) : (
        <div className="card overflow-x-auto !p-0">
          <div
            className="grid min-w-[760px]"
            style={{ gridTemplateColumns: "70px repeat(5, 1fr)" }}
          >
            {/* En-tête des jours */}
            <div className="sticky left-0 bg-white dark:bg-gray-800" />
            {Array.from({ length: 5 }, (_, i) => {
              const today = isToday(addDays(monday, i));
              return (
                <div
                  key={i}
                  className={`px-2 py-3 text-center text-sm font-semibold border-b border-gray-200 dark:border-gray-700 ${
                    today
                      ? "text-brand-600 dark:text-brand-100"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {formatDayLabel(monday, i)}
                  {today && (
                    <span className="block w-1.5 h-1.5 rounded-full bg-brand-500 mx-auto mt-1" />
                  )}
                </div>
              );
            })}

            {/* Grille horaire */}
            {WORKING_HOURS.map((hour) => (
              <Fragment key={hour}>
                <div className="px-2 py-3 text-xs text-right text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700">
                  {String(hour).padStart(2, "0")}h
                </div>
                {Array.from({ length: 5 }, (_, dayIndex) => {
                  const reservation = findReservation(dayIndex, hour);
                  const mine = reservation?.user_id === user?.id;
                  const past = isPastSlot(monday, dayIndex, hour);
                  const today = isToday(addDays(monday, dayIndex));
                  const isNowRow = today && hour === currentHour;
                  return (
                    <div
                      key={`${dayIndex}-${hour}`}
                      onClick={() => handleCellClick(dayIndex, hour)}
                      className={`relative min-h-14 px-1.5 py-1 border-t border-l border-gray-100 dark:border-gray-700 transition-colors ${
                        today ? "bg-brand-50/40 dark:bg-brand-700/10" : ""
                      } ${
                        reservation
                          ? mine
                            ? "cursor-pointer"
                            : ""
                          : past
                            ? ""
                            : "cursor-pointer hover:bg-brand-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {isNowRow && (
                        <span className="absolute left-0 top-0 w-full h-0.5 bg-red-500" />
                      )}
                      {reservation ? (
                        <div
                          className={`h-full w-full rounded-lg px-2 py-1 text-xs leading-tight ${
                            mine
                              ? "bg-brand-500 text-white"
                              : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                          }`}
                        >
                          <p className="font-medium truncate">{reservation.title}</p>
                          <p className="opacity-80 truncate">
                            {reservation.firstname} {reservation.lastname}
                          </p>
                        </div>
                      ) : (
                        !past && (
                          <span className="text-[11px] text-gray-300 dark:text-gray-500">
                            Libre
                          </span>
                        )
                      )}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-brand-500" /> Mes réservations
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-gray-200 dark:bg-gray-600" /> Occupé
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded border border-gray-300 dark:border-gray-600" />{" "}
          Libre
        </span>
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
