/**
 * 🎯 GUIDE - Icônes aléatoires + Partage
 * 
 * Nouveau système : Icônes cliquables qui ouvrent un modal de partage
 * avec randomness sur la taille et la position
 */

// ============================================================================
// 1️⃣ COMPOSANT SIMPLE - Une icône cliquable
// ============================================================================

// import { InteractiveIcon } from './components/random-icon/InteractiveIcon';

// function Example1() {
//   return (
//     <div style={{ position: 'relative', height: '300px' }}>
//       {/* Une seule icône dans le coin haut-droit */}
//       {/* Quand vous cliquez dessus → modal de partage s'ouvre */}
//       <InteractiveIcon 
//         position="top-right"
//         probability={1}  // Toujours affichée
//         size={80}
//         sizeVariation={0.3}      // ✨ Taille varie de ±30%
//         positionVariation={30}   // ✨ Position varie de ±30px
//       />
      
//       <p>Votre contenu ici</p>
//     </div>
//   );
// }

// ============================================================================
// 2️⃣ CONTENEUR - Plusieurs icônes interactives
// ============================================================================

// import { InteractiveIconContainer } from './components/random-icon/InteractiveIcon';

// function Example2() {
//   return (
//     <InteractiveIconContainer
//       probability={0.8}        // 80% de chance par icône
//       spotCount={3}            // 3 icônes
//       positions={['top-left', 'top-right', 'bottom-right']}
//       iconSize={80}
//       sizeVariation={0.3}      // ✨ Variation de taille
//       positionVariation={30}   // ✨ Variation de position
//     >
//       <div>
//         <h1>Mon Article</h1>
//         <p>Cliquez sur les icônes pour partager !</p>
//       </div>
//     </InteractiveIconContainer>
//   );
// }

// ============================================================================
// 3️⃣ PERSONNALISATION AVANCÉE
// ============================================================================

/**
 * Paramètres disponibles :
 * 
 * position:
 *   - 'top-left', 'top-right', 'bottom-left', 'bottom-right'
 *   - 'center'
 *   - 'random' = position aléatoire entre les 4 coins ✨
 * 
 * size:
 *   - Taille en pixels (défaut: 80)
 * 
 * sizeVariation: ✨ NOUVEAU
 *   - 0 = taille fixe
 *   - 0.1 = varie de ±10%
 *   - 0.3 = varie de ±30%
 *   - 0.5 = varie de ±50%
 * 
 * positionVariation: ✨ NOUVEAU
 *   - 0 = position fixe
 *   - 10 = varie de ±10px
 *   - 30 = varie de ±30px
 *   - 50 = varie de ±50px
 * 
 * probability:
 *   - 0.5 = 50% de chance
 *   - 1 = 100% (toujours affichée)
 * 
 * animate:
 *   - true = animation flottante
 *   - false = statique
 * 
 * shareUrl: ✨ NOUVEAU
 *   - URL à partager (défaut: URL actuelle)
 */

// ============================================================================
// 4️⃣ EXEMPLES D'UTILISATION
// ============================================================================

// Configuration discrète
{/* <InteractiveIcon 
  position="top-right"
  probability={0.2}        // Très rare
  size={50}                // Petit
  sizeVariation={0.1}      // Peu de variation
  positionVariation={10}   // Peu de variation
/>

// Configuration ludique
<InteractiveIcon 
  position="random"        // Position aléatoire à chaque fois
  probability={0.8}        // Très fréquent
  size={100}               // Grand
  sizeVariation={0.5}      // Beaucoup de variation
  positionVariation={50}   // Beaucoup de variation
/>

// Configuration avec URL personnalisée
<InteractiveIcon 
  position="bottom-left"
  probability={1}
  shareUrl="https://mon-site.com/article/special"
/> */}

// ============================================================================
// 5️⃣ INTÉGRATION DANS VOS PAGES
// ============================================================================

// Dans articles.tsx (à la place d'IconSpotContainer)
// import { InteractiveIconContainer } from '../random-icon/InteractiveIcon';

// export default function Articles() {
//   return (
//     <InteractiveIconContainer
//       probability={0.5}
//       spotCount={2}
//       positions={['top-left', 'bottom-right']}
//       iconSize={80}
//       sizeVariation={0.2}
//       positionVariation={20}
//     >
//       <div className="articles-container">
//         {/* Vos articles */}
//       </div>
//     </InteractiveIconContainer>
//   );
// }

// // Dans takesPage.tsx
// import { InteractiveIcon } from '../random-icon/InteractiveIcon';

// export default function TakePage() {
//   return (
//     <div style={{ position: 'relative' }}>
//       <InteractiveIcon 
//         position="top-right"
//         probability={1}
//         size={100}
//         sizeVariation={0.3}
//         positionVariation={30}
//       />
      
//       <InteractiveIcon 
//         position="bottom-left"
//         probability={1}
//         size={100}
//         sizeVariation={0.3}
//         positionVariation={30}
//       />
      
//       {/* Contenu */}
//     </div>
//   );
// }

// ============================================================================
// 6️⃣ MODAL DE PARTAGE - Ce qu'il fait
// ============================================================================

/**
 * Quand vous cliquez sur une icône :
 * 
 * ✅ Un modal s'ouvre avec:
 *    - Titre "Share it to others"
 *    - L'URL affichée
 *    - Bouton "Copier le lien" (copie dans le presse-papiers)
 *    - Feedback "Copié!" après la copie
 *    - Options de partage (Twitter, Facebook)
 *    - Bouton fermer
 * 
 * ✨ Responsive et belle animation
 */

// ============================================================================
// 7️⃣ DEBUG - Tester les variations
// ============================================================================

// Pour voir clairement l'effet, utilisez:
{/* <InteractiveIconContainer
  probability={1}          // Toujours affichées
  spotCount={5}            // Plusieurs icônes
  positions={['random']}   // Positions aléatoires
  iconSize={80}
  sizeVariation={0.5}      // Max variation taille
  positionVariation={60}   // Max variation position
>
  {/* À chaque refresh, positions/tailles différentes */}
// </InteractiveIconContainer> */}

// export {};
