import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { useState, useRef } from "react";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

/* Radio Audio Player Component */
function RadioAudioPlayer({ audioUrl, coverUrl }: { audioUrl: string; coverUrl: string | null }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const isDiskInsertedRef = useRef(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const diskContentRef = useRef<HTMLDivElement>(null);

    const insertDisk = () => {
        if (isDiskInsertedRef.current) return;
        
        const diskContent = diskContentRef.current;
        if (!diskContent) return;

        let currentTop = 50; // Position initiale visible (en bas)
        isDiskInsertedRef.current = true;

        const animationInterval = setInterval(() => {
            if (currentTop <= -300) { // Remonte vers le haut et disparaît derrière la radio
                clearInterval(animationInterval);
                diskContent.style.top = '-300px';
            } else {
                currentTop -= 2; 
                diskContent.style.top = currentTop + 'px';
            }
        }, 5);
    };

    const retractDisk = () => {
        const diskContent = diskContentRef.current;
        if (!diskContent) return;

        let currentTop = -300; // Position rentrée (cachée en haut)
        isDiskInsertedRef.current = false;

        const animationInterval = setInterval(() => {
            if (currentTop >= 50) { // Redescend vers sa position de lancement et redevient visible
                clearInterval(animationInterval);
                diskContent.style.top = '50px';
            } else {
                currentTop += 2;
                diskContent.style.top = currentTop + 'px';
            }
        }, 5);
    };

    const handlePlayClick = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!isDiskInsertedRef.current) {
            insertDisk();
        }

        if (audio.paused) {
            audio.play();
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false);
            retractDisk();
        }
    };

    return (
        <div className="radio-container">
            <button
                className={`radio-play-button ${isPlaying ? 'is-playing' : ''}`}
                onClick={handlePlayClick}
            >
            <img 
                src={isPlaying ? '/img_assets/radio_assets/audio-pause.svg' : '/img_assets/radio_assets/audio-play.svg'} 
                alt=""
             />
                
            </button>
            <div className="radio-top">
                <img src="/img_assets/radio_assets/radio_type_4ever_top.png" alt="radio top" />
            </div>
            <div className="radio-content" ref={diskContentRef}>
                {coverUrl ? (
                    <img src={coverUrl} alt="audio cover" />
                ) : (
                    <img src="/img_assets/radio_assets/radio_type_4ever.png" alt="radio disk" />
                )}
            </div>
            <audio
                ref={audioRef}
                src={audioUrl}
                preload="metadata"
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
}

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
                            return <img key={j} src={`${STRAPI_URL}${file.url}`} alt={file.alternativeText ?? ""} className={`article-media article-image${cls}`} />;
                        }
                        if (mk.type === "audio")
						{
                            const track = article.audio_track?.[mk.idx];
                            if (!track) return null;

                            const audioUrl = track.sound?.url ? `${STRAPI_URL}${track.sound.url}` : null;
                            const coverUrl = track.cover?.url ? `${STRAPI_URL}${track.cover.url}` : null;
                            if (!audioUrl) return null;

                            return (
                                <div key={j} className={cls}>
                                    <RadioAudioPlayer audioUrl={audioUrl} coverUrl={coverUrl} />
                                </div>
                            );
                        }
                        if (mk.type === "video")
						{
                            const file = article.music_video?.[mk.idx];
                            if (!file) return null;
                            return <video key={j} controls src={`${STRAPI_URL}${file.url}`} className={`article-media article-video${cls}`} />;
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