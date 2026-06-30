process.env.NODE_ENV = "test";

import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";
import pool, { query } from "../config/db.js";
import { futureSlot, uniqueEmail } from "./helpers.js";

const ownerEmail = uniqueEmail("owner");
const otherEmail = uniqueEmail("other");
const password = "password123";

let ownerToken;
let otherToken;
let reservationId;

before(async () => {
    const owner = await request(app).post("/api/auth/register").send({
        email: ownerEmail,
        password,
        firstname: "Alice",
        lastname: "Martin",
    });
    ownerToken = owner.body.token;

    const other = await request(app).post("/api/auth/register").send({
        email: otherEmail,
        password,
        firstname: "Bob",
        lastname: "Durand",
    });
    otherToken = other.body.token;
});

after(async () => {
    await query("DELETE FROM users WHERE email IN (?, ?)", [ownerEmail, otherEmail]);
    await pool.end();
});

describe("POST /api/reservations", () => {
    test("rejette un créneau passé (400)", async () => {
        const res = await request(app)
            .post("/api/reservations")
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({
                title: "Réunion passée",
                startTime: "2020-01-06T10:00:00",
                endTime: "2020-01-06T11:00:00",
            });
        assert.equal(res.status, 400);
    });

    test("crée une réservation valide (201)", async () => {
        const startTime = futureSlot(10);
        const endTime = futureSlot(11);
        const res = await request(app)
            .post("/api/reservations")
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({ title: "Réunion équipe", startTime, endTime });
        assert.equal(res.status, 201);
        assert.ok(res.body.reservation.id);
        reservationId = res.body.reservation.id;
    });

    test("rejette un créneau qui chevauche une réservation existante (409)", async () => {
        const startTime = futureSlot(10);
        const endTime = futureSlot(11);
        const res = await request(app)
            .post("/api/reservations")
            .set("Authorization", `Bearer ${otherToken}`)
            .send({ title: "Conflit", startTime, endTime });
        assert.equal(res.status, 409);
    });

    test("rejette sans authentification (401)", async () => {
        const res = await request(app)
            .post("/api/reservations")
            .send({ title: "Sans auth", startTime: futureSlot(12), endTime: futureSlot(13) });
        assert.equal(res.status, 401);
    });
});

describe("Modification / suppression", () => {
    test("refuse la modification par un autre utilisateur (403)", async () => {
        const res = await request(app)
            .put(`/api/reservations/${reservationId}`)
            .set("Authorization", `Bearer ${otherToken}`)
            .send({
                title: "Tentative de vol",
                startTime: futureSlot(10),
                endTime: futureSlot(11),
            });
        assert.equal(res.status, 403);
    });

    test("le propriétaire peut modifier sa réservation", async () => {
        const startTime = futureSlot(10);
        const endTime = futureSlot(12);
        const res = await request(app)
            .put(`/api/reservations/${reservationId}`)
            .set("Authorization", `Bearer ${ownerToken}`)
            .send({ title: "Réunion équipe (modifiée)", startTime, endTime });
        assert.equal(res.status, 200);
    });

    test("refuse la suppression par un autre utilisateur (403)", async () => {
        const res = await request(app)
            .delete(`/api/reservations/${reservationId}`)
            .set("Authorization", `Bearer ${otherToken}`);
        assert.equal(res.status, 403);
    });

    test("le propriétaire peut annuler sa réservation", async () => {
        const res = await request(app)
            .delete(`/api/reservations/${reservationId}`)
            .set("Authorization", `Bearer ${ownerToken}`);
        assert.equal(res.status, 200);
    });
});

describe("Lecture", () => {
    test("GET /api/reservations/user/me renvoie les réservations de l'utilisateur", async () => {
        const res = await request(app)
            .get("/api/reservations/user/me")
            .set("Authorization", `Bearer ${ownerToken}`);
        assert.equal(res.status, 200);
        assert.ok(Array.isArray(res.body));
    });

    test("GET /api/reservations/week/:date rejette un format de date invalide", async () => {
        const res = await request(app)
            .get("/api/reservations/week/pas-une-date")
            .set("Authorization", `Bearer ${ownerToken}`);
        assert.equal(res.status, 400);
    });
});
