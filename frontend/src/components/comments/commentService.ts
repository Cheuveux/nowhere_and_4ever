import type { CommentsResponse, CommentData } from "./comment"

const API_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337"


// Fetching comments
export const fetchComments = async (articleId?: string): Promise<CommentsResponse> => {
    let url = `${API_URL}/api/comments`;
    
    if (articleId)
        url += `?filters[post][id][$eq]=${articleId}`; 
    const response = await fetch(url);
    if (!response.ok)
        throw new Error("Error: Problem while loading comments.") 
    return response.json(); 
}

//Publishing comments
export const postComment = async (articleId: string, pseudo: string, text: string): Promise<CommentData> => {
    const payload = {
        data: {
            Pseudos: pseudo || null,
            Comment: [
                {
                    type:"paragraph",
                    children: [{type: "text", text: text}]
                }
            ],
            post: articleId
        }
    };
    const response = await fetch(`${API_URL}/api/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
        let errDetails = "";
        try {
            const errData = await response.json();
            errDetails = JSON.stringify(errData.error || errData);
        } catch(e) {}
        throw new Error("Erreur: impossible d'envoyer le commentaire. " + errDetails);
    }
        
    const json = await response.json(); // Ajout des () ici !
    return json.data;

}