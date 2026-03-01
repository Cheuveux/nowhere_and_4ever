import React, { useEffect, useState } from 'react';
import './background.css';

const Background: React.FC = () => {
  const [backgroundUrl, setBackgroundUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackgroundUrl = async () => {
      try {
        // 1. Appel a l'endpoint Strapi pour obtenir une URL signee
        const url = 'http://localhost:1337/api/signed-url?fileKey=background/white-grid.png';
        const response = await fetch(url);
        if (!response.ok) {
          // Log status et statusText
          console.error(`Erreur HTTP: ${response.status} ${response.statusText}`);
          const text = await response.text();
          console.error('Réponse brute:', text);
          throw new Error(`Impossible de recuperer l'URL (status: ${response.status} ${response.statusText})`);
        }
        const data = await response.json();
        setBackgroundUrl(data.url);
      } catch (err: any) {
        setError(err.message);
        console.error('Erreur attrapée:', err);
      }
    };
    fetchBackgroundUrl();
  }, []);

  if (error)
    return <div className="error">Erreur de chargement : {error}</div>;
  if (!backgroundUrl)
    return <div className="loading">Chargement de l'arriere-plan...</div>;
  return (
    <div
      className="app-background"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    ></div>
  );
};

export default Background;