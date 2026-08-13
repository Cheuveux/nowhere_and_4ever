import { useEffect, useState } from "react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import type { CommentData } from "./comment"
import { fetchComments, postComment } from "./commentService";
import "./comments.css";

const AVAILABLE_USERNAMES = [
    'Mulet cyrus', 'Jim carré', 'Chief kiffe', 'Alain Deloin',
    'Leticia Cassetoidela', 'Kim Kardashein', 'Leonardo Di Caprisun',
    'Carla Brulée', 'Demi Moite', 'Tylor the créatine', 'Naomi Cambouis',
    'Will Splif', 'Timothée Chalamerde', 'Tom Crush', 'Lille wayne',
    'Christina Aguerisol', 'Angelica diddle',
];

export function CommentSection({
    contentId,
    contentType = 'post'
}: {
    contentId?: string;
    contentType?: 'post' | 'take';
}) {
    const [comments, setComments] = useState<CommentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pseudo, setPseudo] = useState("");
    const [newCommentText, setNewCommentText] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [hasAgreed, setHasAgreed] = useState(false);

    useEffect(() => {
        const loadComments = async () => {
            try {
                setLoading(true);
                const data = await fetchComments(contentId, contentType);
                setComments(data.data);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger les commentaires.")
            } finally {
                setLoading(false);
            }
        };
        loadComments();
    }, [contentId, contentType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contentId || !newCommentText.trim() || !pseudo) return;

        try {
            setIsPosting(true);
            const addedComment = await postComment(contentId, pseudo, newCommentText, contentType);
            setComments((prev) => [addedComment, ...prev]);
            setPseudo("");
            setNewCommentText("");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'envoi du commentaire.");
        } finally {
            setIsPosting(false);
        }
    };

    const handleInputFocus = (e: React.SyntheticEvent) => {
        if (!hasAgreed) {
            e.preventDefault();
            (e.target as HTMLElement).blur();
            setShowWarning(true);
        }
    };

    const handleAgreeWarning = () => {
        setHasAgreed(true);
        setShowWarning(false);
    };

    if (loading) return <div className="comments-loading">Chargement des commentaires</div>;
    if (error) return <div className="comments-error">{error}</div>;

    return (
        <section className="comments-section">
            {showWarning && (
                <div className="comment-warning-overlay">
                    <div className="warning-frame">
                        <div className="warning-frame-img">
                            <img src="https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/background/cadre_warning%20.png" alt="" />
                        </div>
                        <div className="comment-warning-popup">
                            <h2>Règles de l'espace de discussion</h2>
                            <p>
                                Nous n'admettrons aucune insulte, aucun propos sexiste, raciste ou homophobe.
                                Nous voulons faire de ce blog un espace de réflexion qui échapperait peut-être
                                de manière utopique aux oppositions systématiques. Merci, pour cette raison,
                                de préserver l'existence même de cet espace de débat en évitant les formulations
                                explicitement insultantes, haineuses ou diffamatoires.
                            </p>
                            <p>
                                Si vous souhaitez appuyer vos idées par des articles de presse, merci de référencer
                                l'URL plutôt que d'en recopier le contenu, qui est une propriété intellectuelle légale.
                            </p>
                            <button type="button" onClick={handleAgreeWarning} className="btn-agree-warning">
                                J'ai compris
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="comments-first-part">
                <h3 className="comments-section--title">Espace commentaire</h3>
                <form onSubmit={handleSubmit} className="comment-form" style={{ marginBottom: '2rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <select
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                            disabled={isPosting}
                            required
                            style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                        >
                            <option value="">-- Sélectionne un pseudo --</option>
                            {AVAILABLE_USERNAMES.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <textarea
                            placeholder="Laissez un commentaire..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            onFocus={handleInputFocus}
                            onClick={handleInputFocus}
                            required
                            disabled={isPosting}
                            rows={4}
                        />
                    </div>
                    <button className="button_comments" type="submit" disabled={isPosting || !newCommentText.trim() || !pseudo}>
                        {isPosting ? 'Envoi en cours...' : 'Poster'}
                    </button>
                </form>
            </div>

            <div className="comments-list">
                {comments.map((comment, index) => {
                    const pseudoCountAfter = comments
                        .slice(index + 1)
                        .filter(c => c.Pseudos === comment.Pseudos).length;

                    const displayPseudo = pseudoCountAfter > 0
                        ? `${comment.Pseudos || "anonymous"}_(${pseudoCountAfter})`
                        : (comment.Pseudos || "anonymous");

                    const date = new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                    return (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                                <strong>{displayPseudo}</strong>
                                <span className="date">{date}</span>
                            </div>
                            <div className="comment-body">
                                <BlocksRenderer content={comment.Comment as any} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}