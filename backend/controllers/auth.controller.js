// controllers/auth.controller.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Génère un token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );
};
// POST /api/auth/register
export const register = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;
        const firstname = req.body.firstname?.trim();
        const lastname = req.body.lastname?.trim();

        if (!email || !password || !firstname || !lastname) {
            return res
                .status(400)
                .json({ error: "Tous les champs sont requis" });
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: "Format d'email invalide" });
        }
        if (password.length < 6) {
            return res
                .status(400)
                .json({ error: "Le mot de passe doit contenir au moins 6 caractères" });
        }
        if (firstname.length > 100 || lastname.length > 100) {
            return res
                .status(400)
                .json({ error: "Prénom/nom trop long (100 caractères max)" });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "Email déjà utilisé" });
        }
        const user = await User.create({
            email,
            password,
            firstname,
            lastname,
        });
        const token = generateToken(user);
        res.status(201).json({ message: "Inscription réussie", user, token });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};
// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email et mot de passe requis" });
        }

        const user = await User.findByEmail(email);
        if (!user || !(await User.verifyPassword(password, user.password))) {
            return res.status(401).json({ error: "Identifiants incorrects" });
        }
        const token = generateToken(user);
        res.json({
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};
// GET /api/auth/me
export const getProfile = async (req, res) => {
    res.json({ user: req.user });
};
