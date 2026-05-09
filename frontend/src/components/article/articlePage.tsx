import { CommentSection } from "../comments/commentSection";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getEndpoint } from "../../config/api";
gsap.registerPlugin(ScrollTrigger);
import { renderContent } from "../../utils/renderContent";
import { InteractiveIconContainer } from '../random-icon/InteractiveIcon';
import DelusionalQuiz from "../quiz/DelusionalQuiz";
import './articlePage.css'

export default function ArticlePage() {
    const { id } = useParams();
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showQuizz, setShowQuizz] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

    useEffect(() => {
        fetch(
            getEndpoint(`/posts/${id}?populate=illu&populate=music_video&populate[audio_track][populate]=*`)
        )
            .then((res) => res.json())
            .then((data) => {
                setArticle(data.data);
                
                // Fetch quiz questions only for the specific article
                if (data.data?.documentId === "n6cb5cfnokbm5z7wfkujy8d1") {
                    fetch(getEndpoint(`/quizzes?populate[answer]=*&sort=order:asc`))
                        .then((res) => res.json())
                        .then((quizData) => setQuizQuestions(quizData.data || []))
                        .catch((err) => console.error("Quiz fetch error:", err));
                }
                
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
        <InteractiveIconContainer
          probability={1}
          spotCount={1}
          positions={['bottom-left']}
          iconSize={120}
          sizeVariation={0.3}
          positionVariation={0}
          fixed={true}
        >
        <div className="article-page-wrapper">
            <div className="articlePage-header">
                <div className="return_btn">
                    <Link to="/">../home/</Link>
                </div>
                <div className="article_title">
                    <h1>{article.Title}</h1>
                </div>
                <div className="article_author">
                    <h2>by {article.Author}</h2>
                </div>
            </div>
            <div className="article-content">
                {renderContent(article)}
            </div>
            {article.documentId === "n6cb5cfnokbm5z7wfkujy8d1" && quizQuestions.length > 0 && (
                <div className="article-quizz-container">
                    <div className="article-quizz-preview">
                        <h3>Pillow Talk</h3>
                        <button onClick={() => setShowQuizz(true)} className="article-quizz-button">
                            Start Quiz →
                        </button>
                    </div>
                    {showQuizz && (
                        <div className="article-quizz-modal">
                            <button className="article-quizz-close" onClick={() => setShowQuizz(false)}>✕</button>
                            <DelusionalQuiz quizData={quizQuestions} />
                        </div>
                    )}
                </div>
            )}
            <div className="article-comments-container">
                <CommentSection articleId={article.id} />
            </div>
        </div>
        </InteractiveIconContainer>
    );
}