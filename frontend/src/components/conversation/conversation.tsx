import {useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef, useMemo} from "react";
import { getEndpoint } from "../../config/api";
import './conversation.css'
import '../../index.css'

/* Radio Audio Player Component */
function RadioAudioPlayer({ audioUrl, coverUrl, onPlayStart }: { audioUrl: string; coverUrl: string | null; onPlayStart?: () => void }) {
	const [isPlaying, setIsPlaying] = useState(false);
	const isDiskInsertedRef = useRef(false);
	const audioRef = useRef<HTMLAudioElement>(null);
	const diskContentRef = useRef<HTMLDivElement>(null);

	const insertDisk = () => {
		if (isDiskInsertedRef.current) return;
		
		const diskContent = diskContentRef.current;
		if (!diskContent) return;

		let currentTop = 50;
		isDiskInsertedRef.current = true;

		const animationInterval = setInterval(() => {
			if (currentTop <= -300) {
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

		let currentTop = -300;
		isDiskInsertedRef.current = false;

		const animationInterval = setInterval(() => {
			if (currentTop >= 50) {
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
			onPlayStart?.();
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
			/>
		</div>
	);
}

interface Message {
	sender: "left" | "right";
	name: string;
	text: string;
	audioIndex?: number;
}

function parseConversationBlocks(blocks: any[]): Message[] {
	const raw = blocks
		.filter(b => b.type === "paragraph")
		.map(b => b.children.map((c: any) => c.text).join("").trim())
		.filter(t => t.length > 0);

		const parsed = raw.map(fullText => {
			const match = fullText.match(/^([^:]+?)\s*:\s*(.+)$/);
			if (!match)
					return (null);
			
			const name = match[1].trim();
			let text = match[2].trim();
			let audioIndex: number | undefined = undefined;

			const audioMatch = text.match(/\[audio:(\d+)\]/);
			if (audioMatch) {
				audioIndex = parseInt(audioMatch[1], 10);
				text = text.replace(/\[audio:\d+\]/, "").trim();
			}

			return { name, text, audioIndex };
		}).filter(Boolean) as { name: string, text: string, audioIndex?: number }[];

		const seenNames : string[] = [];
		parsed.forEach(({name}) => {
			if (!seenNames.includes(name)) seenNames.push(name);
		});

		return parsed.map(({name, text, audioIndex}) => ({
			sender: seenNames.indexOf(name) === 0 ? "right" : "left",
			name,
			text,
			audioIndex,
		}));
}

function useProgressiveDisplay(messages: Message[], initialPause = 1200, speedMultiplier = 0.55) {
	const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);

	useEffect(() => {
		if (!messages.length) {
			setDisplayedMessages([]);
			return;
		}

		setDisplayedMessages([]);
		let active = true;
		let msgIdx = 0;
		let timerId: ReturnType<typeof setTimeout>;

		const showNextMessage = () => {
			if (!active) return;

			if (msgIdx < messages.length) {
				setDisplayedMessages(prev => [...prev, messages[msgIdx]]);
				msgIdx++;
				// Chaque message s'affiche plus vite que le précédent
				const nextPause = Math.max(100, initialPause * Math.pow(speedMultiplier, msgIdx));
				timerId = setTimeout(showNextMessage, nextPause);
			}
		};

		timerId = setTimeout(showNextMessage, initialPause);

		return () => {
			active = false;
			clearTimeout(timerId);
		};
	}, [messages, initialPause, speedMultiplier]);

	return { displayedMessages };
}



export default function ConversationPage() {
	const { id } = useParams();
	const [post, setPost] =useState<any>(null);
	const [loading, setLoading] = useState(true);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetch(getEndpoint(`/conversations/${id}?populate=Sound`))
			.then(res => res.json())
			.then(data => {
				setPost(data.data ?? null);
				setLoading(false);
			});
	}, [id]);

const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

	const messages = useMemo(() =>
		post?.Conversation_content ? parseConversationBlocks(post.Conversation_content) : [],
		[post]
	);
	
	const { displayedMessages } = useProgressiveDisplay(messages, 1200, 0.85);
	
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth"});
	}, [displayedMessages]);

	const audioUrl = post?.Sound?.[0]?.url ? `${strapiUrl}${post.Sound[0].url}` : null;

	if (loading) 
		return (<p> Loading...</p>);
	if (!post)
		return (<p>Not found.</p>)

	return (
		<div className="conv-page">
			<div className="chat-header">
				<div className="return_btn">
                    <Link to="/">
                        <img src="https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/button/home.png" alt="" />
                    </Link>
                </div>
				<h2>{post.Title}</h2>

			</div>
			<div className="chatWindow">
			{audioUrl && (
				<div className="audio-player-wrapper">
					<RadioAudioPlayer 
						audioUrl={audioUrl} 
						coverUrl={null}
					/>
				</div>
			)}
				<div className="chat-messages">
					{displayedMessages.filter(msg => msg && msg.sender).map((msg, i) => (
					<div key={i} className={`bubble-wrapper ${msg.sender}`}>
						{msg.sender === "left" && (
							<span className="bash-prefix" style={{ color: "#fa0f0f" }}>
								whisper_01
							</span>
						)}
						<div className={`bubble ${msg.sender}`}>
							{msg.text}
						</div>
						{msg.sender === "right" && (
							<span className="bash-prefix" style={{ color: "#9900ff" }}>
								whisper_02
							</span>
						)}
					</div>
				))}
					<div ref= {bottomRef}/>
				</div>
			</div>
		</div>
	);
}