/**
 * Configuration prédéfinie pour les icônes aléatoires
 * 
 * Utilisez ces configurations prédéfinies pour une cohérence
 * à travers votre site
 */

export const iconConfigs = {
  // ============================================
  // CONFIGURATIONS PAR SECTION
  // ============================================
  
  // Homepage - Fréquent et animé
  homepage: {
    probability: 0.3,
    spotCount: 2,
    positions: ['top-left', 'bottom-right'] as const,
    iconSize: 45,
  },

  // Pages d'articles - Modéré
  articlePage: {
    probability: 0.5,
    positions: ['top-right', 'bottom-left'] as const,
    iconSize: 50,
  },

  // Sections conversatio - Discret
  conversation: {
    probability: 0.2,
    spotCount: 1,
    positions: ['top-right'] as const,
    iconSize: 35,
  },

  // Quiz page - Très animé
  quiz: {
    probability: 0.4,
    spotCount: 3,
    positions: ['top-left', 'top-right', 'bottom-right'] as const,
    iconSize: 50,
  },

  // Mosaïc grid - Equilibré
  mosaic: {
    probability: 0.3,
    spotCount: 2,
    positions: ['top-left', 'bottom-right'] as const,
    iconSize: 45,
  },

  // Takes page - Discret
  takes: {
    probability: 0.25,
    spotCount: 2,
    positions: ['top-right', 'bottom-left'] as const,
    iconSize: 40,
  },

  // ============================================
  // CONFIGURATIONS PAR STYLE
  // ============================================

  // Pas d'icônes
  none: {
    probability: 0,
  },

  // Très rare
  rare: {
    probability: 0.1,
  },

  // Peu fréquent
  uncommon: {
    probability: 0.2,
  },

  // Standard
  common: {
    probability: 0.5,
  },

  // Très fréquent
  frequent: {
    probability: 0.8,
  },

  // Toujours présent
  always: {
    probability: 1,
  },

  // ============================================
  // CONFIGURATIONS PAR TAILLE
  // ============================================

  tiny: {
    iconSize: 30,
  },

  small: {
    iconSize: 40,
  },

  medium: {
    iconSize: 50,
  },

  large: {
    iconSize: 60,
  },

  // ============================================
  // CONFIGURATIONS POSITIONNELLES
  // ============================================

  topCorners: {
    spotCount: 2,
    positions: ['top-left', 'top-right'] as const,
  },

  bottomCorners: {
    spotCount: 2,
    positions: ['bottom-left', 'bottom-right'] as const,
  },

  allCorners: {
    spotCount: 4,
    positions: [
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
    ] as const,
  },

  leftSide: {
    spotCount: 2,
    positions: ['top-left', 'bottom-left'] as const,
  },

  rightSide: {
    spotCount: 2,
    positions: ['top-right', 'bottom-right'] as const,
  },

  // ============================================
  // CONFIGURATIONS FUSION - MODÈLES COMPLETS
  // ============================================

  minimalFootprint: {
    probability: 0.1,
    spotCount: 1,
    positions: ['top-right'] as const,
    iconSize: 35,
  },

  subtleAccent: {
    probability: 0.25,
    spotCount: 1,
    positions: ['bottom-right'] as const,
    iconSize: 40,
  },

  decorativeTouch: {
    probability: 0.3,
    spotCount: 2,
    positions: ['top-left', 'bottom-right'] as const,
    iconSize: 45,
  },

  playful: {
    probability: 0.5,
    spotCount: 3,
    positions: ['top-left', 'top-right', 'bottom-right'] as const,
    iconSize: 50,
  },

  festive: {
    probability: 0.7,
    spotCount: 4,
    positions: [
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
    ] as const,
    iconSize: 55,
  },

  chaotic: {
    probability: 0.9,
    spotCount: 5,
    positions: [
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
      'center',
    ] as const,
    iconSize: 60,
  },
};

// Export également les types pour TypeScript
export type IconConfig = typeof iconConfigs[keyof typeof iconConfigs];
