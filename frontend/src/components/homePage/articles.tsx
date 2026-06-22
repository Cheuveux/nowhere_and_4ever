// Article.tsx
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import MeceneButton from "../popup_banner/popupBanner";
import { getBackgroundImage } from "./getBackgroundImage";
import { getEndpoint } from '../../config/api';
import ScrollableFolderStack from './ScrollableFolderStack';
import FilterBar from "./filter/FilterBar";
import FilterOverlay from "./filter/FilterOverlay";
import { useFilter, filterPosts } from "./filter/useFilter";
import './articles.css';
import './filter/filter.css'

export type HomeItem = {
  documentId: string;
  _type: "article" | "conversation" | "quiz" | "mosaic" | "takes";
  Title?: string;
  Date?: string;
  Author?: string;
  Descriptiom?: string;
  Description?: string;
};

function getItemLink(item: HomeItem): string {
  if (item._type === "conversation") return `/conversation/${item.documentId}`;
  if (item._type === "takes") return `/takes/${item.documentId}`;
  if (item._type === "quiz") return "/quiz";
  if (item._type === "mosaic") return "/mosaics";
  return `/article/${item.documentId}`;
}

export default function Article() {
  const articlesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<HomeItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [gossipRoomSlug, setGossipRoomSlug] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showMeceneBtn, setShowMeceneBtn] = useState(false);


// Dans Article.tsx
const { activeFilter, toggle } = useFilter();
const [filterOverlayOpen, setFilterOverlayOpen] = useState(false);
const filteredPosts = filterPosts(posts, activeFilter);
const [currentStackIndex, setCurrentStackIndex] = useState(0);

// Réinitialise currentStackIndex à 0 quand filteredPosts change
useEffect(() => {
  setCurrentStackIndex(0);
}, [filteredPosts]);

// Découpage en chunks
const stacks = useMemo(() => {
  const chunkSize = 18;
  const chunks = [];
  for (let i = 0; i < filteredPosts.length; i += chunkSize) {
    chunks.push(filteredPosts.slice(i, i + chunkSize));
  }
  return chunks;
}, [filteredPosts]);

const currentStack = stacks[currentStackIndex] || [];

// Fonction pour changer de stack (avec vérification)
const handleStackChange = useCallback((index: number) => {
  if (index >= 0 && index < stacks.length) {
    setCurrentStackIndex(index);
  }
}, [stacks.length]);

