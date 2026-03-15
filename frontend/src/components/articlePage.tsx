import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { renderContent } from "../utils/renderContent";
import './articlePage.css'

export default function ArticlePage() {
    const { id } = useParams();
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(
            `http://localhost:1337/api/posts/${id}?populate=illu&populate=music_video&populate[audio_track][populate]=*`
        )
            .then((res) => res.json())
            .then((data) => {
                setArticle(data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (!article) return;
        gsap.utils.toArray(".article-content p").forEach((el) => {
            gsap.fromTo(
                el as Element,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    scrollTrigger: {
                        trigger: el as Element,
                        start: "top 85%",
                        end: "bottom 70%",
                        toggleActions: "play none none reverse",
                    },
                    duration: 1.2,
                    ease: "power2.out",
                }
            );
        });
    }, [article]);

    if (loading) return <p>Loading...</p>;
    if (!article) return <p>Article not found.</p>;
    return (
        <div>
            <div className="articlePage-header">
                <div className="return_btn">
                    <Link to="/">../home/</Link>
                </div>
                <h1>{article.Title}</h1>
                <div className="article_author">
                    <h2>by {article.Author}</h2>
                </div>
            </div>
            <div className="article-content">
                {renderContent(article)}
            </div>
        </div>
    );
}