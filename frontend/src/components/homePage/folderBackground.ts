import type { CSSProperties } from 'react';

type ContentType = "article" | "conversation" | "quiz" | "mosaic";

const pageBackgrounds: Record<ContentType, CSSProperties> = {
	article: {
		backgroundColor: '#5f5fcb',
		transition: 'all 0.5s cubic-bezier(.77, 0, .18, 1)',
	},
	conversation: {
		backgroundColor: '#3d2a3e',
    	transition: 'all 0.5s cubic-bezier(.77,0,.18,1)',
	},
	quiz: {
		backgroundColor: '',
		backgroundImage: 'url("/img_assets/3px-tile.png"), linear-gradient(135deg, #8e44ad 0%, #fff 50%,  #6634db 75%, #fff 100%)',
		backgroundRepeat: 'repeat',
		backgroundSize: '10%',
		backgroundPosition: 'center',
		transition: 'all 0.5s cubic-bezier(.77,0,.18,1)',
	},
	mosaic: {
		backgroundColor: '#b40c0ccf',
		backgroundImage: 'url("/img_assets/crazy_background.png")',
		backgroundRepeat: 'repeat',
		backgroundSize: '3%',
		backgroundPosition: 'center',
		transition: 'all 0.3s cubic-bezier(.77,0,.18,1)',
	},
};

export function getPageBackground(type: ContentType): CSSProperties {
	const styles = pageBackgrounds[type] || pageBackgrounds.article;
	
	const textColors: Record<ContentType, { title: string; author: string }> = {
		article: { title: '#e6dddd', author: '#a8a8a8' },
		conversation: { title: '#d4a5d4', author: '#b390b3' },
		quiz: { title: '#151414', author: '#101010' },
		mosaic: { title: '#ecece4', author: '#ecece4' },
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