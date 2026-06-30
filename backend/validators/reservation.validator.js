/**
 * VALIDATEURS MÉTIER - RÉSERVATIONS
 * Règles de gestion conformes au Brief Client
 */

/**
 * Valide que la date est un jour ouvré (Lundi-Vendredi)
 * @param {Date} date - Date à vérifier
 * @returns {boolean}
 */
export function isWeekday(date) {
    const day = date.getDay();
    return day >= 1 && day <= 5; // 0=Dimanche, 6=Samedi
}

/**
 * Valide que l'heure est dans la plage 8h-19h (heures pleines)
 * @param {Date} date - Date/heure à vérifier
 * @returns {boolean}
 */
export function isWithinWorkingHours(date, isEnd = false) {
    const hour = date.getHours();
    const minutes = date.getMinutes();
    if (minutes !== 0) return false;
    return isEnd ? (hour >= 9 && hour <= 19) : (hour >= 8 && hour < 19);
}

/**
 * Valide que la durée est d'au minimum 1h
 * @param {Date} startTime - Heure de début
 * @param {Date} endTime - Heure de fin
 * @returns {boolean}
 */
export function isMinimumDuration(startTime, endTime) {
    const durationMs = endTime - startTime;
    const durationHours = durationMs / (1000 * 60 * 60);
    return durationHours >= 1;
}

/**
 * Valide que la date de début n'est pas déjà passée
 * @param {Date} startTime - Heure de début
 * @returns {boolean}
 */
export function isNotInThePast(startTime) {
    return startTime.getTime() >= Date.now();
}

/**
 * Validation complète d'une réservation
 * @param {string} startTime - ISO 8601 string
 * @param {string} endTime - ISO 8601 string
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateReservation(startTime, endTime) {
    const errors = [];
    const start = new Date(startTime);
    const end = new Date(endTime);

    // 1. Dates valides
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        errors.push("Dates invalides");
        return { valid: false, errors };
    }

    // 2. Fin après début
    if (end <= start) {
        errors.push("L'heure de fin doit être après l'heure de début");
    }

    // 2bis. Pas de créneau passé
    if (!isNotInThePast(start)) {
        errors.push("Impossible de réserver un créneau déjà passé");
    }

    // 3. Jours ouvrés uniquement
    if (!isWeekday(start) || !isWeekday(end)) {
        errors.push("Réservations autorisées du lundi au vendredi uniquement");
    }

    // 4. Plage horaire 8h-19h (heures pleines)
    if (!isWithinWorkingHours(start, false)) {
        errors.push(
            "L'heure de début doit être entre 8h et 19h (heure pleine)",
        );
    }
    if (!isWithinWorkingHours(end, true)) {
        errors.push("L'heure de fin doit être entre 8h et 19h (heure pleine)");
    }

    // 5. Durée minimum 1h
    if (!isMinimumDuration(start, end)) {
        errors.push("La durée minimum est de 1 heure");
    }

    // 6. Même jour
    if (start.toDateString() !== end.toDateString()) {
        errors.push("La réservation doit se faire sur une seule journée");
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
