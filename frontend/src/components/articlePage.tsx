import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

export default function ArticlePage() {
	const { id } = useParams();
	const [article, setArticle] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`http://localhost:1337/api/posts/${id}`)
			.then((res) => res.json())
			.then((data) => {
				console.log("API response:", data); // Debug: see the full response
				setArticle(data.data);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	}, [id]);

	if (loading) return <p>Loading...</p>;
	if (!article) return <p>Article not found.</p>;
	return (
		<div>
			<Link to="/">← Back to articles</Link>
			<h1>{article.Title}</h1>
			<p>{article.Descriptiom}</p>
			{article.Content && <BlocksRenderer content={article.Content} />}
		</div>
	);
}