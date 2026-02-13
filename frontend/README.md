# Création du projet - Frontend

````bash
# Créer le projet React avec Vite
npm create vite@latest frontend -- --template react
# Entrer dans le dossier
cd frontend
# Installer les dépendances
npm install
# Ajouter React Router pour la navigation
npm install react-router-dom
# Lancer le serveur de développement
npm run dev
````

``⚠️ Le serveur démarre sur http://localhost:5173 (pas 3000 comme Create React App)``

## Installation Tailwind CSS v4

**First, install the necessary dependencies:**

```bash
npm install tailwindcss @tailwindcss/vite
```

**Then, add the plugin to your** `vite.config.js`:

```javascript

import { defineConfig } from 'vite' 
import react from '@vitejs/plugin-react' 
import tailwindcss from '@tailwindcss/vite' 

export default defineConfig({
     plugins: [react(), tailwindcss()],
}) 
```

 *For more information, see the* [Tailwind CSS documentation](https://tailwindcss.com/docs/guides/vite).

### Index.css

```css
/* 1 seule ligne ! */
@import "tailwindcss";

/* Classes réutilisables (optionnel) */
@layer components {
 .btn { @apply px-6 py-2 rounded-lg font-medium transition-all; }
 .btn-primary { @apply bg-indigo-600 text-white hover:bg-indigo-700; }
 .form-input { @apply w-full px-4 py-2 border-2 rounded-lg; }
}
```

````bash
npm i --save @fortawesome/react-fontawesome@latest
npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/free-brands-svg-icons
````

* *React + Vite: This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules. Currently, two official plugins are available: - [@vitejs/plugin-react](*

--- ---

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

* [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

* [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
