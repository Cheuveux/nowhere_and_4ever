import { useState, useEffect } from 'react';

interface UseRandomIconOptions {
  // Probabilité qu'une icône s'affiche (0-1, par défaut 0.5 = 50%)
  probability?: number;
  // Nombre total d'icônes disponibles (1-24)
  totalIcons?: number;
}

interface RandomIcon {
  // URL de l'icône ou null si pas d'affichage
  url: string | null;
  // L'ID de l'icône (1-24) ou null
  iconId: number | null;
}

export const useRandomIcon = (
  options: UseRandomIconOptions = {}
): RandomIcon => {
  const { probability = 0.5, totalIcons = 24 } = options;
  const [icon, setIcon] = useState<RandomIcon>({ url: null, iconId: null });

  useEffect(() => {
    // Décider s'il faut afficher une icône basé sur la probabilité
    const shouldDisplay = Math.random() < probability;

    if (shouldDisplay) {
      // Choisir un ID aléatoire entre 1 et totalIcons
      const randomId = Math.floor(Math.random() * totalIcons) + 1;
      const url = `https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/icons/${randomId}.png`;
      setIcon({ url, iconId: randomId });
    } else {
      setIcon({ url: null, iconId: null });
    }
  }, [probability, totalIcons]);

  return icon;
};

// Variant: Hook pour générer plusieurs icônes aléatoires
export const useRandomIcons = (count: number, options: UseRandomIconOptions = []): RandomIcon[] => {
  const [icons, setIcons] = useState<RandomIcon[]>([]);

  useEffect(() => {
    const newIcons: RandomIcon[] = [];
    
    for (let i = 0; i < count; i++) {
      const opts = Array.isArray(options) ? options[i] : options;
      const probability = (opts as UseRandomIconOptions)?.probability ?? 0.5;
      const totalIcons = (opts as UseRandomIconOptions)?.totalIcons ?? 24;
      const shouldDisplay = Math.random() < probability;

      if (shouldDisplay) {
        const randomId = Math.floor(Math.random() * totalIcons) + 1;
        const url = `https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/icons/${randomId}.png`;
        newIcons.push({ url, iconId: randomId });
      } else {
        newIcons.push({ url: null, iconId: null });
      }
    }
    
    setIcons(newIcons);
  }, [count]);

  return icons;
};
