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

function useTpeWriter(messages: Message[], charSpeed = 40, pauseBetween = 700) {
	const [typed, setTyped] = useState<{sender: "left"|"right"; name:string; text: string; bashPrefix: string; prefixColor: string; audioIndex?: number}[]>([]);
	const hasAudioStartedRef = useRef(false);
	const msgIdxRef = useRef(0);
	const charIdxRef = useRef(0);
	const bashPrefixesRef = useRef<{prefix: string; color: string}[]>([]);
	const glitchTimesRef = useRef<Set<number>>(new Set());

	useEffect(() => {
		if (!messages.length) return;
		msgIdxRef.current = 0;
		charIdxRef.current = 0;
		hasAudioStartedRef.current = false;
		
		bashPrefixesRef.current = messages.map((msg) => ({
			prefix: msg.sender === "right" ? "whisper_02" : "whisper_01",
			color: msg.sender === "right" ? "#9900ff" : "#fa0f0f"
		}));
		
		glitchTimesRef.current = new Set();
		const glitchCount = Math.floor(Math.random() * 5) + 5;
		for (let i = 0; i < glitchCount; i++) {
			glitchTimesRef.current.add(Math.floor(Math.random() * messages.length));
		}
		
		setTyped([]);

		let active = true;
		let timerId: ReturnType<typeof setTimeout>;

		const tick = () => {
			if (!active) return;
			
			if (!hasAudioStartedRef.current) {
				timerId = setTimeout(tick, 100);
				return;
			}

			const msgIdx = msgIdxRef.current;
			if (msgIdx >= messages.length) return;

			const msg = messages[msgIdx];
			charIdxRef.current++;
			const charIdx = charIdxRef.current;
			
			let bashPrefix = bashPrefixesRef.current[msgIdx].prefix;
			let prefixColor = bashPrefixesRef.current[msgIdx].color;
			if (glitchTimesRef.current.has(msgIdx) && Math.random() > 0.5) {
				const sender = messages[msgIdx].sender;
				bashPrefix = sender === "right" ? "whisper_02" : "whisper_01";
				prefixColor = sender === "right" ? "#9900ff" : "#fa0f0f";
			}

			setTyped(prev => {
				const updated = [...prev];
				updated[msgIdx] = { sender: msg.sender, name: msg.name, text: msg.text.slice(0, charIdx), bashPrefix, prefixColor, audioIndex: msg.audioIndex };
				return updated;
			});

			if (charIdx >= msg.text.length) {
				setTyped(prev => {
					const updated = [...prev];
					updated[msgIdx] = { sender: msg.sender, name: msg.name, text: msg.text, bashPrefix, prefixColor, audioIndex: msg.audioIndex };
					return updated;
				});
				msgIdxRef.current++;
				charIdxRef.current = 0;
				timerId = setTimeout(tick, pauseBetween);
			} else {
				timerId = setTimeout(tick, charSpeed);
			}
		};

		timerId = setTimeout(tick, 500);
		return () => {
			active = false;
			clearTimeout(timerId);
		};
	}, [messages]);

	const handlePlayStart = () => {
		console.log('Audio started, beginning conversation');
		hasAudioStartedRef.current = true;
	};

	return { typed, handlePlayStart };
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
	const { typed, handlePlayStart } = useTpeWriter(messages);
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth"});
	}, [typed]);

	const audioUrl = post?.Sound?.[0]?.url ? `${strapiUrl}${post.Sound[0].url}` : null;

	// Si pas d'audio, lancer la conversation directement
	useEffect(() => {
		if (!audioUrl) {
			console.warn('No audio available for this conversation, starting immediately');
			handlePlayStart();
		}
	}, [audioUrl, handlePlayStart]);

	if (loading) 
		return (<p> Loading...</p>);
	if (!post)
		return (<p>Not found.</p>)

	return (
		<div className="conv-page">
			<div className="chat-header">
				<div className="returnBtn">
					<Link to="/">../home/</Link>
				</div>
				<h2>{post.Title}</h2>
			</div>
			<div className="chatWindow"
			// style={windowUrl ? {backgroundImage: `url(${windowUrl})`} : undefined}
			>
			{audioUrl ? (
				<div className="audio-player-wrapper">
					<RadioAudioPlayer 
						audioUrl={audioUrl} 
						coverUrl={null}
						onPlayStart={handlePlayStart}
					/>
				</div>
			) : (
				<div style={{textAlign: 'center', padding: '1rem', color: '#888'}}>
					<p>Audio not available - starting conversation</p>
				</div>
			)}
				<div className="chat-messages">
					{typed.map((msg, i) => (
					<div key={i} className={`bubble-wrapper ${msg.sender}`}>
						{msg.sender === "left" && (
							<span className="bash-prefix" style={{ color: msg.prefixColor }}>{msg.bashPrefix}</span>
						)}
						<div className={`bubble ${msg.sender}`}>
							{msg.text}
							{i === typed.length - 1 && i < messages.length - 1 && (
								<span className="cursor">|</span>
							)}
						</div>
						{msg.sender === "right" && (
							<span className="bash-prefix" style={{ color: msg.prefixColor }}>{msg.bashPrefix}</span>
						)}
					</div>
				))}
					<div ref= {bottomRef}/>
				</div>
			</div>
		</div>
	);
}