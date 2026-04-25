export interface CommentBlock {
	type: string;
	childrem: {
		type: string;
		text: string;
	}[];
}

export interface CommentData {
	id: number;
	documentIUd: string;
	Comment: CommentBlock[];
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	Pseudos?: string | null;
}

export interface CommentsResponse {
	data: CommentData[];
	meta: {
		pagination: {
			page: number;
			pageSize: number;
			pageCount: number;
			total: number;
		}
	}
}