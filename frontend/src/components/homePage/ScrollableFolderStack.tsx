import { useState, useRef, useEffect } from "react";
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
};

export default function ScrollableFolderStack({ posts }: ScrollableFolderStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [thumbTopPx, setThumbTopPx] = useState(0);

  // Calculate active index based on scroll progress
  const calculateActiveIndex = (progress: number) => {
    if (posts.length === 0) return null;
    return Math.round(progress * (posts.length - 1));
  };

  // Update active index based on scroll progress
  const updateStackPosition = (progress: number) => {
    const newIndex = calculateActiveIndex(progress);
    setActiveIndex(newIndex);
  };

  // Handle thumb drag
  const handleThumbPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    console.log('🎯 Pointer down on thumb');
    setIsDraggingThumb(true);
  };

  useEffect(() => {
    if (!isDraggingThumb) return;

    console.log('👆 Dragging started');

    const handlePointerMove = (e: PointerEvent) => {
      if (!scrollTrackRef.current) return;

      const trackRect = scrollTrackRef.current.getBoundingClientRect();
      const trackHeight = trackRect.height;
      const thumbHeight = 60; // Match CSS
      
      const pointerY = e.clientY - trackRect.top;
      // Clamp to track bounds
      const clampedY = Math.max(0, Math.min(trackHeight - thumbHeight, pointerY - thumbHeight / 2));
      const progress = trackHeight > thumbHeight ? clampedY / (trackHeight - thumbHeight) : 0;
      
      console.log(`📍 Y: ${pointerY.toFixed(0)}, Clamped: ${clampedY.toFixed(0)}, Progress: ${progress.toFixed(2)}`);
      
      setThumbTopPx(clampedY);
      updateStackPosition(progress);
    };

    const handlePointerUp = () => {
      console.log('✋ Pointer up');
      setIsDraggingThumb(false);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingThumb, posts.length]);

  return (
    <div className="stacked-folder-container">
      {/* Stack wrapper - shows overlapped folders */}
      <div className="stack-wrapper">
        <div 
          className="folder-stack"
          ref={stackRef}
        >
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

          {/* Article folders */}
          {posts.map((post, index) => (
            <div 
              className={`folder-card folder-card--${post._type} ${activeIndex === index ? 'folder-card--active' : ''}`}
              key={post.documentId}
              data-type={post._type}
            >
              <Link 
                to={getItemLink(post)} 
                className="article-link folder-image-link"
              >
                <div className="folder-svg-wrapper">
                  <img 
                    src={getBackgroundImage({ 
                      index, 
                      totalItems: posts.length,
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
          ))}

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
      <div 
        className="scroll-track"
        ref={scrollTrackRef}
      >
        <div
          className={`scroll-thumb ${isDraggingThumb ? 'dragging' : ''}`}
          ref={scrollThumbRef}
          style={{
            top: `${thumbTopPx}px`,
          }}
          onPointerDown={handleThumbPointerDown}
          title="Drag to scroll through folders"
        />
      </div>
    </div>
  );
}
