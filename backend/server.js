//server JS
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { testConnection } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import reservationRoutes from "./routes/reservations.routes.js"; // ✅ AJOUT

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error(
        "JWT_SECRET manquant ou trop court (min 32 caractères). " +
            "Génère-le avec : node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
    );
}

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion BDD
testConnection();

// Middleware
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Logger (dev)
if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
        next();
    });
}

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "API Réservation de Salle - TechSpace Solutions",
        status: "online",
    });
});

/*
 POST   /api/auth/register
 POST   /api/auth/login
 GET    /api/auth/me
*/
app.use("/api/auth", authRoutes);

/*
 GET    /api/reservations
 GET    /api/reservations/week/:date
 GET    /api/reservations/user/me
 GET    /api/reservations/:id
 POST   /api/reservations
 PUT    /api/reservations/:id
 DELETE /api/reservations/:id
*/
app.use("/api/reservations", reservationRoutes); // ✅ AJOUT

// 404
app.use((req, res) => res.status(404).json({ error: "Route non trouvée" }));

// Démarrage
app.listen(PORT, () => {
    console.log(`Serveur sur http://localhost:${PORT}`);
});
