import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getBackgroundImage } from "./getBackgroundImage";
import './scrollableFolderStack.css';

type HomeItem = {
  documentId: string;
  _type: "article" | "conversation" | "quiz" | "mosaic" | "takes";
  Title?: string;
  Author?: string;
  Description?: string;
};

function getItemLink(item: HomeItem): string {
  if (item._type === "conversation") return `/conversation/${item.documentId}`;
  if (item._type === "takes") return `/takes/${item.documentId}`;
  if (item._type === "quiz") return "/quiz";
  if (item._type === "mosaic") return "/mosaics";
  return `/article/${item.documentId}`;
}

type ScrollableFolderStackProps = {
  posts: HomeItem[];
  chunkSize?: number;
};

export default function ScrollableFolderStack({ posts, chunkSize = 8 }: ScrollableFolderStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [thumbTopPx, setThumbTopPx] = useState(0);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  // Réinitialiser currentChunkIndex à 0 quand posts change
  useEffect(() => {
    setCurrentChunkIndex(0);
    setActiveIndex(0);
    setThumbTopPx(0);
  }, [posts]);

  // Découper les posts en chunks
  const chunks = useMemo(() => {
    const result: HomeItem[][] = [];
    for (let i = 0; i < posts.length; i += chunkSize) {
      result.push(posts.slice(i, i + chunkSize));
    }
    return result;
  }, [posts, chunkSize]);

  const currentChunk = chunks[currentChunkIndex] || [];

  // Fonctions pour naviguer entre les chunks
  const goToPreviousChunk = () => {
    if (currentChunkIndex > 0) {
      setCurrentChunkIndex(currentChunkIndex - 1);
      setActiveIndex(0);
      setThumbTopPx(0);
    }
  };

  const goToNextChunk = () => {
    if (currentChunkIndex < chunks.length - 1) {
      setCurrentChunkIndex(currentChunkIndex + 1);
      setActiveIndex(0);
      setThumbTopPx(0);
    }
  };

  // Calculate active index based on scroll progress
  const calculateActiveIndex = (progress: number) => {
    if (currentChunk.length === 0) return null;
    return Math.round(progress * (currentChunk.length - 1));
  };

  // Update active index based on scroll progress
  const updateStackPosition = (progress: number) => {
    const newIndex = calculateActiveIndex(progress);
    setActiveIndex(newIndex);
  };

  // Handle thumb drag
  const handleThumbPointerDown = (e: React.PointerEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingThumb(true);
  };

  useEffect(() => {
    if (!isDraggingThumb) return;

    const handleMove = (e: PointerEvent | TouchEvent) => {
      if (!scrollTrackRef.current) return;

      const trackRect = scrollTrackRef.current.getBoundingClientRect();
      const trackHeight = trackRect.height;
      const thumbHeight = 60;

      const clientY = 'touches' in e ? e.touches[0].clientY : (e as PointerEvent).clientY;
      const pointerY = clientY - trackRect.top;

      const clampedY = Math.max(0, Math.min(trackHeight - thumbHeight, pointerY - thumbHeight / 2));
      const progress = trackHeight > thumbHeight ? clampedY / (trackHeight - thumbHeight) : 0;

      setThumbTopPx(clampedY);
      updateStackPosition(progress);
    };

    const handleEnd = () => {
      setIsDraggingThumb(false);
    };

    document.addEventListener('pointermove', handleMove as EventListener);
    document.addEventListener('pointerup', handleEnd);
    document.addEventListener('touchmove', handleMove as EventListener, { passive: false });
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('pointermove', handleMove as EventListener);
      document.removeEventListener('pointerup', handleEnd);
      document.removeEventListener('touchmove', handleMove as EventListener);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDraggingThumb, currentChunk.length]);

  return (
    <div className="stacked-folder-container">
      {/* Stack wrapper - shows overlapped folders */}
      <div className="stack-wrapper">
        <div className="folder-stack" ref={stackRef}>
          {/* Header folder */}
          <div className="folder-card folder-card--header">
            <div className="folder-svg-wrapper">
              <img
                src="/img_assets/folder_homepage/header_folder.png"
                alt="Header"
                className="folder-image"
              />
            </div>
          </div>

          {/* Article folders - uniquement le chunk actuel */}
          {currentChunk.map((post, index) => {
            const globalIndex = currentChunkIndex * chunkSize + index;
            return (
              <div
                className={`folder-card folder-card--${post._type} ${activeIndex === index ? 'folder-card--active' : ''}`}
                key={post.documentId}
                data-type={post._type}
              >
                <Link to={getItemLink(post)} className="article-link folder-image-link">
                  <div className="folder-svg-wrapper">
                    <img
                      src={getBackgroundImage({
                        index: globalIndex,
                        totalItems: posts.length, // posts est déjà filtré
                        contentType: post._type
                      })}
                      alt={post.Title ?? "Untitled"}
                      className="folder-image"
                    />
                    <div className="folder-content">
                      <div className="folder-header">
                        <h2 className="folder-title">{post.Title ?? "Untitled"}</h2>
                        <span className="folder-author">{post.Author ?? "unknown"}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}

          {/* Footer folder */}
          <div className="folder-card folder-card--footer">
            <div className="folder-svg-wrapper">
              <img
                src="/img_assets/folder_homepage/footer_folder.png"
                alt="Footer"
                className="folder-image"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom scroll bar on the right */}
      <div className="scroll-track" ref={scrollTrackRef}>
        <div
          className={`scroll-thumb ${isDraggingThumb ? 'dragging' : ''}`}
          ref={scrollThumbRef}
          style={{
            top: `${thumbTopPx}px`,
          }}
          onPointerDown={handleThumbPointerDown as React.PointerEventHandler<HTMLDivElement>}
          onTouchStart={handleThumbPointerDown as React.TouchEventHandler<HTMLDivElement>}
          title="Drag to scroll through folders"
        >
          <img src="https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/button/grab_button.png" alt="scroll thumb"/>
        </div>
      </div>

      {/* Boutons de navigation entre les chunks */}
      {chunks.length > 1 && (
        <div className="chunk-navigation">
          <button
            onClick={goToPreviousChunk}
            disabled={currentChunkIndex === 0}
            className="chunk-nav-btn"
          >
            ← Précédent
          </button>
          <span className="chunk-indicator">
            {currentChunkIndex + 1} / {chunks.length}
          </span>
          <button
            onClick={goToNextChunk}
            disabled={currentChunkIndex === chunks.length - 1}
            className="chunk-nav-btn"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}