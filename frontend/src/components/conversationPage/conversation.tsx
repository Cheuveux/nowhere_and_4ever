import {useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef, useMemo} from "react";
import './conversation.css'
import '../../index.css'
interface Message {
	sender: "left" | "right";
	name: string;
	text: string;
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
	const [typed, setTyped] = useState<{sender: "left"|"right"; name:string; text: string}[]>([]);
	const msgIdxRef = useRef(0);
	const charIdxRef = useRef(0);

	useEffect(() => {
		if (!messages.length) return;
		msgIdxRef.current = 0;
		charIdxRef.current = 0;
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

			// Affiche le texte courant
			setTyped(prev => {
				const updated = [...prev];
				updated[msgIdx] = { sender: msg.sender, name: msg.name, text: msg.text.slice(0, charIdx) };
				return updated;
			});

			if (charIdx >= msg.text.length) {
				// Message complet : force le texte intégral puis passe au suivant
				setTyped(prev => {
					const updated = [...prev];
					updated[msgIdx] = { sender: msg.sender, name: msg.name, text: msg.text };
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
		fetch(`http://localhost:1337/api/conversations/${id}?populate=Visual_content`)
			.then(res => res.json())
			.then(data => {
				setPost(data.data ?? null);
				setLoading(false);
			});
	}, [id]);

	const windowUrl = post?.Visual_content?.[0]?.url
		? `http://localhost:1337${post.Visual_content[0].url}`
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
							<div className={`bubble ${msg.sender}`}>
								{msg.text}
								{i === typed.length - 1 && i < messages.length - 1 && (
									<span className="cursor">|</span>
								)}
							</div>
						</div>
						))}
						<div ref= {bottomRef}/>
				</div>
			</div>
		</div>
	);
}