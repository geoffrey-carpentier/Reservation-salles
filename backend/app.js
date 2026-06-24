// app.js — construction de l'application Express (sans connexion DB ni écoute du port)
// Séparé de server.js pour permettre les tests d'intégration (supertest) sans ouvrir de port réseau.
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import reservationRoutes from "./routes/reservations.routes.js";

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error(
        "JWT_SECRET manquant ou trop court (min 32 caractères). " +
            "Génère-le avec : node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
    );
}

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Logger (dev)
if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
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
app.use("/api/reservations", reservationRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: "Route non trouvée" }));

export default app;
