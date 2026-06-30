import { isWeekday } from "../validators/reservation.validator.js";

const pad = (n) => String(n).padStart(2, "0");

// Renvoie une date/heure future, sur un jour ouvré, au format attendu par l'API (sans timezone)
export function futureSlot(hour, daysAhead = 7) {
    const date = new Date(Date.now() + daysAhead * 86400000);
    while (!isWeekday(date)) date.setDate(date.getDate() + 1);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(hour)}:00:00`;
}

export function uniqueEmail(prefix) {
    return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 10000)}@test.local`;
}
