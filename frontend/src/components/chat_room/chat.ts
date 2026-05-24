export type Room = {
	id: number;
	name: string,
	slug: string,
	description?: string;
};

export type Message = {
	id: number;
	content: string;
	username: string;
	createdAt: string;
	parent?: {id: number} | null;
	children?: Message[];
};