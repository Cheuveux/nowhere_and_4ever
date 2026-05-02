# 🎨 Icônes Aléatoires - Documentation

Ce système permet d'ajouter des icônes décoratives aléatoires depuis votre bucket Cloudflare R2 à différents endroits de votre site.

## 📁 Structure des fichiers

```
src/
├── hooks/
│   └── useRandomIcon.ts          # Hook personnalisé
├── components/random-icon/
│   ├── RandomIcon.tsx             # Composant simple pour 1 icône
│   ├── RandomIconSpot.tsx         # Composant avec positionnement
│   ├── RandomIconSpot.css         # Styles et animations
│   └── USAGE_EXAMPLES.tsx         # Exemples d'utilisation
```

## 🚀 3 Façons d'Utiliser

### 1️⃣ **Icône Simple Inline** (RandomIcon)

Ajoute une icône aléatoire directement dans le texte :

```jsx
import { RandomIcon } from './components/random-icon/RandomIcon';

<p>
  Ceci est un texte avec une icône : <RandomIcon size={30} probability={0.7} />
</p>
```

**Props disponibles:**
- `size: number` - Taille en pixels (défaut: 40)
- `probability: number` - Chance d'affichage 0-1 (défaut: 0.5)
- `className: string` - Classes CSS personnalisées
- `onIconChange: (id) => void` - Callback quando change

---

### 2️⃣ **Icônes Positionnées** (RandomIconSpot)

Ajoute une icône dans un coin ou position spécifique :

```jsx
import { RandomIconSpot } from './components/random-icon/RandomIconSpot';

<div style={{ position: 'relative', height: '300px' }}>
  <RandomIconSpot position="top-left" size={50} probability={0.5} />
  <RandomIconSpot position="bottom-right" size={50} probability={0.5} />
  
  <h2>Contenu de votre page</h2>
</div>
```

**Positions disponibles:**
- `'top-left'` - Coin haut gauche
- `'top-right'` - Coin haut droit
- `'bottom-left'` - Coin bas gauche
- `'bottom-right'` - Coin bas droit
- `'center'` - Centre
- `'custom'` - Position personnalisée (utiliser `x` et `y` en %)

---

### 3️⃣ **Conteneur Multiicônes** (IconSpotContainer)

Enveloppe votre contenu avec plusieurs icônes aux positions prédéfinies :

```jsx
import { IconSpotContainer } from './components/random-icon/RandomIconSpot';

<IconSpotContainer 
  probability={0.4}      // 40% de chance par icône
  spotCount={3}          // 3 emplacements
  positions={['top-left', 'top-right', 'bottom-right']}
  iconSize={45}
>
  <article>
    <h2>Mon Article</h2>
    <p>Contenu...</p>
  </article>
</IconSpotContainer>
```

---

## 🎯 Intégration dans vos pages existantes

### Dans `articles.tsx` (Homepage)

```jsx
import { IconSpotContainer } from '../random-icon/RandomIconSpot';

export default function Articles() {
  return (
    <IconSpotContainer probability={0.3} spotCount={2}>
      <div className="articles-container">
        {/* Votre contenu articles */}
      </div>
    </IconSpotContainer>
  );
}
```

### Dans `articlePage.tsx`

```jsx
import { RandomIconSpot } from '../random-icon/RandomIconSpot';

export default function ArticlePage() {
  return (
    <div style={{ position: 'relative' }}>
      <RandomIconSpot position="top-right" probability={0.5} size={50} />
      <RandomIconSpot position="bottom-left" probability={0.3} size={45} />
      
      <article>
        {/* Votre contenu d'article */}
      </article>
    </div>
  );
}
```

### Dans `conversation.tsx`

```jsx
import { IconSpotContainer } from '../random-icon/RandomIconSpot';

export default function ConversationPage() {
  return (
    <IconSpotContainer probability={0.25} spotCount={1}>
      <div className="conversation">
        {/* Votre contenu de conversation */}
      </div>
    </IconSpotContainer>
  );
}
```

