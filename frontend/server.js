import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const distPath = join(__dirname, 'dist');

console.log('═════════════════════════════════════════');
console.log('🚀 SERVEUR REACT DÉMARRAGE');
console.log('═════════════════════════════════════════');
console.log(`📁 Répertoire courant: ${process.cwd()}`);
console.log(`📂 Chemin dist: ${distPath}`);
console.log(`🌍 Host: ${HOST}`);
console.log(`🔌 Port: ${PORT}`);
console.log(`🔄 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

// ✅ Vérifier que dist existe
if (!fs.existsSync(distPath)) {
	console.error(`❌ ERREUR: Le dossier dist n'existe pas!`);
	console.error(`Attendu à: ${distPath}`);
	console.error('Solution: npm run build');
	process.exit(1);
}

// Lister le contenu de dist
const distFiles = fs.readdirSync(distPath);
console.log(`\n📄 Fichiers dans dist (${distFiles.length}):`);
distFiles.forEach(f => console.log(`   - ${f}`));

// Vérifier que index.html existe
const indexPath = join(distPath, 'index.html');
if (!fs.existsSync(indexPath)) {
	console.error(`\n❌ ERREUR CRITIQUE: index.html manquant!`);
	process.exit(1);
}
console.log(`✅ index.html trouvé`);

// ✅ Servir les fichiers statiques avec les bons headers
app.use((req, res, next) => {
	// Ne pas cacher index.html (important!)
	if (req.path === '/' || req.path.endsWith('.html')) {
		res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
		res.set('Pragma', 'no-cache');
		res.set('Expires', '0');
	}
	next();
});

app.use(express.static(distPath, {
	maxAge: '1d',
	etag: true,
	lastModified: true,
	setHeaders: (res, path) => {
		// Assets avec hash - cache long
		if (extname(path) === '.js' || extname(path) === '.css') {
			if (path.includes('.')) {
				res.set('Cache-Control', '1y');
			}
		}
	}
}));

// ✅ Route catch-all pour React Router
app.get('*', (req, res) => {
	console.log(`🔀 [${new Date().toISOString()}] Route: ${req.method} ${req.path}`);
	
	// Pour les fichiers existants, les servir
	const filePath = join(distPath, req.path);
	if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
		return res.sendFile(filePath);
	}
	
	// Pour tout le reste, servir index.html pour React Router
	res.set('Content-Type', 'text/html; charset=utf-8');
	res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
	res.sendFile(indexPath, (err) => {
		if (err) {
			console.error(`❌ Erreur lors de l'envoi de index.html:`, err.message);
			res.status(500).send('Server Error');
		}
	});
});

// ✅ Error handler
app.use((err, req, res, next) => {
	console.error(`❌ Erreur serveur:`, err);
	res.status(500).send('Internal Server Error');
});

// ✅ Démarrer le serveur
const server = app.listen(PORT, HOST, () => {
	console.log('\n═════════════════════════════════════════');
	console.log('✅ SERVEUR PRÊT');
	console.log('═════════════════════════════════════════');
	console.log(`🌐 Accéder à: http://localhost:${PORT}`);
	console.log(`📍 En production Render: https://your-app.onrender.com`);
	console.log('\n✨ Le serveur gère React Router correctement');
	console.log('   (les routes dynamiques rechargent sans erreur)');
	console.log('═════════════════════════════════════════\n');
});

// ✅ Graceful shutdown
process.on('SIGTERM', () => {
	console.log('\n⛔ Signal SIGTERM reçu - arrêt du serveur');
	server.close(() => {
		console.log('✅ Serveur arrêté proprement');
		process.exit(0);
	});
});

process.on('SIGINT', () => {
	console.log('\n⛔ Signal SIGINT reçu - arrêt du serveur');
	server.close(() => {
		console.log('✅ Serveur arrêté proprement');
		process.exit(0);
	});
});
