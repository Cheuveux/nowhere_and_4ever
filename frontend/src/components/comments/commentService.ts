import type { CommentsResponse, CommentData } from "./comment"

const API_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337"

export const fetchComments = async (
    contentId?: string,
    contentType: 'post' | 'take' = 'post'
): Promise<CommentsResponse> => {
    if (!contentId) {
        return {
            data: [],
            meta: {
                pagination: {
                    page: 1,
                    pageSize: 0,
                    pageCount: 0,
                    total: 0
                }
            }
        };
    }

    const url = `${API_URL}/api/comments?filters[${contentType}][id][$eq]=${contentId}`;
    const response = await fetch(url);
    if (!response.ok)
        throw new Error("Error: Problem while loading comments.")
    return response.json();
}

export const postComment = async (
    contentId: string,
    pseudo: string,
    text: string,
    contentType: 'post' | 'take' = 'post'
): Promise<CommentData> => {
    const payload = {
        data: {
            Pseudos: pseudo || null,
            Comment: [
                {
                    type: "paragraph",
                    children: [{ type: "text", text: text }]
                }
            ],
            [contentType]: contentId
        }
    };

    const response = await fetch(`${API_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    const json = await response.json();
    return json.data;
}