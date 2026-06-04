import { Reservation } from "../models/reservation.model.js";
import { validateReservation } from "../validators/reservation.validator.js";

/**
 * CONTROLLER RESERVATIONS
 * Gestion des réservations de salle
 */

/**
 * GET /api/reservations
 * Récupérer toutes les réservations (avec infos utilisateur)
 */
export const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll();
        res.json(reservations);
    } catch (error) {
        console.error("Erreur getAllReservations:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

/**
 * GET /api/reservations/week/:date
 * Récupérer les réservations d'une semaine
 * @param date - Date du lundi (YYYY-MM-DD)
 */
export const getReservationsByWeek = async (req, res) => {
    try {
        const { date } = req.params;

        // Validation format date
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res
                .status(400)
                .json({ message: "Format date invalide (YYYY-MM-DD attendu)" });
        }

        const reservations = await Reservation.findByWeek(date);
        res.json(reservations);
    } catch (error) {
        console.error("Erreur getReservationsByWeek:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

/**
 * GET /api/reservations/:id
 * Récupérer une réservation par ID
 */
export const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id);

        if (!reservation) {
            return res.status(404).json({ message: "Réservation introuvable" });
        }

        res.json(reservation);
    } catch (error) {
        console.error("Erreur getReservationById:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

/**
 * POST /api/reservations
 * Créer une réservation
 * Body: { title, startTime, endTime }
 */
export const createReservation = async (req, res) => {
    try {
        const { title, startTime, endTime } = req.body;
        const userId = req.user.id; // Récupéré via authMiddleware

        // Validation champs requis
        if (!title || !startTime || !endTime) {
            return res.status(400).json({
                message: "Champs requis : title, startTime, endTime",
            });
        }

        // Validation règles métier
        const validation = validateReservation(startTime, endTime);
        if (!validation.valid) {
            return res.status(400).json({
                message: "Validation échouée",
                errors: validation.errors,
            });
        }

        // Vérification disponibilité
        const isAvailable = await Reservation.isSlotAvailable(
            startTime,
            endTime,
        );
        if (!isAvailable) {
            return res.status(409).json({
                message: "Créneau déjà réservé",
            });
        }

        // Création
        const reservation = await Reservation.create({
            userId,
            title,
            startTime,
            endTime,
        });

        res.status(201).json({
            message: "Réservation créée avec succès",
            reservation,
        });
    } catch (error) {
        console.error("Erreur createReservation:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

/**
 * PUT /api/reservations/:id
 * Modifier une réservation (propriétaire uniquement)
 */
export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, startTime, endTime } = req.body;
        const userId = req.user.id;

        // Validation des champs requis
        if (!title || !startTime || !endTime) {
            return res.status(400).json({
                message: "Champs requis : title, startTime, endTime",
            });
        }

        // Vérifier que la réservation existe
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({ message: "Réservation introuvable" });
        }

        // Seul le propriétaire peut modifier
        if (reservation.user_id !== userId) {
            return res.status(403).json({
                message:
                    "Non autorisé : vous ne pouvez modifier que vos propres réservations",
            });
        }

        // Validation règles métier
        const validation = validateReservation(startTime, endTime);
        if (!validation.valid) {
            return res.status(400).json({
                message: "Validation échouée",
                errors: validation.errors,
            });
        }

        // Vérification disponibilité (exclure cette réservation)
        const isAvailable = await Reservation.isSlotAvailable(
            startTime,
            endTime,
            1,
            parseInt(id),
        );
        if (!isAvailable) {
            return res.status(409).json({
                message: "Créneau déjà réservé",
            });
        }

        // Mise à jour
        const success = await Reservation.update(id, {
            title,
            startTime,
            endTime,
        });
        if (!success) {
            return res.status(500).json({ message: "Échec de la mise à jour" });
        }

        res.json({ message: "Réservation mise à jour avec succès" });
    } catch (error) {
        console.error("Erreur updateReservation:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

/**
 * DELETE /api/reservations/:id
 * Supprimer une réservation (propriétaire uniquement)
 */
export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Vérifier que la réservation existe
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({ message: "Réservation introuvable" });
        }

        // Seul le propriétaire peut supprimer
        if (reservation.user_id !== userId) {
            return res.status(403).json({
                message:
                    "Non autorisé : vous ne pouvez supprimer que vos propres réservations",
            });
        }

        // Suppression
        const success = await Reservation.delete(id);
        if (!success) {
            return res.status(500).json({ message: "Échec de la suppression" });
        }

        res.json({ message: "Réservation supprimée avec succès" });
    } catch (error) {
        console.error("Erreur deleteReservation:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

/**
 * GET /api/reservations/user/me
 * Récupérer les réservations de l'utilisateur connecté
 */
export const getMyReservations = async (req, res) => {
    try {
        const userId = req.user.id;
        const reservations = await Reservation.findByUser(userId);
        res.json(reservations);
    } catch (error) {
        console.error("Erreur getMyReservations:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
