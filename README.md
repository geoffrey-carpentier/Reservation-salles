# Starter Kit MERN

Ce template propose une base complète pour démarrer rapidement un projet **MERN** (MongoDB, Express, React, Node.js) avec une architecture claire, une API sécurisée (JWT), une gestion d’authentification, et une interface frontend moderne avec React + Vite.

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation & Lancement](#installation--lancement)
  - [1. Backend (API Node.js + Express + MySQL)](#1-backend-api-nodejs--express--mysql)
  - [2. Frontend (React + Vite)](#2-frontend-react--vite)
- [Configuration](#configuration)
  - [Variables d’environnement](#variables-denvironnement)
- [Authentification JWT](#authentification-jwt)
- [Utilisation avec Postman](#utilisation-avec-postman)
- [Développement Frontend](#développement-frontend)
- [Checklist finale](#checklist-finale)
- [Crédits](#crédits)

---

## Fonctionnalités

- **Backend Express (ES Modules)** avec gestion des utilisateurs, authentification JWT, hash des mots de passe (bcrypt), connexion MySQL (mysql2).
- **Frontend React + Vite** avec gestion du contexte d’authentification, React Router, hooks personnalisés, composants réutilisables.
- **Séparation claire** du code backend et frontend.
- **Prêt pour le développement local et la production**.
- **Support Tailwind CSS** (optionnel).
- **Exemples d’utilisation avec Postman**.

---

## Structure du projet

```text
starter-kit-MERN/
│
├── backend/
│   ├── config/           # Connexion MySQL
│   ├── controllers/      # Contrôleurs Express (auth)
│   ├── middlewares/      # Middlewares (auth JWT)
│   ├── models/           # Modèles (User)
│   ├── routes/           # Routes Express
│   ├── schema.sql        # Script SQL de création de la BDD
│   ├── .env.example      # Exemple de configuration d'environnement
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/   # Composants réutilisables
│   │   ├── contexts/     # Contextes React (auth)
│   │   ├── hooks/        # Hooks personnalisés
│   │   ├── layouts/      # Layouts de pages
│   │   ├── pages/        # Pages principales (Home, Login, Register, Dashboard)
│   │   ├── service/      # Services d'appel API
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── .gitignore
└── README.md
```

---

## Prérequis

- **Node.js** v18 ou supérieur
- **npm** v9 ou supérieur
- **MySQL** (ou MariaDB)
- **Postman** (pour tester l’API)
- **Git** (pour cloner le repo)

---

## Installation & Lancement

### 1. Backend (API Node.js + Express + MySQL)

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'exemple d'environnement
cp .env.example .env

# Modifier .env selon votre configuration MySQL et vos secrets JWT

# Créer la base de données et la table users
mysql -u root -p < shema.sql

# Lancer le serveur de développement (auto-reload)
npm run dev
```

Le serveur démarre sur [http://localhost:5000](http://localhost:5000).

---

### 2. Frontend (React + Vite)

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le frontend démarre sur [http://localhost:5173](http://localhost:5173).

---

## Configuration

### Variables d’environnement

- `JWT_SECRET`: Secret pour le JWT (ex: `my_secret_key`)
- `MYSQL_HOST`: Hôte MySQL
- `MYSQL_PORT`: Port MySQL
- `MYSQL_USER`: Utilisateur MySQL
- `MYSQL_PASSWORD`: Mot de passe MySQL
- `MYSQL_DATABASE`: Nom de la base de données

*Exemple de fichier `.env` pour le backend :*

```dotenv
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=starter_kit_MERN
JWT_SECRET=remplacez_par_un_secret_complexe
JWT_EXPIRES_IN=7d
```

---

## Authentification JWT

- Le JWT est généré lors de la connexion.
- Le JWT est envoyé dans le header `Authorization`.
- Le JWT est valide pour 1 heure.
- Le JWT est signé avec le secret `JWT_SECRET`.

- **Inscription** : `POST /api/auth/register`
- **Connexion** : `POST /api/auth/login`
- **Profil protégé** : `GET /api/auth/me` (nécessite le header `Authorization: Bearer <token>`)

Les tokens JWT sont stockés côté frontend (localStorage) et envoyés dans le header Authorization pour accéder aux routes protégées.

---

## Utilisation avec Postman

- Tester l’API avec Postman.
- Utiliser les exemples d’utilisation dans le fichier `example-postman.json`.

1. **Inscription**
   - POST `http://localhost:5000/api/auth/register`
   - Body (JSON) :
  
     ```json
     {
       "email": "test@example.com",
       "password": "motdepasse",
       "firstname": "John",
       "lastname": "Doe"
     }
     ```

2. **Connexion**
   - POST `http://localhost:5000/api/auth/login`
   - Body (JSON) :
  
     ```json
     {
       "email": "test@example.com",
       "password": "motdepasse"
     }
     ```

3. **Profil**
   - GET `http://localhost:5000/api/auth/me`
   - Header : `Authorization: Bearer <token>`

---

## Développement Frontend

- Utiliser React Router pour la navigation.
- Utiliser React Context pour la gestion de l’authentification.
- Utiliser React Hooks pour la gestion des états.
- Utiliser React Components pour la création de pages.

### Création du projet (rappel)

````bash
# Créer le projet React avec Vite
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom
npm run dev
````

⚠️ Le serveur démarre sur <http://localhost:5173> (pas 3000 comme Create React App)

### Installation Tailwind CSS v4 (optionnel)

```bash
npm install tailwindcss @tailwindcss/vite
```

Ajoutez le plugin dans `vite.config.js` :

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**index.css** :

```css
@import "tailwindcss";

@layer components {
 .btn { @apply px-6 py-2 rounded-lg font-medium transition-all; }
 .btn-primary { @apply bg-indigo-600 text-white hover:bg-indigo-700; }
 .form-input { @apply w-full px-4 py-2 border-2 rounded-lg; }
}
```

### Icônes FontAwesome (optionnel)

```bash
npm i --save @fortawesome/react-fontawesome@latest
npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/free-brands-svg-icons
```

---

## Checklist finale

- [x] **Backend** : API Express, connexion MySQL, JWT, routes auth OK
- [x] **Frontend** : React + Vite, contextes, hooks, pages, navigation, Header + Footer OK
- [x] **Sécurité** : Hash des mots de passe, tokens JWT, CORS configuré
- [x] **Tests Postman** : Register, Login, Profil protégés OK
- [x] **Documentation** : Ce README complet

---

## Documentation

- [React + Vite](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [React Context](https://reactjs.org/docs/context-api.html)
- [Express + MySQL](https://expressjs.com)
- [JWT](https://jwt.io)

---

## Crédits

Starter Kit MERN inspiré des bonnes pratiques modernes Node.js, Express, React et Vite.

---

*Pour toute question ou suggestion, ouvrez une issue sur le dépôt GitHub !*

---

## Licence

Ce projet est open-source, sous licence MIT.

- **MIT License**
- **Starter Kit MERN**: Template de départ pour un projet MERN.
[GitHub](https://github.com/geoffrey-carpentier/starter-kit-mern)
- **React + Vite**: Framework moderne pour le frontend.
- **Express + MySQL**: Backend robuste et performant.
- **JWT**: Authentification sécurisée
