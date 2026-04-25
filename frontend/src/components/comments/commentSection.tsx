import { useEffect, useState } from "react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import type { CommentData } from "./comment"
// Importe postComment
import { fetchComments, postComment } from "./commentService";
import "./comments.css"; // (Garde bien ton import CSS si besoin)

export function CommentSection({articleId}: { articleId?: string}) {
    const [comments, setcomments] = useState<CommentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // NOUVELLES VARIABLES D'ÉTAT POUR LE FORMULAIRE
    const [pseudo, setPseudo] = useState("");
    const [newCommentText, setNewCommentText] = useState("");
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        const loadComments = async () => {
            try {
                setLoading(true);
                const data = await fetchComments(articleId);
                setcomments(data.data);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger les commentaires.")
            } finally {
                setLoading(false);
            }	
        };
        loadComments();
    }, [articleId]);

    // NOUVELLE FONCTION POUR GERER LA SOUMISSION
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Si pas de texte ou pas d'articleId, on bloque
        if (!articleId || !newCommentText.trim()) return;

        try {
            setIsPosting(true);
            const addedComment = await postComment(articleId, pseudo, newCommentText);
            
            // On met à jour l'affichage en ajoutant le nouveau commentaire sans recharger la page
            setcomments((prevComments) => [addedComment, ...prevComments]);
            
            // On vide les champs du formulaire
            setPseudo("");
            setNewCommentText("");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'envoi du commentaire.");
        } finally {
            setIsPosting(false);
        }
    };

    if (loading) return (<div className="comments-loading">Chargement des commentaires</div>);
    if (error) return(<div className="comments-error">{error}</div>);

    return(
        <section className="comments-section">
            <h3> Commentaires ({comments.length})</h3>

            {/* NOUVEAU FORMULAIRE */}
            <form onSubmit={handleSubmit} className="comment-form" style={{ marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <select
                        value={pseudo}
                        onChange={(e) => setPseudo(e.target.value)}
                        disabled={isPosting}
                        style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                    >
                        <option value="">Sélectionnez un pseudo (Anonyme)</option>
                        <option value="sunday">sunday</option>
                        <option value="morning">morning</option>
                    </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <textarea 
                        placeholder="Laissez un commentaire..." 
                        value={newCommentText} 
                        onChange={(e) => setNewCommentText(e.target.value)}
                        required
                        disabled={isPosting} 
                        rows={4}
                        style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" disabled={isPosting || !newCommentText.trim()}>
                    {isPosting ? 'Envoi...' : 'Publier le commentaire'}
                </button>
            </form>

            <div className="comments-list">
                {comments.length === 0 ? (
                    <div className="empty-comments">Aucun commentaire pour le moment. Soyez le premier !</div>
                ) : (
                    comments.map((comment) => {
                        const date = new Date(comment.createdAt).toLocaleDateString("fr-Fr", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        });

                        return (
                            <div key={comment.id} className="commment-item" style={{ borderBottom: '1px solid #eee', margin: '1rem 0', paddingBottom: '1rem' }}>
                                <div className="comment-header">
                                    <strong>{comment.Pseudos || "anonymous"}</strong>
                                    <span className="date" style={{ fontSize: '0.8em', color: 'gray', marginLeft: '10px' }}>
                                        {date}
                                    </span>
                                </div>
                                <div className="comment-body">
                                    <BlocksRenderer content={comment.Comment as any}/>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}