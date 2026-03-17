import { useState, useRef, useEffect} from "react";
import {  Link } from "react-router-dom";
import { useMosaic, mediaUrl, isVideo } from "./Usemosaic";
import "./MosaicGrid.css";

// On réutilise le type MosaicItem depuis le hook
// (si tu veux l'importer directement, exporte-le depuis useMosaic.ts)
type MosaicItem = {
  id: number;
  Titre: string;
  Date?: string;
  Views?: number;
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play la vidéo quand la lightbox s'ouvre
  useEffect(() => {
    if (isVideo(item.media.mime) && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [item.id]);

  // Ferme si on clique sur le backdrop (pas sur le contenu)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // Ferme avec la touche Escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleClose();
  };

  // Arrête la vidéo quand la lightbox se ferme
  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    onClose();
  };

  const togglePlayVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
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
        <button className="lightbox-close" onClick={handleClose} aria-label="Fermer">
          ✕
        </button>

        {/* Media en grand */}
        <div className="lightbox-media">
          {isVideo(item.media.mime) ? (
            <div className="lightbox-video-container" onClick={togglePlayVideo}>
              <video
                ref={videoRef}
                src={mediaUrl(item.media.url)}
                playsInline
              />
              {!isPlaying && (
                <div className="lightbox-video-play-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
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
  const gridVideoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);

  const handleGridVideoClick = (e: React.MouseEvent, item: MosaicItem) => {
    e.stopPropagation();
    setSelected(item); // ouvre la lightbox
  };

  const handleCardClick = (item: MosaicItem) => {
    setSelected(item);
  };

  if (loading) return <div className="mosaic-state">Loading…</div>;
  if (error)   return <div className="mosaic-state mosaic-state--error">Error: {error}</div>;
  if (!section) return null;

  return (
    <section className="mosaic-section">
      <div className="mosaic-header">
        <div className="returnBtn"> <Link to="/">../home/</Link></div>
        <h2 className="mosaic-section__title">{section.Titre}</h2>
      </div>

      <div className="mosaic-grid">
        {section.mosaic_content.map((item) => (
          <article
            key={item.id}
            className="mosaic-card"
            onClick={() => handleCardClick(item)}  // ← ouvre la lightbox
          >
            <div className="mosaic-card__media">
              {isVideo(item.media.mime) ? (
                <div className="mosaic-card-video-container">
                  <video
                    ref={(el) => { gridVideoRefs.current[item.id] = el; }}
                    src={mediaUrl(item.media.url)}
                    loop
                    playsInline
                  />
                  <div className="mosaic-card-play-btn" onClick={(e) => handleGridVideoClick(e, item)}>
                    {playingVideoId === item.id ? (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </div>
                </div>
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
              <div className="mosaic-card__meta">
                {item.Date && <span className="mosaic-card__date">{item.Date}</span>}
                {item.Views !== undefined && <span className="mosaic-card__views">{item.Views} views</span>}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox — rendue seulement si un item est sélectionné */}
      {selected && (
        <Lightbox
          item={selected}
          onClose={() => {
            setSelected(null);
            // Arrête la vidéo de la grille si elle joue
            if (playingVideoId !== null) {
              const video = gridVideoRefs.current[playingVideoId];
              if (video) {
                video.pause();
                video.currentTime = 0;
              }
              setPlayingVideoId(null);
            }
          }}  // ← ferme la lightbox
        />
      )}
    </section>
  );
}