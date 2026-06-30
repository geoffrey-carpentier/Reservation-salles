// Plage horaire de la salle : 8h-19h, jours ouvrés lun-ven (cf. Brief Client)
export const WORKING_HOURS = Array.from({ length: 11 }, (_, i) => 8 + i); // [8..18]
export const WEEKDAY_LABELS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const pad = (n) => String(n).padStart(2, "0");

export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getMonday(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = dimanche
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function buildSlotDateTime(monday, dayIndex, hour) {
  const day = addDays(monday, dayIndex);
  return `${toISODate(day)}T${pad(hour)}:00:00`;
}

export function formatDayLabel(monday, dayIndex) {
  const day = addDays(monday, dayIndex);
  return `${WEEKDAY_LABELS[dayIndex]} ${pad(day.getDate())}/${pad(day.getMonth() + 1)}`;
}

export function isPastSlot(monday, dayIndex, hour) {
  const slot = new Date(buildSlotDateTime(monday, dayIndex, hour));
  return slot.getTime() < Date.now();
}
