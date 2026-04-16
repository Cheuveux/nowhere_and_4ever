import { useState, useRef, useEffect} from "react";
import {  Link } from "react-router-dom";
import { useMosaic, mediaUrl, isVideo } from "./Usemosaic";
import gsap from "gsap";

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
  const [_isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Formate le temps en mm:ss
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Auto-play la vidéo quand la lightbox s'ouvre
  useEffect(() => {
    if (isVideo(item.media.mime) && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [item.id]);

  // Met à jour le temps courant et la durée
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

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
                loop 
              />
              {/* Timer en bas à droite (style YouTube) */}
              <div className="lightbox-video-timer">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
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
          <div className="lightbox__meta">
            {item.Date && <span className="mosaic-card__date">Published from {item.Date}</span>}
            {item.Views !== undefined && <span className="mosaic-card__views">{item.Views} views</span>}
          </div>
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
  const cardRefs = useRef<HTMLElement[]>([]);
  const [gridVideoTimes, setGridVideoTimes] = useState<{ [key: number]: { current: number; duration: number } }>({});

  // Formate le temps en mm:ss
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleGridVideoClick = (e: React.MouseEvent, item: MosaicItem) => {
    e.stopPropagation();
    setSelected(item); // ouvre la lightbox
  };

  const handleCardClick = (item: MosaicItem) => {
    setSelected(item);
  };

  // Met à jour le temps et la durée pour chaque vidéo de la grille
  useEffect(() => {
    const listeners: { [key: number]: () => void } = {};

    Object.entries(gridVideoRefs.current).forEach(([idStr, video]) => {
      if (video) {
        const id = parseInt(idStr);
        
        const handleTimeUpdate = () => {
          setGridVideoTimes((prev) => ({
            ...prev,
            [id]: { current: video.currentTime, duration: video.duration },
          }));
        };

        listeners[id] = handleTimeUpdate;
        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", handleTimeUpdate);
      }
    });

    return () => {
      Object.entries(gridVideoRefs.current).forEach(([idStr, video]) => {
        if (video && listeners[parseInt(idStr)]) {
          video.removeEventListener("timeupdate", listeners[parseInt(idStr)]);
          video.removeEventListener("loadedmetadata", listeners[parseInt(idStr)]);
        }
      });
    };
  }, []);

  // Animation GSAP des cartes au chargement
  useEffect(() => {
    if (!section || cardRefs.current.length === 0) return;

    gsap.fromTo(
      cardRefs.current,
      {
        opacity: 0,
        x: (index) => (index % 2 === 0 ? -100 : 100), // Alternée : gauche/droite
        y: 20,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      }
    );
  }, [section]);

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
        {section.mosaic_content.map((item, index) => (
          <article
            key={item.id}
            ref={(el) => { if (el) cardRefs.current[index] = el; }}
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
                  {/* Timer en bas à droite */}
                  <div className="mosaic-card-video-timer" onClick={(e) => handleGridVideoClick(e, item)}>
                    {formatTime(gridVideoTimes[item.id]?.current ?? 0)} / {formatTime(gridVideoTimes[item.id]?.duration ?? 0)}
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
                {item.Date && <span className="mosaic-card__date">Published from {item.Date}</span>}
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
          }}  // ← ferme la lightbox
        />
      )}
    </section>
  );
}