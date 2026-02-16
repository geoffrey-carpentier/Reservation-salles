import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "reservation_salle",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Fonction utilitaire pour les requêtes
export async function query(sql, params = []) {
    const [results] = await pool.execute(sql, params);
    return results;
}
// Test de connexion au démarrage
export async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL connecté à', process.env.DB_NAME);
        connection.release();
        return true;
    } catch (error) {
        console.error("❌ Erreur MySQL:", error.message);
        process.exit(1); // ✅ Arrête le serveur si BDD inaccessible
    }
}
export default pool;
