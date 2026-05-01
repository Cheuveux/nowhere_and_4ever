import {useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef, useMemo} from "react";
import { getEndpoint } from "../../config/api";
import './conversation.css'
import '../../index.css'
interface Message {
	sender: "left" | "right";
	name: string;
	text: string;
}

function getRandomBashPrefix() {
	const users = ["user", "cheveut", "fisher", "vautiez", "boneTet"];
	const hosts = ["localhost", "bin", "void", "dreambox", "02"];
	const paths = ["~", "/home", "/etc", "/var/log", "/dreams"];
	
	const user = users[Math.floor(Math.random() * users.length)];
	const host = hosts[Math.floor(Math.random() * hosts.length)];
	const path = paths[Math.floor(Math.random() * paths.length)];
	
	return `${user}@${host}:${path}$`;
}

function getRandomPrefixColor() {
	const colors = ["#0004ff", "#fa0f0f", "#6aff00", "#000000", "#9900ff"];
	return colors[Math.floor(Math.random() * colors.length)];
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
			return {name: match[1].trim(), text:match[2].trim()};
		}).filter(Boolean) as { name: string,  text: string}[];

		const seenNames : string[] = [];
		parsed.forEach(({name}) => {
			if (!seenNames.includes(name)) seenNames.push(name);
		});

		return parsed.map(({name, text}) => ({
			sender: seenNames.indexOf(name) === 0 ? "right" : "left",
			name,
			text,
		}));
}

function useTpeWriter(messages: Message[], charSpeed = 40, pauseBetween = 700) {
	const [typed, setTyped] = useState<{sender: "left"|"right"; name:string; text: string; bashPrefix: string; prefixColor: string}[]>([]);
	const msgIdxRef = useRef(0);
	const charIdxRef = useRef(0);
	const bashPrefixesRef = useRef<{prefix: string; color: string}[]>([]);
	const glitchTimesRef = useRef<Set<number>>(new Set());

	useEffect(() => {
		if (!messages.length) return;
		msgIdxRef.current = 0;
		charIdxRef.current = 0;
		
		// Générer les prefixes et couleurs une seule fois
		bashPrefixesRef.current = messages.map(() => ({
			prefix: getRandomBashPrefix(),
			color: getRandomPrefixColor()
		}));
		
		// Générer 2-3 indices aléatoires pour faire glitch
		glitchTimesRef.current = new Set();
		const glitchCount = Math.floor(Math.random() * 5) + 5; // 2 ou 3
		for (let i = 0; i < glitchCount; i++) {
			glitchTimesRef.current.add(Math.floor(Math.random() * messages.length));
		}
		
		setTyped([]);

		let active = true;
		let timerId: ReturnType<typeof setTimeout>;

		const tick = () => {
			if (!active) return;
			const msgIdx = msgIdxRef.current;
			if (msgIdx >= messages.length) return;

			const msg = messages[msgIdx];
			charIdxRef.current++;
			const charIdx = charIdxRef.current;
			
			// Faire glitch le prefix si c'est l'heure
			let bashPrefix = bashPrefixesRef.current[msgIdx].prefix;
			let prefixColor = bashPrefixesRef.current[msgIdx].color;
			if (glitchTimesRef.current.has(msgIdx) && Math.random() > 0.5) {
				bashPrefix = getRandomBashPrefix();
				prefixColor = getRandomPrefixColor();
			}

			// Affiche le texte courant
			setTyped(prev => {
				const updated = [...prev];
				updated[msgIdx] = { sender: msg.sender, name: msg.name, text: msg.text.slice(0, charIdx), bashPrefix, prefixColor };
				return updated;
			});

			if (charIdx >= msg.text.length) {
				// Message complet : force le texte intégral puis passe au suivant
				setTyped(prev => {
					const updated = [...prev];
					updated[msgIdx] = { sender: msg.sender, name: msg.name, text: msg.text, bashPrefix, prefixColor };
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

	return typed;
}

export default function ConversationPage() {
	const { id } = useParams();
	const [post, setPost] =useState<any>(null);
	const [loading, setLoading] = useState(true);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetch(getEndpoint(`/conversations/${id}?populate=Visual_content`))
			.then(res => res.json())
			.then(data => {
				setPost(data.data ?? null);
				setLoading(false);
			});
	}, [id]);

const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const windowUrl = post?.Visual_content?.[0]?.url
    ? `${strapiUrl}${post.Visual_content[0].url}`
    : '';

	const messages = useMemo(() =>
		post?.Conversation_content ? parseConversationBlocks(post.Conversation_content) : [],
		[post]
	);
	const typed = useTpeWriter(messages);
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth"});
	}, [typed]);

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
			style={windowUrl ? {backgroundImage: `url(${windowUrl})`} : undefined}>
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