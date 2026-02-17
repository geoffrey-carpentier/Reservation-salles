# Réservation de Salle - TechSpace Solutions

## 📌 État du projet

- Version actuelle : V1.0 (MVP)
- Dernière mise à jour : [Date]
- Statut : 🚧 En développement

## 🎯 Objectif

Application Intranet de réservation de salle pour 50 collaborateurs.  
**Salle unique** en V1, évolutif vers plusieurs salles en V2.

---

## ✅ Fonctionnalités implémentées

### **Backend**

- [x] Authentification JWT (inscription/connexion)
      [ ] Planning hebdomadaire (Lun-Ven)
- [x] Route GET /api/auth/me (profil utilisateur)
- [x] Modèle User (CRUD complet)
- [x] Middleware authentification
- [x] **Modèle Reservation** (CRUD + détection chevauchement)
- [x] **Validators métier** (plage horaire, jours ouvrés, durée min)

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

```
backend/
├── config/db.js          # Connexion MySQL
├── models/
│   ├── user.model.js     # ✅
│   └── reservation.model.js  # ✅
├── controllers/
│   └── auth.controller.js    # ✅
├── validators/
│   └── reservation.validator.js # ✅
├── middlewares/
│   └── auth.middleware.js    # ✅
└── routes/
    ├── auth.routes.js        # ✅
    └── reservations.routes.js # 🚧 En cours
```

---

## 📚 Règles de Gestion (Brief Client)

### **Contraintes Horaires**

- ✅ Lundi au vendredi uniquement
- ✅ Plage horaire : 8h - 19h (heures pleines)
- ✅ Durée minimum : 1 heure
- ✅ Pas de réservation sur plusieurs jours

### **Sécurité**

- ✅ Authentification obligatoire pour toutes les actions
- ✅ Passwords hashés (bcrypt)
- ✅ Tokens JWT (expiration 7 jours)
- ✅ Requêtes préparées (protection SQL injection)

---

## 🧪 Tests Manuels

### **Backend (Postman/cURL)**

```bash
# Test connexion BDD
curl http://localhost:5000/

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234","firstname":"John","lastname":"Doe"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234"}'
```

---

## 📋 Prochaines Étapes (Phase 4 en cours)

- [x] Modèle Reservation
- [x] Validators métier
- [ ] Controller Reservation (CRUD complet)
- [ ] Routes API reservations
- [ ] Tests Postman
- [ ] Intégration Frontend

---

## 👥 Équipe

**Développeur :** Geoffrey Carpentier  
**Client :** TechSpace Solutions  
**Formateur :** La Plateforme\_

---

## 📄 Licence

Projet pédagogique - Tous droits réservés
