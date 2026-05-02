import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'; // ✅ IMPORTANT pour Render

const distPath = join(__dirname, 'dist');

// ✅ Vérifier que dist existe
if (!fs.existsSync(distPath)) {
	console.error(`❌ ERREUR: Le dossier dist n'existe pas à ${distPath}`);
	console.error('Lancez: npm run build');
	process.exit(1);
}

console.log(`📁 Serveur les fichiers de: ${distPath}`);

// Servir les fichiers statiques du dossier dist avec cache
app.use(express.static(distPath, {
	maxAge: '1d',
	etag: false
}));

// ✅ Pour TOUTES les autres routes, renvoyer index.html
// C'est comme ça que React Router peut gérer les routes au client
app.get('*', (req, res) => {
	const indexPath = join(distPath, 'index.html');
	console.log(`🔀 Route demandée: ${req.path} -> Servir index.html`);
	
	// ✅ Vérifier que index.html existe
	if (!fs.existsSync(indexPath)) {
		console.error(`❌ index.html non trouvé à ${indexPath}`);
		return res.status(500).send('Server Error: index.html not found');
	}
	
	res.sendFile(indexPath);
});

// ✅ Écouter sur 0.0.0.0 (nécessaire pour Render)
app.listen(PORT, HOST, () => {
	console.log(`✅ Serveur lancé sur http://${HOST}:${PORT}`);
	console.log(`📍 Accédez à votre app via: http://localhost:${PORT} (local)`);
});
