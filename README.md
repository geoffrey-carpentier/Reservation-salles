# Réservation de Salle - TechSpace Solutions

## 📌 État du projet

- **Version actuelle :** V1.0 (MVP en cours)
- **Dernière mise à jour :** 17 février 2025
- **Statut :** 🚧 Backend 100% - Frontend en attente

---

## 🎯 Objectif

Application Intranet de réservation de salle pour 50 collaborateurs.  
**Salle unique** en V1, évolutif vers plusieurs salles en V2.

---

## ✅ Fonctionnalités implémentées

### **Backend (100% Fonctionnel)**

- [x] Authentification JWT (inscription/connexion)
- [x] Route GET /api/auth/me (profil utilisateur)
- [x] Modèle User (CRUD complet)
- [x] Modèle Reservation (CRUD + détection chevauchement)
- [x] Validators métier (plage horaire 8h-19h, jours ouvrés, durée min 1h)
- [x] Controller Reservation (7 endpoints)
- [x] Routes API /api/reservations (toutes protégées JWT)
- [x] Middleware authentification
- [x] Protection propriétaire (update/delete)

### **Frontend**

- [x] Pages Login/Register
- [x] Dashboard protégé
- [x] Context Auth (React)
- [x] Tailwind CSS v4 configuré
- [ ] Vue Planning hebdomadaire
- [ ] Formulaire création réservation
- [ ] Modification/Annulation réservation

---

## 📦 Installation

### **Prérequis**

- Node.js >= 18.0.0
- MySQL (Laragon recommandé)
- Git

### **1. Cloner le projet**

```bash
git clone https://github.com/geoffrey-carpentier/Reservation-salles.git
cd Reservation-salles
git checkout dev
```

### **2. Backend**

```bash
cd backend
npm install

# Configurer .env (voir .env.example)
# Initialiser la base de données
mysql -u root < schema.sql

# Démarrer le serveur
npm run dev
# ✅ Serveur sur http://localhost:5000
```

### **3. Frontend**

```bash
cd frontend
npm install

# Démarrer le dev server
npm run dev
# ✅ Interface sur http://localhost:5173
```

---

## 🏗️ Architecture Technique

### **Stack**

- **Frontend :** React 19 + Vite + React Router + Tailwind CSS v4
- **Backend :** Node.js + Express + MySQL2
- **Auth :** JWT + bcrypt

### **Structure Backend**

```markdown
backend/
├── config/db.js              # ✅ Connexion MySQL
├── models/
│   ├── user.model.js         # ✅ CRUD utilisateurs
│   └── reservation.model.js  # ✅ CRUD réservations + chevauchement
├── controllers/
│   ├── auth.controller.js    # ✅ Register, Login, Me
│   └── reservation.controller.js # ✅ 7 endpoints
├── validators/
│   └── reservation.validator.js # ✅ Règles métier
├── middlewares/
│   └── auth.middleware.js    # ✅ Vérification JWT
└── routes/
    ├── auth.routes.js        # ✅ /api/auth/*
    └── reservations.routes.js # ✅ /api/reservations/*
```

---

## 📚 API Endpoints

### **Authentification**

| Méthode | Endpoint             | Auth | Description        |
| ------- | -------------------- | ---- | ------------------ |
| POST    | `/api/auth/register` | ❌   | Inscription        |
| POST    | `/api/auth/login`    | ❌   | Connexion (JWT)    |
| GET     | `/api/auth/me`       | ✅   | Profil utilisateur |

### **Réservations** (Toutes protégées JWT ✅)

| Méthode | Endpoint                       | Description                                   |
| ------- | ------------------------------ | --------------------------------------------- |
| GET     | `/api/reservations`            | Toutes les réservations (avec infos user)     |
| GET     | `/api/reservations/week/:date` | Réservations d'une semaine (lundi YYYY-MM-DD) |
| GET     | `/api/reservations/user/me`    | Mes réservations                              |
| GET     | `/api/reservations/:id`        | Détails d'une réservation                     |
| POST    | `/api/reservations`            | Créer réservation (title, startTime, endTime) |
| PUT     | `/api/reservations/:id`        | Modifier (propriétaire uniquement)            |
| DELETE  | `/api/reservations/:id`        | Supprimer (propriétaire uniquement)           |

---

## 📚 Règles de Gestion

### **Contraintes Horaires**

- ✅ Lundi au vendredi uniquement
- ✅ Plage horaire : 8h - 19h (heures pleines uniquement)
- ✅ Durée minimum : 1 heure
- ✅ Pas de réservation sur plusieurs jours
- ✅ Détection automatique des chevauchements

### **Sécurité**

- ✅ Authentification obligatoire (JWT)
- ✅ Passwords hashés (bcrypt)
- ✅ Tokens expiration 7 jours
- ✅ Requêtes préparées (protection SQL injection)
- ✅ Validation côté serveur (validators)
- ✅ Autorisation propriétaire (update/delete)

### **Codes HTTP**

- `200` OK
- `201` Created
- `400` Bad Request (validation échouée)
- `401` Unauthorized (token manquant/invalide)
- `403` Forbidden (pas propriétaire)
- `404` Not Found
- `409` Conflict (créneau déjà réservé)
- `500` Internal Server Error

---

## 🧪 Tests Manuels (Backend)

### **1. S'inscrire**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "Test1234",
    "firstname": "John",
    "lastname": "Doe"
  }'
```

### **2. Se connecter**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "Test1234"
  }'
```

**Copier le `token` retourné**

### **3. Créer une réservation**

```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "title": "Réunion équipe",
    "startTime": "2025-02-17T14:00:00",
    "endTime": "2025-02-17T16:00:00"
  }'
```

### **4. Voir toutes les réservations**

```bash
curl http://localhost:5000/api/reservations \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

---

## 📋 Prochaines Étapes

### **Phase 5 : Frontend Planning** (En attente)

- [ ] Composant Planning hebdomadaire (grille 8h-19h)
- [ ] Composant ReservationCard
- [ ] Formulaire création/modification
- [ ] Intégration API (axios)
- [ ] Gestion états (loading, erreurs)

### **Phase 6 : Tests & Livrable MVP**

- [ ] Tests Postman collection complète
- [ ] Tests manuels frontend
- [ ] Documentation utilisateur
- [ ] Démo vidéo

---

## 👥 Équipe

**Développeur :** Geoffrey Carpentier  
**Client :** TechSpace Solutions  
**Formateur :** La Plateforme\_

---

## 📄 Licence

Projet pédagogique - Tous droits réservés
