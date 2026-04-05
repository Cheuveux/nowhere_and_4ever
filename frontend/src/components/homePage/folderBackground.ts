import type { CSSProperties } from 'react';

type ContentType = "article" | "conversation" | "quiz" | "mosaic" | "takes";

const pageBackgrounds: Record<ContentType, CSSProperties> = {
	article: {
		backgroundColor: '#5f5fcb',
		transition: 'all 0.5s cubic-bezier(.77, 0, .18, 1)',
	},
	conversation: {
		backgroundColor: '#a5cb5f',
    	transition: 'all 0.5s cubic-bezier(.77,0,.18,1)',
	},
	quiz: {
		backgroundColor: '#815fcb',
		backgroundRepeat: 'repeat',
		backgroundSize: '50%',
		backgroundPosition: 'center',
		transition: 'all 0.5s cubic-bezier(.77,0,.18,1)',
	},
	mosaic: {
		backgroundColor: '#cb615f',
		backgroundRepeat: 'repeat',
		backgroundSize: '3%',
		backgroundPosition: 'center',
		transition: 'all 0.3s cubic-bezier(.77,0,.18,1)',
	},
	takes: {
		backgroundColor: '#5fcbc4',
    	transition: 'all 0.5s cubic-bezier(.77,0,.18,1)',
	}
};

export function getPageBackground(type: ContentType): CSSProperties {
	const styles = pageBackgrounds[type] || pageBackgrounds.article;
	
	const textColors: Record<ContentType, { title: string; author: string }> = {
		article: { title: '#e6dddd', author: '#a8a8a8' },
		conversation: { title: '#d4a5d4', author: '#b390b3' },
		quiz: { title: '#151414', author: '#101010' },
		mosaic: { title: '#ecece4', author: '#ecece4' },
		takes: { title: '#ecece4', author: '#ecece4' },
	};

	return {
		...styles,
		'--text-title': textColors[type].title,
		'--text-author': textColors[type].author,
	} as CSSProperties & Record<string, string>;
}

export function resetPageBackground(): void {
	document.body.style.backgroundColor = '';
	document.body.style.backgroundImage = '';
	document.body.style.transition = '';
}