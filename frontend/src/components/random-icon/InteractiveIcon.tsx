import React, { useState } from 'react';
import { RandomIconSpot } from './RandomIconSpot';
import { ShareModal } from './ShareModal';
import './InteractiveIcon.css';

/**
 * Composant complet : Icônes aléatoires + Bouton de partage
 * Quand vous cliquez sur une icône, elle ouvre un modal de partage
 */

interface InteractiveIconProps {
  // Position de l'icône
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'random';
  // Taille de base (en pixels)
  size?: number;
  // ✨ Variation de taille (0-1, ex: 0.3 = ±30%)
  sizeVariation?: number;
  // ✨ Variation de position (en pixels)
  positionVariation?: number;
  // Probabilité d'affichage
  probability?: number;
  // Animation
  animate?: boolean;
  // ✨ URL à partager quand on clique sur l'icône
  shareUrl?: string;
}

export const InteractiveIcon: React.FC<InteractiveIconProps> = ({
  position = 'top-left',
  size = 80,
  sizeVariation = 0.2,  // Par défaut: ±20% de variation
  positionVariation = 20, // Par défaut: ±20px de variation
  probability = 0.5,
  animate = true,
  shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://example.com',
}) => {
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <>
      {/* L'icône cliquable */}
      <RandomIconSpot
        position={position}
        size={size}
        sizeVariation={sizeVariation}
        positionVariation={positionVariation}
        probability={probability}
        animate={animate}
        onClick={() => setShowShareModal(true)}
        className="interactive-icon"
      />

      {/* Modal de partage */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={shareUrl}
        title="✨ Share it to others"
      />
    </>
  );
};

/**
 * Conteneur pour plusieurs icônes interactives
 */

interface InteractiveIconContainerProps {
  children: React.ReactNode;
  // Probabilité de chaque icône
  probability?: number;
  // Nombre d'emplacements
  spotCount?: number;
  // Positions à utiliser
  positions?: Array<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'random'>;
  // Taille de base
  iconSize?: number;
  // ✨ Variation de taille
  sizeVariation?: number;
  // ✨ Variation de position
  positionVariation?: number;
  // Classes CSS
  className?: string;
  // ✨ URL à partager
  shareUrl?: string;
}

export const InteractiveIconContainer: React.FC<InteractiveIconContainerProps> = ({
  children,
  probability = 0.3,
  spotCount = 2,
  positions = ['top-left', 'bottom-right'],
  iconSize = 80,
  sizeVariation = 0.2,
  positionVariation = 20,
  className = '',
  shareUrl,
}) => {
  return (
    <div className={`interactive-icon-container ${className}`} style={{ position: 'relative' }}>
      {/* Icônes interactives */}
      {Array.from({ length: spotCount }).map((_, index) => (
        <InteractiveIcon
          key={index}
          position={positions[index % positions.length] as any}
          probability={probability}
          size={iconSize}
          sizeVariation={sizeVariation}
          positionVariation={positionVariation}
          animate={true}
          shareUrl={shareUrl}
        />
      ))}

      {/* Contenu enfant */}
      {children}
    </div>
  );
};

export default InteractiveIcon;
