import { useEffect, useState } from "react";

// TYPE
const STRAPI_URL: string = import.meta.env.VITE_STRAPI_URL ?? "http://localhost:1337";
const API_URL: string = `${STRAPI_URL}/api/mosaics?populate[mosaic_content][populate]=*`;

type MediaFormat = {
	url: string;
	width: number;
	height:number;
	size: number;
};

type  Media =  {
	id:  number;
	name: string;
	mime: string;
	url: string;
	width: number | null;
	height: number | null;
	formats: {
		thumbnail?: MediaFormat;
		small?: MediaFormat;
		medium?: MediaFormat;
		large?: MediaFormat;
	} | null;
};

type MosaicItem = {
  id: number;
  Titre: string;
  Date?: string;
  Views?: number;
  media: {
    mime: string;
    url: string;
    formats?: {
      small?: { url: string };
    } | null;
  };
};
type MosaicSection = {
	id: number;
	documentId: string;
	Titre: string;
	mosaic_content: MosaicItem[];
};


// HOOK
export function useMosaic() : {section: MosaicSection | null; loading: boolean;  error: string | null} {
	
	const [section, setSection] = useState<MosaicSection | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect (() => {
		(async () => {
			try 
				{
					const res = await fetch (API_URL);
					if (!res.ok)
						throw new Error (`HTTP ${res.status}`);
					const { data } : { data: MosaicSection[]} = await res.json();
					setSection(data[0] ?? null);
				} catch (err) {
					setError(err instanceof Error ? err.message: "Unknown error");
				} finally {
					setLoading(false);
				}
		})();
	}, []);

	return { section, loading, error };
}


// HELPER

//1) Construction de l'URL ABSOLUE DEPUIS LE CHEMIN RELATIF DE STRAPI

export function mediaUrl(url: string):string {
	return (`${STRAPI_URL}${url}`);
}

//2) Detection de si media == video
export function isVideo(mime: string): boolean {
	return mime.startsWith("video/");
}