// Animation GSAP
useEffect(() => {
  if (currentStack.length > 0) {
    gsap.from(".folder-card", {
      y: 50,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
    });
  }
}, [currentStackIndex, currentStack]);

  useEffect(() => {
    Promise.all([
      fetch(getEndpoint('/posts'), { headers: { Accept: "application/json" } }).then(r => r.json()),
      fetch(getEndpoint('/conversations'), { headers: { Accept: "application/json" } }).then(r => r.json()),
      fetch(getEndpoint('/mosaics'), { headers: { Accept: "application/json" } }).then(r => r.json()),
      fetch(getEndpoint('/takes'), { headers: { Accept: "application/json" } }).then(r => r.json()),
      fetch(getEndpoint('/rooms'), { headers: { Accept: "application/json" } }).then(r => r.json()),
    ])
      .then(([postsData, convsData, mosaicData, takesData, roomData]) => {
        const posts = (postsData.data || []).map((p: any) => ({ ...p, _type: "article" as const }));
        const convs = (convsData.data || []).map((c: any) => ({ ...c, _type: "conversation" as const }));
        const takes = (takesData.data || []).map((c: any) => ({
          ...c,
          _type: "takes" as const,
          Title: c.title,
          Author: c.id_code || "no code"
        }));

        const mosaicRaw = mosaicData.data || [];
        const mosaicCard: HomeItem[] = mosaicRaw.length
          ? [{
              documentId: "mosaic-entry",
              _type: "mosaic",
              Title: "Mosaic Gallery",
              Author: "?;D?;D?;D",
              Description: "Visual gallery collection",
            }]
          : [];

        const gossipRoom = (roomData.data || []).find((r: any) =>
          r.slug?.toLowerCase() === 'gossip-room'
        );
        if (gossipRoom) setGossipRoomSlug(gossipRoom.slug);

        setPosts([...(posts as HomeItem[]), ...(convs as HomeItem[]), ...mosaicCard, ...(takes as HomeItem[])]);
        setIsLoading(false);
      })
      .catch(err => { setError(err.message); setIsLoading(false); });
  }, []);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCardTap = (e: React.MouseEvent, cardId: string, _type: HomeItem['_type']) => {
    if (!isTouchDevice) return;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    if (e.clientY > rect.bottom - 15) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (expandedCardId === cardId) return;
    e.preventDefault();
    e.stopPropagation();
    setExpandedCardId(cardId);
  };

  const handleOpenGossipRoom = () => {
    if (gossipRoomSlug) navigate(`/chat/${gossipRoomSlug}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowMeceneBtn(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    gsap.from(articlesRef.current, { opacity: 0, y: 30, duration: 1, ease: "power2.out" });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!posts.length) return <p>No articles found.</p>;

  return (
    <div ref={articlesRef}>

      {/* Gossip Room button */}
      {gossipRoomSlug && (
        <button
          className="gossip-room-btn"
          onClick={handleOpenGossipRoom}
          title="Open Gossip Room"
        >
          <img src="https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/button/gossip_header.png" alt="Gossip Room" />
        </button>
      )}

      {isMobileView && (
        <button
          className="filter-trigger-btn"
          onClick={() => setFilterOverlayOpen(true)}
        >
          <img src="https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/button/filter_btn.jpg" alt="" height="48px" width="48px"/>
        </button>
      )}
      <FilterOverlay
        isOpen={filterOverlayOpen}
        active={activeFilter}
        onToggle={toggle}
        onClose={() => setFilterOverlayOpen(false)}
      />

      {/* ── Vue mobile ou desktop ───────────────────────────────── */}
  
      {isMobileView ? (
  <ScrollableFolderStack posts={filteredPosts} />
) : (
    <div className="folders-stack--wrapper">

        <div className="folders-stack">
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

          {/* Affichage du stack actuel */}
          {currentStack.map((post, index) => {
            // Calcul de l'index global dans filteredPosts
            const globalIndex = currentStackIndex * 5 + index;

              return (
                <div
                  className={`folder-card folder-card--${post._type} ${expandedCardId === post.documentId ? 'folder-card--expanded' : ''}`}
                  key={post.documentId}
                  data-type={post._type}
                >
                  <Link
                    to={getItemLink(post)}
                    className="article-link folder-image-link"
                    onClick={(e) => handleCardTap(e, post.documentId, post._type)}
                  >
                    <div className="folder-svg-wrapper">
                      <img
                        src={getBackgroundImage({
                          index: globalIndex, // Utilise l'index global
                          totalItems: filteredPosts.length, // Utilise la taille totale de filteredPosts
                          contentType: post._type
                        })}
                        alt={post.Title ?? "Untitled"}
                        className="folder-image"
                      />
                      <div className="folder-content">
                        <div className="folder-header">
                          <h2 className="folder-title">{post.Title ?? "Untitled"}</h2>
                          <span className="folder-author">{post.Date ?? "unknown"}</span>
                        </div>
                        <div className="folder-main-content">
                          <p>
                            {post.Descriptiom ?? ""}
                          </p>
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
          {/* Boutons d'index pour naviguer entre les stacks */}
          {stacks.length > 1 && (
        <div className="stack-index-buttons">
          {stacks.map((_, index) => (
            <button
              key={index}
              className={`stack-index-btn ${currentStackIndex === index ? 'active' : ''}`}
              onClick={() => handleStackChange(index)}
              disabled={index >= stacks.length} // <-- Désactive les boutons invalides
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

          {/* FilterBar desktop */}
          <FilterBar active={activeFilter} onToggle={toggle} />
        
    </div>
)}
      <MeceneButton isOpen={showMeceneBtn} />
    </div>
  );
}