import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import MeceneButton from "../popup_banner/popupBanner";
import { getBackgroundImage } from "./getBackgroundImage";
import { getEndpoint } from '../../config/api';
import './articles.css';

type HomeItem = {
  documentId: string;
  _type: "article" | "conversation" | "quiz" | "mosaic" | "takes";
  Title?: string;
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

  const [showMeceneBtn, setShowMeceneBtn] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(getEndpoint('/posts'), { headers: { Accept: "application/json" } }).then(r => r.json()),
      fetch(getEndpoint('/conversations'), { headers: { Accept: "application/json" } }).then(r => r.json()),
      fetch(getEndpoint('/mosaics'), { headers: { Accept: "application/json" } }).then(r => r.json()),
      fetch(getEndpoint('/takes'), { headers: { Accept: "application/json" } }).then(r => r.json()),
      fetch(getEndpoint('/rooms'), { headers: { Accept: "application/json" } }).then(r => r.json()), // ✅ Sans filtrer d'abord
    ])
      .then(([postsData, convsData, mosaicData, takesData, roomData]) => {
        console.log('📋 ALL ROOMS from Strapi:', roomData.data); // Affiche TOUT
        
        const posts = (postsData.data || []).map((p: any) => ({ ...p, _type: "article" as const }));
        const convs = (convsData.data || []).map((c: any) => ({ ...c, _type: "conversation" as const })); 
        const takes = (takesData.data || []).map((c: any) => ({ 
          ...c, 
          _type: "takes" as const,
          Title: c.title,
          Author: c.id_code || "no code"
        })); 

        // Mosaic card
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

        // ✅ Cherche la Gossip Room par slug (plus robuste)
        const gossipRoom = (roomData.data || []).find((r: any) => 
          r.slug?.toLowerCase() === 'gossip-room'
        );
        
        if (gossipRoom) {
          setGossipRoomSlug(gossipRoom.slug);
          console.log('✅ Gossip Room trouvée:', gossipRoom.slug, gossipRoom);
        } else {
          console.log('❌ Gossip Room NOT found.');
          console.log('Rooms disponibles:', (roomData.data || []).map((r: any) => ({ name: r.name, slug: r.slug })));
        }

        setPosts([...(posts as HomeItem[]), ...(convs as HomeItem[]), ...mosaicCard, ...(takes as HomeItem[])]);
        setIsLoading(false);
      })
      .catch(err => { setError(err.message); setIsLoading(false); });
  }, []);


  // Detect touch device on mount
  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);
  }, []);

  // Handle card tap on mobile
  const handleCardTap = (e: React.MouseEvent, cardId: string, _type: HomeItem['_type']) => {
    // Only on touch devices
    if (!isTouchDevice) return;

    // If already expanded, allow navigation on second tap
    if (expandedCardId === cardId) {
      setExpandedCardId(null);
      return;
    }

    // First tap - show content and change background
    e.preventDefault();
    e.stopPropagation();
    setExpandedCardId(cardId);
  };

  const handleOpenGossipRoom = () => {
    if (gossipRoomSlug) {
      navigate(`/chat/${gossipRoomSlug}`);
    }
  };

  // Mecene Button Timer
  useEffect(() => { 
    const timer = setTimeout(() => {
      setShowMeceneBtn(true); 
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Animation d'entrée smooth
  useEffect(() => {
    gsap.from(articlesRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power2.out"
    });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!posts.length) return <p>No articles found.</p>;

  return (
    <div ref={articlesRef}>
      {gossipRoomSlug && (
        <button 
          className="gossip-room-btn" 
          onClick={handleOpenGossipRoom}
          title="Open Gossip Room"
        >
          <img src="/img_assets/icons/room_btn.png" alt="Gossip Room" />
        </button>
      )}
        <div 
          className="folders-stack"
          // style={hoveredType ? getPageBackground(hoveredType) : {}}
        >
          {/* Header folder at the top */}
        <div className="folder-card folder-card--header">
          <div className="folder-svg-wrapper">
            <img 
              src="/img_assets/folder_homepage/header_folder.png"
              alt="Header"
              className="folder-image"
            />
          </div>
        </div>

        {posts.map((post, index) => (
    <div 
      className={`folder-card folder-card--${post._type} ${expandedCardId === post.documentId ? 'folder-card--expanded' : ''}`}
      key={post.documentId}
      data-type={post._type}
      // onMouseEnter={() => !isTouchDevice && setHoveredType(post._type)}
      // onMouseLeave={() => !isTouchDevice && setHoveredType(null)}
    >
        <Link to={getItemLink(post)} className="article-link folder-image-link" onClick={(e) => handleCardTap(e, post.documentId, post._type)}>
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
    
      {/* Footer folder at the bottom */}
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

      {/* Add the mecene button */}
      <MeceneButton isOpen={showMeceneBtn} />
    </div>
  );
}