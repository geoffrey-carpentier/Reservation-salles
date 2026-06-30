import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
    isWeekday,
    isWithinWorkingHours,
    isMinimumDuration,
    isNotInThePast,
    validateReservation,
} from "../validators/reservation.validator.js";

describe("isWeekday", () => {
    test("rejette le samedi et le dimanche", () => {
        assert.equal(isWeekday(new Date("2026-06-27T10:00:00")), false); // samedi
        assert.equal(isWeekday(new Date("2026-06-28T10:00:00")), false); // dimanche
    });
    test("accepte un jour de semaine", () => {
        assert.equal(isWeekday(new Date("2026-06-22T10:00:00")), true); // lundi
    });
});

describe("isWithinWorkingHours", () => {
    test("rejette avant 8h", () => {
        assert.equal(isWithinWorkingHours(new Date("2026-06-22T07:00:00")), false);
    });
    test("rejette une heure non pleine", () => {
        assert.equal(isWithinWorkingHours(new Date("2026-06-22T10:30:00")), false);
    });
    test("accepte une heure pleine dans la plage", () => {
        assert.equal(isWithinWorkingHours(new Date("2026-06-22T10:00:00")), true);
    });
    test("accepte 19h comme heure de fin mais pas comme heure de début", () => {
        assert.equal(isWithinWorkingHours(new Date("2026-06-22T19:00:00"), true), true);
        assert.equal(isWithinWorkingHours(new Date("2026-06-22T19:00:00"), false), false);
    });
});

describe("isMinimumDuration", () => {
    test("rejette une durée inférieure à 1h", () => {
        assert.equal(
            isMinimumDuration(new Date("2026-06-22T10:00:00"), new Date("2026-06-22T10:30:00")),
            false,
        );
    });
    test("accepte une durée d'1h exactement", () => {
        assert.equal(
            isMinimumDuration(new Date("2026-06-22T10:00:00"), new Date("2026-06-22T11:00:00")),
            true,
        );
    });
});

describe("isNotInThePast", () => {
    test("rejette une date passée", () => {
        assert.equal(isNotInThePast(new Date("2020-01-01T10:00:00")), false);
    });
    test("accepte une date future", () => {
        assert.equal(isNotInThePast(new Date(Date.now() + 86400000)), true);
    });
});

describe("validateReservation", () => {
    test("rejette un créneau le week-end", () => {
        const { valid, errors } = validateReservation(
            "2026-06-27T10:00:00",
            "2026-06-27T11:00:00",
        );
        assert.equal(valid, false);
        assert.ok(errors.some((e) => e.includes("lundi au vendredi")));
    });

    test("rejette un créneau passé", () => {
        const { valid, errors } = validateReservation(
            "2020-01-06T10:00:00",
            "2020-01-06T11:00:00",
        );
        assert.equal(valid, false);
        assert.ok(errors.some((e) => e.includes("passé")));
    });

    test("rejette une durée inférieure à 1h", () => {
        const future = new Date(Date.now() + 7 * 86400000);
        future.setHours(10, 0, 0, 0);
        const end = new Date(future.getTime() + 30 * 60000);
        const { valid, errors } = validateReservation(
            future.toISOString(),
            end.toISOString(),
        );
        assert.equal(valid, false);
        assert.ok(errors.some((e) => e.includes("durée minimum")));
    });

    test("accepte un créneau valide dans le futur", () => {
        const future = new Date(Date.now() + 7 * 86400000);
        // S'assure de tomber sur un jour ouvré
        while (!isWeekday(future)) future.setDate(future.getDate() + 1);
        future.setHours(10, 0, 0, 0);
        const end = new Date(future.getTime() + 60 * 60000);
        const { valid, errors } = validateReservation(
            future.toISOString(),
            end.toISOString(),
        );
        assert.deepEqual(errors, []);
        assert.equal(valid, true);
    });
});
