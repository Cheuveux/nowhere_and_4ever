import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FolderSVG from "../assets/FolderSVG";
import './articles.css';
import gsap from "gsap";

export default function Article() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:1337/api/posts", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setPosts(data.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
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
      {posts.map((post: any) => (
        <div className="folder-card" key={post.documentId}>
          <div className="folder-svg-wrapper">
            <FolderSVG />
            <div className="folder-content">
              <div className="folder-header">
                <Link to={`/article/${post.documentId}`} className="article-link">
                  <h2 className="folder-title">{post.Title}</h2>
                </Link>
                <span className="folder-author">{post.Author}</span>
              </div>
              <div className="drawer-desc">
                <p className="article-desc">{post.Descriptiom}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}