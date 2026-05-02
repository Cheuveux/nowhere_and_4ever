import React from 'react';
import { useRandomIcon } from '../hooks/useRandomIcon';

interface RandomIconProps {
  // Taille de l'icône en pixels (par défaut 40)
  size?: number;
  // Probabilité d'affichage (0-1)
  probability?: number;
  // Classes CSS supplémentaires
  className?: string;
  // Style CSS inline
  style?: React.CSSProperties;
  // Fonction appelée quand l'icône change
  onIconChange?: (iconId: number | null) => void;
  // Alt text pour l'accessibilité
  alt?: string;
}

export const RandomIcon: React.FC<RandomIconProps> = ({
  size = 40,
  probability = 0.5,
  className = '',
  style = {},
  onIconChange,
  alt = 'Random icon',
}) => {
  const { url, iconId } = useRandomIcon({ probability });

  React.useEffect(() => {
    onIconChange?.(iconId);
  }, [iconId, onIconChange]);

  if (!url) {
    return null;
  }

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        ...style,
      }}
    />
  );
};

export default RandomIcon;
