import { BlocksRenderer } from "@strapi/blocks-react-renderer";

const STRAPI = "http://localhost:1337";

export function renderContent(article: any) {
    if (!article?.Content) return null;

    return article.Content.map((block: any, i: number) => {
        if (block.type === "paragraph" && block.children?.length === 1) {
            const text: string = block.children[0]?.text ?? "";
            const MARKER = /\[(image|audio|video):(\d+)(?:\|([\w\s-]+))?\]/g;

            if (text.replace(MARKER, "").trim() === "") {
                const markers: { type: string; idx: number; classes: string }[] = [];
                let m;
                const rx = /\[(image|audio|video):(\d+)(?:\|([\w\s-]+))?\]/g;
                while ((m = rx.exec(text)) !== null) {
                    markers.push({ type: m[1], idx: +m[2], classes: m[3]?.trim() ?? "" });
                }

                if (markers.length > 0) {
                    const elements = markers.map((mk, j) => {
                        const cls = mk.classes ? ` ${mk.classes}` : "";
                        if (mk.type === "image")
						{
                            const file = article.illu?.[mk.idx];
                            if (!file) return null;
                            return <img key={j} src={`${STRAPI}${file.url}`} alt={file.alternativeText ?? ""} className={`article-media article-image${cls}`} />;
                        }
                        if (mk.type === "audio")
						{
                            const file = article.music_video?.[mk.idx];
                            if (!file) return null;
                            return <audio key={j} controls src={`${STRAPI}${file.url}`} className={`article-media article-audio${cls}`} />;
                        }
                        if (mk.type === "video")
						{
                            const file = article.music_video?.[mk.idx];
                            if (!file) return null;
                            return <video key={j} controls src={`${STRAPI}${file.url}`} className={`article-media article-video${cls}`} />;
                        }
                        return null;
                    });

                    return markers.length > 1
                        ? <div key={i} className="article-media-row">{elements}</div>
                        : <div key={i}>{elements[0]}</div>;
                }
            }
        }
        return <BlocksRenderer key={i} content={[block]} />;
    });
}