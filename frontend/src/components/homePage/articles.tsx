import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MeceneButton from "../popup_banner/popupBanner";
import { getPageBackground} from './folderBackground';
import { getBackgroundImage } from "./getBackgroundImage";
import './articles.css';
// import gsap from "gsap";

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

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<HomeItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hoveredType, setHoveredType] = useState<HomeItem['_type'] | null>(null);

  const [showMeceneBtn, setShowMeceneBtn] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:1337/api/posts", { headers: { Accept: "application/json" } }).then(r => r.json()),
      fetch("http://localhost:1337/api/conversations", { headers: { Accept: "application/json" } }).then(r => r.json()),
      fetch("http://localhost:1337/api/quizzes", { headers: { Accept: "application/json" } }).then(r => r.json()),
      fetch("http://localhost:1337/api/mosaics", { headers: { Accept: "application/json" } }).then(r => r.json()),
      fetch("http://localhost:1337/api/takes", { headers: { Accept: "application/json" } }).then(r => r.json()),
    ])
      .then(([postsData, convsData, quizzesData, mosaicData, takesData]) => {
        const posts = (postsData.data || []).map((p: any) => ({ ...p, _type: "article" as const }));
        const convs = (convsData.data || []).map((c: any) => ({ ...c, _type: "conversation" as const })); 
        const takes = (takesData.data || []).map((c: any) => ({ 
          ...c, 
          _type: "takes" as const,
          Title: c.title,
          Author: c.id_code || "no code"
        })); 

        // quiz page est /quiz (pas /quiz/:id), donc une seule card suffit
        const quizzesRaw = quizzesData.data || [];
        const quizCard: HomeItem[] = quizzesRaw.length
          ? [{
              documentId: "quiz-entry",
              _type: "quiz",
              Title: "Delusional Quiz",
              Author: "?;D?;D?;D",
              Descriptiom: "10 questions. 4 possible fates.",
            }]
          : [];

        // Mosaic card - même logique que le quiz
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

        setPosts([...(posts as HomeItem[]), ...(convs as HomeItem[]), ...quizCard, ...mosaicCard, ...(takes as HomeItem[])]);
        setIsLoading(false);
      })
      .catch(err => { setError(err.message); setIsLoading(false); });
  }, []);


  // Mecene Button Timer
  useEffect(() => { 
    const timer = setTimeout(() => {
      setShowMeceneBtn(true); 
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!posts.length) return <p>No articles found.</p>;

  return (
    <div 
      className="folders-stack"
      style={hoveredType ? getPageBackground(hoveredType) : {}}
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
    className={`folder-card folder-card--${post._type}`}
    key={post.documentId}
    onMouseEnter={() => setHoveredType(post._type)}
    onMouseLeave={() => setHoveredType(null)}
  >
      <Link to={getItemLink(post)} className="article-link folder-image-link">
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

  {/* Add the mecene button */}
  <MeceneButton isOpen={showMeceneBtn} />
  </div>
  );
}