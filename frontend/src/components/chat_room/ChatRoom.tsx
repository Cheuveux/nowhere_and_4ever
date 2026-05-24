import { useState, useRef, useEffect } from 'react';
import { useChat } from './useChat';
import type { Message } from './chat';
import './ChatRoom.css';

// Liste de pseudos disponibles (comme pour les commentaires)
const AVAILABLE_USERNAMES = [
  '🎭',
  '👁️',
  '🐍',
  '🦋',
  '🌙',
  '☀️',
  '🌸',
  '🔥',
  '🌊',
  '💎',
  '👻',
  '🎀',
  '🎪',
  '🎨',
  '🎬',
];

// --- Sous-composant : un message + ses replies ---
function MessageItem({
  msg,
  onReply,
}: {
  msg: Message;
  onReply: (id: number, username: string) => void;
}) {
  return (
    <div className="message-item">
      <div className="message-bubble">
        <div className="message-header">
          <span className="message-username">{msg.username}</span>
          <span className="message-time">
            {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <p className="message-content">{msg.content}</p>
        <button
          onClick={() => onReply(msg.id, msg.username)}
          className="reply-btn"
        >
          ↩ Répondre
        </button>
      </div>

      {msg.children && msg.children.length > 0 && (
        <div className="replies-list">
          {msg.children.map((child) => (
            <div key={child.id} className="reply-bubble">
              <div className="message-header">
                <span className="reply-username">@{child.username}</span>
                <span className="message-time">
                  {new Date(child.createdAt).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="message-content">{child.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Composant principal ---
export default function ChatRoom({
  roomSlug,
  initialMessages,
}: {
  roomSlug: string;
  initialMessages: Message[];
}) {
  const [username, setUsername] = useState('');
  const [pseudoSet, setPseudoSet] = useState(false);
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: number; username: string } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, send } = useChat(roomSlug, initialMessages);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    send(input.trim(), username, replyTo?.id);
    setInput('');
    setReplyTo(null);
  };

  // --- Écran pseudo ---
  if (!pseudoSet) {
    return (
      <div id="pseudo-screen">
        <div id="pseudo-card">
          <h2>Rejoindre le chat</h2>
          <p>Choisis un pseudo pour continuer</p>
          <select
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && username) setPseudoSet(true);
            }}
            id="pseudo-select"
          >
            <option value="">-- Sélectionne un pseudo --</option>
            {AVAILABLE_USERNAMES.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <button
            onClick={() => username && setPseudoSet(true)}
            id="join-btn"
          >
            Rejoindre
          </button>
        </div>
      </div>
    );
  }

  // --- Écran chat ---
  return (
    <div id="chat-room">
      {/* Header */}
      <div id="chat-header">
        <span id="chat-status-dot" />
        <span id="chat-room-name">Chat — {roomSlug}</span>
        <span id="chat-current-user">
          Connecté en tant que <strong>{username}</strong>
        </span>
      </div>

      {/* Messages */}
      <div id="messages-list">
        {messages.length === 0 && (
          <p id="empty-state">Aucun message pour l'instant. Soyez le premier !</p>
        )}
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            msg={msg}
            onReply={(id, uname) => setReplyTo({ id, username: uname })}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Zone de saisie */}
      <div id="chat-input-area">
        {replyTo && (
          <div id="reply-indicator">
            <span>↩ Réponse à <strong>{replyTo.username}</strong></span>
            <button onClick={() => setReplyTo(null)} id="cancel-reply">✕</button>
          </div>
        )}
        <div id="input-row">
          <input
            type="text"
            id="message-input"
            placeholder="Écrire un message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            id="send-btn"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}