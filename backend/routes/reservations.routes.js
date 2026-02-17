import { Router } from "express";
import {
    getAllReservations,
    getReservationsByWeek,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation,
    getMyReservations,
} from "../controllers/reservation.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

/**
 * GET /api/reservations
 * Récupérer toutes les réservations
 */
router.get("/", getAllReservations);

/**
 * GET /api/reservations/user/me
 * Mes réservations
 */
router.get("/user/me", getMyReservations);

/**
 * GET /api/reservations/week/:date
 * Réservations d'une semaine (date = lundi YYYY-MM-DD)
 */
router.get("/week/:date", getReservationsByWeek);

/**
 * GET /api/reservations/:id
 * Détails d'une réservation
 */
router.get("/:id", getReservationById);

/**
 * POST /api/reservations
 * Créer une réservation
 */
router.post("/", createReservation);

/**
 * PUT /api/reservations/:id
 * Modifier une réservation (propriétaire uniquement)
 */
router.put("/:id", updateReservation);

/**
 * DELETE /api/reservations/:id
 * Supprimer une réservation (propriétaire uniquement)
 */
router.delete("/:id", deleteReservation);

export default router;
