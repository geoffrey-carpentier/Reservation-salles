// routes/auth.routes.js
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, getProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// Limite les tentatives pour prévenir le brute-force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { error: "Trop de tentatives, veuillez réessayer plus tard" },
    standardHeaders: true,
    legacyHeaders: false,
});

// Routes publiques
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// Routes protégées
router.get("/me", authMiddleware, getProfile);

export default router;
