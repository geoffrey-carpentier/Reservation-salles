process.env.NODE_ENV = "test";

import { test, describe, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";
import pool, { query } from "../config/db.js";
import { uniqueEmail } from "./helpers.js";

const email = uniqueEmail("auth");
const password = "password123";

after(async () => {
    await query("DELETE FROM users WHERE email = ?", [email]);
    await pool.end();
});

describe("POST /api/auth/register", () => {
    test("crée un compte avec des données valides", async () => {
        const res = await request(app).post("/api/auth/register").send({
            email,
            password,
            firstname: "Jean",
            lastname: "Dupont",
        });
        assert.equal(res.status, 201);
        assert.ok(res.body.token);
        assert.equal(res.body.user.email, email);
        assert.equal(res.body.user.password, undefined);
    });

    test("rejette un email déjà utilisé (409)", async () => {
        const res = await request(app).post("/api/auth/register").send({
            email,
            password,
            firstname: "Jean",
            lastname: "Dupont",
        });
        assert.equal(res.status, 409);
    });

    test("rejette un email mal formé (400)", async () => {
        const res = await request(app).post("/api/auth/register").send({
            email: "pas-un-email",
            password,
            firstname: "Jean",
            lastname: "Dupont",
        });
        assert.equal(res.status, 400);
    });

    test("rejette un mot de passe trop court (400)", async () => {
        const res = await request(app).post("/api/auth/register").send({
            email: uniqueEmail("auth-short"),
            password: "123",
            firstname: "Jean",
            lastname: "Dupont",
        });
        assert.equal(res.status, 400);
    });
});

describe("POST /api/auth/login", () => {
    test("connecte avec les bons identifiants", async () => {
        const res = await request(app).post("/api/auth/login").send({ email, password });
        assert.equal(res.status, 200);
        assert.ok(res.body.token);
    });

    test("rejette un mauvais mot de passe (401)", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email, password: "mauvais-mdp" });
        assert.equal(res.status, 401);
    });
});

describe("GET /api/auth/me", () => {
    test("rejette sans token (401)", async () => {
        const res = await request(app).get("/api/auth/me");
        assert.equal(res.status, 401);
    });

    test("renvoie le profil avec un token valide", async () => {
        const login = await request(app).post("/api/auth/login").send({ email, password });
        const res = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${login.body.token}`);
        assert.equal(res.status, 200);
        assert.equal(res.body.user.email, email);
    });
});
