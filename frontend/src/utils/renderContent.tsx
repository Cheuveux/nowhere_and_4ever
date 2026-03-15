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
                            const track = article.audio_track?.[mk.idx];
                            if (!track) return null;

                            const audioUrl = track.sound?.url ? `${STRAPI}${track.sound.url}` : null;
                            const coverUrl = track.cover?.url ? `${STRAPI}${track.cover.url}` : null;
                            if (!audioUrl) return null;

                            return (
                                <div key={j} className={`article-audio-card${cls}`}>
                                    <div className="article-audio-visual">
                                        {coverUrl && (
                                            <img
                                                src={coverUrl}
                                                alt="audio cover"
                                                className="article-audio-cover"
                                            />
                                        )}
                                        <button
                                            className="article-audio-play"
                                            onClick={(e) => {
                                                const card = (e.currentTarget as HTMLButtonElement).closest(".article-audio-card");
                                                const audio = card?.querySelector("audio") as HTMLAudioElement | null;
                                                if (!audio) return;
                                                if (audio.paused) {
                                                    audio.play();
                                                    e.currentTarget.classList.add("is-playing");
                                                } else {
                                                    audio.pause();
                                                    e.currentTarget.classList.remove("is-playing");
                                                }
                                            }}
                                        >
                                            ▶
                                        </button>
                                    </div>
                                    <audio className="article-audio-element" src={audioUrl} preload="metadata" />
                                </div>
                            );
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