### Dans `DelusionalQuiz.tsx`

```jsx
import { RandomIcon } from '../random-icon/RandomIcon';

// Dans votre quiz, en haut ou bas de la page
<div className="quiz-header">
  <h1>Delusional Quiz <RandomIcon size={35} probability={0.7} /></h1>
</div>
```

---

## ⚙️ Configuration Avancée

### Positions personnalisées

```jsx
// Position précise (x=30% du parent, y=20% du parent)
<RandomIconSpot position="custom" x={30} y={20} size={50} />
```

### Styling personnalisé

```jsx
// Avec classe CSS
<RandomIcon 
  className="my-custom-style"
  style={{ opacity: 0.8 }}
/>
```

### Hook personnalisé pour contrôle total

```jsx
import { useRandomIcon } from './hooks/useRandomIcon';

function MyComponent() {
  const { url, iconId } = useRandomIcon({ 
    probability: 0.6,
    totalIcons: 24 
  });

  if (!url) return <p>No icon this time</p>;

  return (
    <div>
      <p>Icon #{iconId}</p>
      <img src={url} alt={`Icon ${iconId}`} />
    </div>
  );
}
```

---

## 🎨 Animations

Les icônes ont plusieurs animations CSS disponibles :

- **`fadeInScale`** - Animation de chargement par défaut (0.5s)
- **`float`** - Animation douce de flottement (3s, répétée)
- **`spin`** - Rotation continue

```jsx
// Les animations s'appliquent automatiquement via la classe 'animate'
// Pour personnaliser, modifiez RandomIconSpot.css
```

---

## 🔍 Contrôle des probabilités

| Probabilité | Résultat |
|------------|----------|
| `0` ou `null` | Jamais d'icône |
| `0.1` | 10% de chance |
| `0.3` | 30% de chance (standard pour les coins) |
| `0.5` | 50% de chance (défaut) |
| `0.7` | 70% de chance |
| `1` | Toujours une icône |

---

## 📱 Responsive

Le système est automatiquement responsive. Sur mobile, les icônes se réduisent d'environ 40%.

Pour personnaliser le comportement mobile, éditez `RandomIconSpot.css`.

---

## 🐛 Troubleshooting

### Les icônes ne s'affichent pas

1. Vérifiez que les URLs sont accessibles :
   - `https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/icons/1.png` ... 24.png

2. Vérifiez la console pour les erreurs CORS

3. Assurez-vous que le parent de `RandomIconSpot` a `position: relative`

### Les positions sont bizarres

Vérifiez que le conteneur parent a `position: relative`.

```jsx
<div style={{ position: 'relative' }}>  {/* IMPORTANT */}
  <RandomIconSpot position="top-left" />
</div>
```

---

## 💡 Tips

✅ **Utilisez `probability` pour contrôler la fréquence**
```jsx
// Icônes rares
<RandomIconSpot probability={0.2} />

// Icônes très fréquentes
<RandomIconSpot probability={0.8} />
```

✅ **Combinez plusieurs spots pour plus d'intérêt**
```jsx
<RandomIconSpot position="top-left" probability={0.3} />
<RandomIconSpot position="top-right" probability={0.2} />
<RandomIconSpot position="bottom-left" probability={0.1} />
```

✅ **Utilisez `IconSpotContainer` pour les sections principales**
```jsx
// Enveloppe l'entièreté d'une section
<IconSpotContainer spotCount={2}>
  {/* Contenu */}
</IconSpotContainer>
```

---

## 📚 Fichiers clés

- [RandomIcon.tsx](RandomIcon.tsx) - Composant simple
- [RandomIconSpot.tsx](RandomIconSpot.tsx) - Composant avec positions
- [useRandomIcon.ts](../../hooks/useRandomIcon.ts) - Hook personnalisé
- [RandomIconSpot.css](RandomIconSpot.css) - Styles et animations
- [USAGE_EXAMPLES.tsx](USAGE_EXAMPLES.tsx) - Exemples détaillés
