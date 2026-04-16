import type { CSSProperties } from 'react';

type ContentType = "article" | "conversation" | "quiz" | "mosaic" | "takes";

const pageBackgrounds: Record<ContentType, CSSProperties> = {
	article: {
		backgroundImage: 'url(/img_assets/arabesque.png)',
		backgroundColor: '#5f5fcb',
		transition: 'all 0.5s cubic-bezier(.77, 0, .18, 1)',
	},
	conversation: {
		backgroundColor: '#db672d',
		backgroundImage: 'url(/img_assets/3px-tile.png)',
		backgroundSize: '20%',
		backdropFilter: 'blur(2px)',
    	transition: 'all 0.5s cubic-bezier(.77,0,.18,1)',
	},
	quiz: {
		backgroundColor: '#6fcb5f',
		backgroundImage: 'url(/img_assets/wild-flowers.png)',
		backgroundRepeat: 'repeat',
		backgroundSize: '50%',
		backgroundPosition: 'center',
		transition: 'all 0.5s cubic-bezier(.77,0,.18,1)',
	},
	mosaic: {
		backgroundImage: 'url(/img_assets/escheresque-dark.png)',
		backgroundColor: '#cb6969',
		backgroundRepeat: 'repeat',
		backgroundSize: '3%',
		backgroundPosition: 'center',
		transition: 'all 0.3s cubic-bezier(.77,0,.18,1)',
	},
	takes: {
		backgroundImage: 'url(/img_assets/black-thread.png)',
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
		backdropFilter: 'blur(3px)',
		'--text-title': textColors[type].title,
		'--text-author': textColors[type].author,
	} as CSSProperties & Record<string, string>;
}

export function resetPageBackground(): void {
	document.body.style.backgroundColor = '';
	document.body.style.backgroundImage = '';
	document.body.style.transition = '';
}