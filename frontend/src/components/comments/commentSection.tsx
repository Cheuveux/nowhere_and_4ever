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
    
    // ETAT POUR LE POP-UP DE PRÉVENTION
    const [showWarning, setShowWarning] = useState(false);
    const [hasAgreed, setHasAgreed] = useState(false);

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
        // Si pas de texte, pas de pseudo ou pas d'articleId, on bloque
        if (!articleId || !newCommentText.trim() || !pseudo) return;

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

    // QUAND ON CLIQUE POUR ECRIRE ON DECLENCHE LE POPUP SI NON VU
    const handleInputFocus = () => {
        if (!hasAgreed) {
            setShowWarning(true);
        }
    };

    // QUAND ON ACCEPTE LES REGLES DU POPUP
    const handleAgreeWarning = () => {
        setHasAgreed(true);
        setShowWarning(false);
    };

    if (loading) return (<div className="comments-loading">Chargement des commentaires</div>);
    if (error) return(<div className="comments-error">{error}</div>);

    return(
        <section className="comments-section">
            {showWarning && (
                <div className="comment-warning-overlay">
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
            )}

            <h3> Espace commentaire</h3>

            {/* NOUVEAU FORMULAIRE */}
            <form onSubmit={handleSubmit} className="comment-form" style={{ marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <select
                        value={pseudo}
                        onChange={(e) => setPseudo(e.target.value)}
                        disabled={isPosting}
                        required
                        style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                    >
                        <option value="" disabled>Choisis ton blaz</option>
                        <option value="𐔌՞. .՞𐦯">{"𐔌՞. .՞𐦯"}</option>
                        <option value="₍₍⚞(˶ˆᗜˆ˵)⚟⁾⁾">{"₍₍⚞(˶ˆᗜˆ˵)⚟⁾⁾"}</option>
                        <option value="(˶>⩊<˶)">{"(˶>⩊<˶)"}</option>
                        <option value="(╥﹏╥)">{"(╥﹏╥)"}</option>
                        <option value="(๑ᵔ⤙ᵔ๑)">{"(๑ᵔ⤙ᵔ๑)"}</option>
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
                        style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" disabled={isPosting || !newCommentText.trim() || !pseudo}>
                    {isPosting ? 'Envoi en cours...' : 'Poster'}
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
                            <div key={comment.id} className="comment-item" >
                                <div className="comment-header">
                                    <strong>{comment.Pseudos || "anonymous"}</strong>
                                    <span className="date">
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