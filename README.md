# Réservation de Salle — TechSpace Solutions

Application web de réservation de la salle de réunion de TechSpace Solutions.
Remplace la gestion artisanale (post-its, emails, tableau blanc) par un planning numérique partagé, sans conflits de double réservation.

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Architecture du projet](#architecture-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Initialisation de la base de données](#initialisation-de-la-base-de-données)
- [Lancement de l'application](#lancement-de-lapplication)
- [Build de production](#build-de-production)
- [Documentation de l'API](#documentation-de-lapi)
- [Règles métier](#règles-métier)
- [Sécurité](#sécurité)
- [Plan de tests manuels](#plan-de-tests-manuels)
- [Hors scope V1](#hors-scope-v1--pistes-v2)

---

## Fonctionnalités

- **Authentification** : inscription (email + mot de passe), connexion / déconnexion, consultation du profil.
- **Planning** : vue hebdomadaire (lundi-vendredi, 8h-19h) des créneaux libres et occupés, avec le nom du collaborateur ayant réservé chaque créneau.
- **Réservations** : réserver un créneau libre (objet de la réunion, durée), modifier ou annuler sa propre réservation.
- **Règles métier appliquées côté front et revérifiées côté back** : jours ouvrés, horaires 8h-19h, durée minimum 1h, pas de créneau passé, pas de chevauchement, seul le créateur peut modifier/annuler sa réservation.
- **Thème clair / sombre** : bascule manuelle (persistée en `localStorage`, respecte la préférence système par défaut).

## Stack technique

| Couche | Technologies |
|---|---|
| **Frontend** | React 19, Vite 7, React Router 7, Tailwind CSS 4 |
| **Backend** | Node.js ≥18, Express 5, MySQL (`mysql2`), JWT (`jsonwebtoken`), `bcrypt`, `helmet`, `express-rate-limit` |
| **Base de données** | MySQL 8+ |
| **Outils** | ESLint, Git |

## Architecture du projet

```text
Reservation-salles/
├── backend/                    # API REST Node.js/Express
│   ├── config/
│   │   └── db.js               # Pool de connexion MySQL (mysql2/promise)
│   ├── controllers/            # Logique des routes (auth, reservations)
│   ├── middlewares/
│   │   └── auth.middleware.js  # Vérification du JWT (Bearer token)
│   ├── models/                 # Accès aux données (requêtes préparées)
│   ├── routes/                 # Définition des routes Express
│   ├── validators/
│   │   └── reservation.validator.js  # Règles métier (horaires, chevauchement, etc.)
│   ├── schema.sql              # Script de création de la base de données
│   ├── server.js               # Point d'entrée de l'API
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # Application React (SPA)
│   ├── public/
│   │   └── .htaccess           # Fallback SPA + headers, utile uniquement si le build est servi par Apache
│   ├── src/
│   │   ├── components/         # Header, Footer, PrivateRoute, ReservationModal, ThemeToggle...
│   │   ├── contexts/           # AuthContext, ThemeContext (état global auth / thème)
│   │   ├── hooks/               # useAuth, useTheme
│   │   ├── layouts/             # MainLayout (avec Header/Footer), AuthLayout (plein écran)
│   │   ├── pages/                # Home, Login, Register, Dashboard, Planning, Profile
│   │   ├── services/
│   │   │   └── api.js           # Client HTTP (authService, reservationService)
│   │   └── utils/
│   │       └── date.js          # Helpers de calcul de semaine/créneaux
│   ├── .env.example
│   └── package.json
│
├── package.json                 # Orchestration racine (concurrently : npm run dev)
└── .ressources/                  # Documentation projet (CDC, brief client, maquettes...) — non versionnée
```

## Prérequis

- [Node.js](https://nodejs.org/) ≥ 18
- [MySQL](https://www.mysql.com/) ≥ 8 (ou MariaDB équivalent — fourni par défaut avec [Laragon](https://laragon.org/))
- npm (fourni avec Node.js)

## Installation

```bash
# 1. Cloner le dépôt
git clone <url-du-repo> Reservation-salles
cd Reservation-salles

# 2. Installer les dépendances (racine, backend, frontend en une commande)
npm install
npm run install:all
```

> Le `package.json` à la racine ne sert qu'à orchestrer le lancement simultané du backend et du frontend (via `concurrently`) — chaque application garde ses propres dépendances et son propre `package.json`.

## Variables d'environnement

### Backend (`backend/.env`)

Copier `backend/.env.example` vers `backend/.env` et adapter les valeurs :

```env
# Serveur
PORT=5000
NODE_ENV=development

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=reservation_salle

# JSON Web Token
JWT_SECRET=                # Voir commande de génération ci-dessous — OBLIGATOIRE, min. 32 caractères
JWT_EXPIRES_IN=7d
```

Générer un `JWT_SECRET` fort :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

> Le serveur refuse de démarrer si `JWT_SECRET` est absent ou trop court (voir `backend/server.js`).

### Frontend (`frontend/.env`)

Copier `frontend/.env.example` vers `frontend/.env` :

```env
VITE_API_URL=http://localhost:5000/api
```

## Initialisation de la base de données

```bash
# Avec le client MySQL (adapter l'utilisateur si besoin)
mysql -u root -p < backend/schema.sql
```

Le script crée la base `reservation_salle`, les tables `users`, `rooms`, `reservations` (avec contraintes de clés étrangères et index), et insère la salle unique de la V1 (`id=1`).

## Lancement de l'application

**Option 1 — une seule commande (recommandé)**, depuis la racine du projet :

```bash
npm run dev
```

Lance le backend (`:5000`) et le frontend (`:5173`) en parallèle dans le même terminal (via `concurrently`), avec un préfixe `[BACKEND]`/`[FRONTEND]` sur chaque ligne de log.

**Option 2 — deux terminaux séparés** (utile pour isoler les logs) :

```bash
# Terminal 1 — backend (http://localhost:5000)
cd backend
npm run dev      # node --watch server.js

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173) dans le navigateur.

## Build de production

```bash
cd frontend
npm run build      # génère frontend/dist/
npm run preview    # prévisualiser le build localement
```

Le dossier `frontend/dist/` peut être servi par Apache (le `.htaccess` inclus gère le fallback SPA pour React Router). Le backend, lui, se lance toujours avec `node server.js` (ou un gestionnaire de process comme PM2 en production) — il n'est pas concerné par Apache/`.htaccess`.

## Documentation de l'API

Base URL : `http://localhost:5000/api`

| Verbe | Endpoint | Description | Auth requise |
|---|---|---|---|
| POST | `/auth/register` | Inscription | Non |
| POST | `/auth/login` | Connexion | Non |
| GET | `/auth/me` | Profil de l'utilisateur connecté | Oui |
| GET | `/reservations` | Liste de toutes les réservations | Oui |
| GET | `/reservations/week/:date` | Réservations de la semaine (`date` = lundi, `YYYY-MM-DD`) | Oui |
| GET | `/reservations/user/me` | Réservations de l'utilisateur connecté | Oui |
| GET | `/reservations/:id` | Détail d'une réservation | Oui |
| POST | `/reservations` | Créer une réservation | Oui |
| PUT | `/reservations/:id` | Modifier sa réservation | Oui (propriétaire) |
| DELETE | `/reservations/:id` | Annuler sa réservation | Oui (propriétaire) |

Authentification : header `Authorization: Bearer <token>` (token JWT retourné par `/auth/login` ou `/auth/register`).

## Règles métier

| Règle | Détail |
|---|---|
| Jours ouvrés | Lundi à vendredi uniquement |
| Horaires | 8h00 à 19h00 |
| Durée minimum | 1 heure |
| Créneau passé | Réservation impossible |
| Chevauchement | Un créneau = une seule réservation |
| Permissions | Seul le créateur peut modifier/annuler sa réservation |

## Sécurité

- Mots de passe hashés avec `bcrypt` (10 rounds).
- Authentification par JWT (Bearer token), vérifié sur toutes les routes protégées.
- Requêtes SQL exclusivement paramétrées (`mysql2`, protection injection SQL).
- Headers de sécurité HTTP via `helmet`.
- Rate-limiting sur `/auth/login` et `/auth/register` (anti brute-force).
- Validation des entrées (format email, longueurs de champs) côté backend.
- Secrets (`.env`) non versionnés (`.gitignore`).

## Tests automatisés (backend)

```bash
cd backend
npm test      # node --test (runner intégré à Node.js, aucune dépendance supplémentaire requise)
```

32 tests (unitaires sur les règles métier + intégration API avec `supertest`) couvrant l'inscription, la connexion, les permissions (403 si non-propriétaire), la création/modification/annulation de réservation, le rejet des créneaux passés et des chevauchements (409). Les tests s'exécutent contre la base configurée dans `.env` et nettoient leurs données après exécution.

## Plan de tests manuels

Scénarios à exécuter pour valider le MVP (backend lancé sur `:5000`, frontend sur `:5173`) :

1. **Inscription** : créer un compte avec un email valide → redirection vers le dashboard, token reçu.
2. **Inscription refusée** : email déjà utilisé (409), email mal formé (400), mot de passe < 6 caractères (400).
3. **Connexion** : avec les identifiants créés → succès ; avec un mauvais mot de passe → 401.
4. **Profil** : la page `/profile` affiche les bonnes informations (prénom, nom, email).
5. **Planning** : `/planning` affiche la semaine courante, les créneaux passés sont grisés et non cliquables.
6. **Réservation valide** : cliquer un créneau libre futur, saisir un objet, valider → le créneau apparaît occupé avec son nom.
7. **Récidive de chevauchement** : tenter de réserver un créneau déjà occupé → message d'erreur (409), pas de double réservation.
8. **Modification** : cliquer sa propre réservation → modifier l'objet ou la durée → mise à jour visible immédiatement.
9. **Annulation** : annuler sa réservation (depuis `/planning` ou `/dashboard`) → le créneau redevient libre.
10. **Permissions** : un autre utilisateur ne doit pas pouvoir modifier/annuler une réservation qui n'est pas la sienne (vérifiable via l'API : `PUT`/`DELETE` sur la réservation d'un autre utilisateur → 403).
11. **Déconnexion** : le token est supprimé, l'accès aux routes protégées redirige vers `/login`.

## Hors scope V1 / pistes V2

**volontairement absents de cette version** :

- Rôle administrateur
- Gestion multi-salles
- Notifications par email
- Récurrence de réservation
- Suppression de compte (US-09, priorité SHOULD)
