import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques du dossier dist
app.use(express.static(join(__dirname, 'dist')));

// Pour TOUTES les autres routes, renvoyer index.html
// C'est comme ça que React Router peut gérer les routes au client
app.get('*', (req, res) => {
	console.log(`Route demandée: ${req.path} -> Servir index.html`);
	res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
