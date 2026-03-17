import { useState } from "react";
import { useMosaic, mediaUrl, isVideo } from "./Usemosaic";
import "./MosaicGrid.css";

// On réutilise le type MosaicItem depuis le hook
// (si tu veux l'importer directement, exporte-le depuis useMosaic.ts)
type MosaicItem = {
  id: number;
  Titre: string;
  media: {
    mime: string;
    url: string;
    formats?: {
      small?: { url: string };
    } | null;
  };
};

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────
type LightboxProps = {
  item: MosaicItem;
  onClose: () => void;
};

function Lightbox({ item, onClose }: LightboxProps) {
  // Ferme si on clique sur le backdrop (pas sur le contenu)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Ferme avec la touche Escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="lightbox-backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div className="lightbox-content">
        {/* Bouton fermer */}
        <button className="lightbox-close" onClick={onClose} aria-label="Fermer">
          ✕
        </button>

        {/* Media en grand */}
        <div className="lightbox-media">
          {isVideo(item.media.mime) ? (
            <video
              src={mediaUrl(item.media.url)}
              controls
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={mediaUrl(item.media.url)}
              alt={item.Titre}
            />
          )}
        </div>

        {/* Titre */}
        <p className="lightbox-title">{item.Titre}</p>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function MosaicGrid() {
  const { section, loading, error } = useMosaic();

  // null = lightbox fermée, MosaicItem = item affiché
  const [selected, setSelected] = useState<MosaicItem | null>(null);

  if (loading) return <div className="mosaic-state">Loading…</div>;
  if (error)   return <div className="mosaic-state mosaic-state--error">Error: {error}</div>;
  if (!section) return null;

  return (
    <section className="mosaic-section">
      <h2 className="mosaic-section__title">{section.Titre}</h2>

      <div className="mosaic-grid">
        {section.mosaic_content.map((item) => (
          <article
            key={item.id}
            className="mosaic-card"
            onClick={() => setSelected(item)}  // ← ouvre la lightbox
          >
            <div className="mosaic-card__media">
              {isVideo(item.media.mime) ? (
                <video
                  src={mediaUrl(item.media.url)}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={mediaUrl(item.media.formats?.small?.url ?? item.media.url)}
                  alt={item.Titre}
                  loading="lazy"
                />
              )}
            </div>
            <div className="mosaic-card__footer">
              <p className="mosaic-card__title">{item.Titre}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox — rendue seulement si un item est sélectionné */}
      {selected && (
        <Lightbox
          item={selected}
          onClose={() => setSelected(null)}  // ← ferme la lightbox
        />
      )}
    </section>
  );
}