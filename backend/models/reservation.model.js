import { query } from "../config/db.js";

/**
 * MODÈLE RESERVATION
 * Gestion des réservations de salle selon le cahier des charges
 */

export const Reservation = {
    /**
     * Créer une réservation
     * @param {number} userId - ID de l'utilisateur
     * @param {number} roomId - ID de la salle (défaut 1)
     * @param {string} title - Objet de la réunion
     * @param {string} startTime - Date/heure début (format: YYYY-MM-DD HH:00:00)
     * @param {string} endTime - Date/heure fin (format: YYYY-MM-DD HH:00:00)
     * @returns {Promise<Object>} Réservation créée
     */
    async create({ userId, roomId = 1, title, startTime, endTime }) {
        const sql = `
      INSERT INTO reservations (user_id, room_id, title, start_time, end_time)
      VALUES (?, ?, ?, ?, ?)
    `;
        const result = await query(sql, [
            userId,
            roomId,
            title,
            startTime,
            endTime,
        ]);
        return {
            id: result.insertId,
            userId,
            roomId,
            title,
            startTime,
            endTime,
        };
    },

    /**
     * Récupérer toutes les réservations avec informations utilisateur (US-04.2 MUST)
     * @returns {Promise<Array>} Liste des réservations
     */
    async findAll() {
        const sql = `
      SELECT 
        r.id,
        r.title,
        r.start_time,
        r.end_time,
        r.created_at,
        u.id AS user_id,
        u.firstname,
        u.lastname,
        u.email
      FROM reservations r
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.start_time ASC
    `;
        return await query(sql);
    },

    /**
     * Récupérer les réservations d'une semaine spécifique
     * @param {string} weekStart - Date du lundi (format: YYYY-MM-DD)
     * @returns {Promise<Array>} Réservations de la semaine
     */
    async findByWeek(weekStart) {
        const sql = `
      SELECT 
        r.id,
        r.title,
        r.start_time,
        r.end_time,
        u.firstname,
        u.lastname
      FROM reservations r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE DATE(r.start_time) >= ? 
        AND DATE(r.start_time) < DATE_ADD(?, INTERVAL 5 DAY)
      ORDER BY r.start_time ASC
    `;
        return await query(sql, [weekStart, weekStart]);
    },

    /**
     * Récupérer une réservation par ID
     * @param {number} id - ID de la réservation
     * @returns {Promise<Object|null>} Réservation trouvée ou null
     */
    async findById(id) {
        const sql = `
      SELECT 
        r.*,
        u.firstname,
        u.lastname,
        u.email
      FROM reservations r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `;
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    /**
     * Mettre à jour une réservation
     * @param {number} id - ID de la réservation
     * @param {Object} data - Données à modifier
     * @returns {Promise<boolean>} Succès
     */
    async update(id, { title, startTime, endTime }) {
        const sql = `
      UPDATE reservations 
      SET title = ?, start_time = ?, end_time = ?
      WHERE id = ?
    `;
        const result = await query(sql, [title, startTime, endTime, id]);
        return result.affectedRows > 0;
    },

    /**
     * Supprimer une réservation
     * @param {number} id - ID de la réservation
     * @returns {Promise<boolean>} Succès
     */
    async delete(id) {
        const sql = "DELETE FROM reservations WHERE id = ?";
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    },

    /**
     * Vérifier si un créneau est disponible (détection chevauchement)
     * @param {string} startTime - Heure de début
     * @param {string} endTime - Heure de fin
     * @param {number} roomId - ID de la salle (défaut 1)
     * @param {number|null} excludeId - ID réservation à exclure (pour modification)
     * @returns {Promise<boolean>} True si disponible
     */
    async isSlotAvailable(startTime, endTime, roomId = 1, excludeId = null) {
        let sql = `
      SELECT COUNT(*) as count
      FROM reservations
      WHERE room_id = ?
        AND (
          (start_time < ? AND end_time > ?)
          OR (start_time < ? AND end_time > ?)
          OR (start_time >= ? AND end_time <= ?)
        )
    `;
        const params = [
            roomId,
            endTime,
            startTime,
            endTime,
            startTime,
            startTime,
            endTime,
        ];

        if (excludeId) {
            sql += " AND id != ?";
            params.push(excludeId);
        }

        const result = await query(sql, params);
        return result[0].count === 0;
    },

    /**
     * Récupérer les réservations d'un utilisateur
     * @param {number} userId - ID de l'utilisateur
     * @returns {Promise<Array>} Liste des réservations
     */
    async findByUser(userId) {
        const sql = `
      SELECT * FROM reservations
      WHERE user_id = ?
      ORDER BY start_time DESC
    `;
        return await query(sql, [userId]);
    },
};
