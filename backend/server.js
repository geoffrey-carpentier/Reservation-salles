//server JS
import app from "./app.js";
import { testConnection } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connexion BDD
testConnection();

// Démarrage
app.listen(PORT, () => {
    console.log(`Serveur sur http://localhost:${PORT}`);
});
