import React from 'react';
import './RandomIconSpot.css';

interface IconSpotProps {
  // Position relative: 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center', ou personnalisé
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'custom';
  // Coordonnées personnalisées (en %) si position = 'custom'
  x?: number;
  y?: number;
  // Taille de l'icône
  size?: number;
  // Probabilité d'affichage (0-1)
  probability?: number;
  // Animation CSS personnalisée
  animate?: boolean;
  // Classe CSS personnalisée
  className?: string;
}

export const RandomIconSpot: React.FC<IconSpotProps> = ({
  position = 'top-left',
  x = 0,
  y = 0,
  size = 80,
  probability = 0.3,
  animate = true,
  className = '',
}) => {
  const [shouldDisplay, setShouldDisplay] = React.useState(false);
  const [iconId, setIconId] = React.useState<number | null>(null);
  const [url, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Décider s'il faut afficher une icône
    const display = Math.random() < probability;
    setShouldDisplay(display);

    if (display) {
      const randomId = Math.floor(Math.random() * 24) + 1;
      setIconId(randomId);
      setUrl(`https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/icons/${randomId}.png`);
    } else {
      setIconId(null);
      setUrl(null);
    }
  }, [probability]);

  if (!shouldDisplay || !url) {
    return null;
  }

  const getPositionStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      zIndex: 10,
    };

    switch (position) {
      case 'top-left':
        return { ...baseStyle, top: '20px', left: '20px' };
      case 'top-right':
        return { ...baseStyle, top: '20px', right: '20px' };
      case 'bottom-left':
        return { ...baseStyle, bottom: '20px', left: '20px' };
      case 'bottom-right':
        return { ...baseStyle, bottom: '20px', right: '20px' };
      case 'center':
        return { ...baseStyle, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'custom':
        return { ...baseStyle, top: `${y}%`, left: `${x}%` };
      default:
        return baseStyle;
    }
  };

  return (
    <img
      src={url}
      alt={`Icon ${iconId}`}
      className={`random-icon-spot ${animate ? 'animate' : ''} ${className}`}
      style={getPositionStyle()}
    />
  );
};

/**
 * Conteneur pour placer plusieurs icônes aléatoires dans une section
 * Usage :
 * <IconSpotContainer probability={0.4}>
 *   Votre contenu ici
 * </IconSpotContainer>
 */
interface IconSpotContainerProps {
  children: React.ReactNode;
  // Probabilité d'affichage des icônes (0-1)
  probability?: number;
  // Nombre d'emplacements d'icônes
  spotCount?: number;
  // Types de positions à utiliser
  positions?: Array<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'>;
  // Taille des icônes
  iconSize?: number;
  // Classes CSS personnalisées
  className?: string;
}

export const IconSpotContainer: React.FC<IconSpotContainerProps> = ({
  children,
  probability = 0.3,
  spotCount = 3,
  positions = ['top-left', 'top-right', 'bottom-right'],
  iconSize = 500,
  className = '',
}) => {
  return (
    <div className={`icon-spot-container ${className}`} style={{ position: 'relative' }}>
      {Array.from({ length: spotCount }).map((_, index) => (
        <RandomIconSpot
          key={index}
          position={positions[index % positions.length] as any}
          probability={probability}
          size={iconSize}
          animate={true}
        />
      ))}
      {children}
    </div>
  );
};

export default RandomIconSpot;
