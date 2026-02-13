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
