import React from 'react';
import './RandomIconSpot.css';

interface IconSpotProps {
  // Position relative: 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center', ou personnalisé
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'custom' | 'random';
  // Coordonnées personnalisées (en %) si position = 'custom'
  x?: number;
  y?: number;
  // Taille de l'icône
  size?: number;
  // ✨ NOUVEAU: Ajouter de la randomness à la taille (ex: 0.2 = ±20%)
  sizeVariation?: number;
  // ✨ NOUVEAU: Ajouter de la randomness à la position (en pixels)
  positionVariation?: number;
  // Probabilité d'affichage (0-1)
  probability?: number;
  // Animation CSS personnalisée
  animate?: boolean;
  // Classe CSS personnalisée
  className?: string;
  // ✨ NOUVEAU: Callback quand on clique sur l'icône
  onClick?: () => void;
  // ✨ NOUVEAU: Fixed position (statique sur la page, ne scroll pas)
  fixed?: boolean;
}

export const RandomIconSpot: React.FC<IconSpotProps> = ({
  position = 'top-left',
  x = 0,
  y = 0,
  size = 80,
  sizeVariation = 0,
  positionVariation = 0,
  probability = 0.3,
  animate = true,
  className = '',
  onClick,
  fixed = false,
}) => {
  const [shouldDisplay, setShouldDisplay] = React.useState(false);
  const [iconId, setIconId] = React.useState<number | null>(null);
  const [url, setUrl] = React.useState<string | null>(null);
  const [randomSize, setRandomSize] = React.useState(size);
  const [randomOffsetX, setRandomOffsetX] = React.useState(0);
  const [randomOffsetY, setRandomOffsetY] = React.useState(0);
  const [finalPosition, setFinalPosition] = React.useState(position);

  React.useEffect(() => {
    // Décider s'il faut afficher une icône
    const display = Math.random() < probability;
    setShouldDisplay(display);

    if (display) {
      const randomId = Math.floor(Math.random() * 24) + 1;
      setIconId(randomId);
      setUrl(`https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/icons/${randomId}.png`);
      
      // ✨ Ajouter de la randomness à la taille
      if (sizeVariation > 0) {
        const variation = size * sizeVariation * (Math.random() - 0.5) * 2;
        setRandomSize(Math.max(20, size + variation));
      } else {
        setRandomSize(size);
      }
      
      // ✨ Ajouter de la randomness à la position
      if (positionVariation > 0) {
        setRandomOffsetX((Math.random() - 0.5) * positionVariation * 2);
        setRandomOffsetY((Math.random() - 0.5) * positionVariation * 2);
      } else {
        setRandomOffsetX(0);
        setRandomOffsetY(0);
      }
      
      // ✨ Si position = 'random', choisir une position aléatoire
      if (position === 'random') {
        const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        const randomPos = positions[Math.floor(Math.random() * positions.length)];
        setFinalPosition(randomPos as any);
      } else {
        setFinalPosition(position);
      }
    } else {
      setIconId(null);
      setUrl(null);
    }
  }, [probability, size, sizeVariation, positionVariation, position]);

  if (!shouldDisplay || !url) {
    return null;
  }

  const getPositionStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: fixed ? 'fixed' : 'absolute',
      width: `${randomSize}px`,
      height: `${randomSize}px`,
      zIndex: fixed ? 100 : 10,
      cursor: onClick ? 'pointer' : 'default',
    };

    const offsetX = randomOffsetX;
    const offsetY = randomOffsetY;

    // Pour fixed: utiliser des marges de screen (px), pour absolute: utiliser les valeurs calculées
    const topOffset = fixed ? '20px' : 'auto';
    const rightOffset = fixed ? '20px' : 'auto';
    const bottomOffset = fixed ? '20px' : 'auto';
    const leftOffset = fixed ? '20px' : 'auto';

    switch (finalPosition) {
      case 'top-left':
        return { 
          ...baseStyle, 
          top: fixed ? `calc(${topOffset} + ${offsetY}px)` : `calc(20px + ${offsetY}px)`, 
          left: fixed ? `calc(${leftOffset} + ${offsetX}px)` : `calc(20px + ${offsetX}px)` 
        };
      case 'top-right':
        return { 
          ...baseStyle, 
          top: fixed ? `calc(${topOffset} + ${offsetY}px)` : `calc(20px + ${offsetY}px)`, 
          right: fixed ? `calc(${rightOffset} - ${offsetX}px)` : `calc(20px - ${offsetX}px)` 
        };
      case 'bottom-left':
        return { 
          ...baseStyle, 
          bottom: fixed ? `calc(${bottomOffset} - ${offsetY}px)` : `calc(20px - ${offsetY}px)`, 
          left: fixed ? `calc(${leftOffset} + ${offsetX}px)` : `calc(20px + ${offsetX}px)` 
        };
      case 'bottom-right':
        return { 
          ...baseStyle, 
          bottom: fixed ? `calc(${bottomOffset} - ${offsetY}px)` : `calc(20px - ${offsetY}px)`, 
          right: fixed ? `calc(${rightOffset} - ${offsetX}px)` : `calc(20px - ${offsetX}px)` 
        };
      case 'center':
        return { 
          ...baseStyle, 
          top: fixed ? `calc(50vh + ${offsetY}px)` : `calc(50% + ${offsetY}px)`, 
          left: fixed ? `calc(50vw + ${offsetX}px)` : `calc(50% + ${offsetX}px)`, 
          transform: 'translate(-50%, -50%)' 
        };
      case 'custom':
        return { 
          ...baseStyle, 
          top: fixed ? `calc(${y}vh + ${offsetY}px)` : `calc(${y}% + ${offsetY}px)`, 
          left: fixed ? `calc(${x}vw + ${offsetX}px)` : `calc(${x}% + ${offsetX}px)` 
        };
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
      onClick={onClick}
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
