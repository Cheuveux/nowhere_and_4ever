import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './articles.css';

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!posts.length) return <p>No articles found.</p>;

  return (
    <div>
      {posts.map((post: any) => (
        <div key={post.documentId} className="article-card">
		  <Link to={`/article/${post.documentId}`}>
          <h2>{post.Title}</h2>
		  </Link>
          <p className="article-desc">
            {post.Descriptiom}
          </p>
        </div>
      ))}
    </div>
  );
}