import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FolderSVG from "../../assets/FolderSVG";
import './articles.css';
import gsap from "gsap";

type HomeItem = {
  documentId: string;
  _type: "article" | "conversation" | "quiz" | "mosaic";
  Title?: string;
  Author?: string;
  Descriptiom?: string;
  Description?: string;
};

function getItemLink(item: HomeItem): string {
  if (item._type === "conversation") return `/conversation/${item.documentId}`;
  if (item._type === "quiz") return "/quiz";
  if (item._type === "mosaic") return "/mosaics";
  return `/article/${item.documentId}`;
}

export default function Article() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<HomeItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:1337/api/posts", { headers: { Accept: "application/json" } }).then(r => r.json()),
      fetch("http://localhost:1337/api/conversations", { headers: { Accept: "application/json" } }).then(r => r.json()),
      fetch("http://localhost:1337/api/quizzes", { headers: { Accept: "application/json" } }).then(r => r.json()),
      fetch("http://localhost:1337/api/mosaics", { headers: { Accept: "application/json" } }).then(r => r.json()),
    ])
      .then(([postsData, convsData, quizzesData, mosaicData]) => {
        const posts = (postsData.data || []).map((p: any) => ({ ...p, _type: "article" as const }));
        const convs = (convsData.data || []).map((c: any) => ({ ...c, _type: "conversation" as const }));

        // Ton quiz page est /quiz (pas /quiz/:id), donc une seule card suffit
        const quizzesRaw = quizzesData.data || [];
        const quizCard: HomeItem[] = quizzesRaw.length
          ? [{
              documentId: "quiz-entry",
              _type: "quiz",
              Title: "Delusional Quiz",
              Author: "interactive",
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
              Author: "visual",
              Description: "Visual gallery collection",
            }]
          : [];

        setPosts([...(posts as HomeItem[]), ...(convs as HomeItem[]), ...quizCard, ...mosaicCard]);
        setIsLoading(false);
      })
      .catch(err => { setError(err.message); setIsLoading(false); });
  }, []);

  useEffect(() => {
    gsap.utils.toArray(".drawer-desc").forEach((el) => {
      gsap.fromTo(
        el as Element,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el as Element,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, [posts]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!posts.length) return <p>No articles found.</p>;

  return (
    <div className="folders-stack">
      {posts.map((post) => (
        <div className="folder-card" key={post.documentId}>
          <div className="folder-svg-wrapper">
            <FolderSVG />
            <div className="folder-content">
              <div className="folder-header">
                <Link to={getItemLink(post)} className="article-link">
                  <h2 className="folder-title">{post.Title ?? "Untitled"}</h2>
                </Link>
                <span className="folder-author">{post.Author ?? "unknown"}</span>
              </div>
              <div className="drawer-desc">
                <p className="article-desc">{post.Descriptiom ?? post.Description ?? ""}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}