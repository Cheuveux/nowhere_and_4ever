import { useEffect, useState } from 'react';
import { getSocket } from './socket';
import type { Message } from './chat';
import { extractTextFromBlocks } from './utils';

export function useChat(roomSlug: string, initialMessages: Message[]) {
	const	[messages, setMessages] = useState<Message[]>(initialMessages);
	const	[connectionCount, setConnectionCount] = useState(0);

	useEffect(() => {
		const socket = getSocket();

		// Rejoins room cote socket.io
		socket.emit('join-room', roomSlug);
		
		// Ecoute des nouveaux messages broadcastes par Socket.io
		socket.on('new-message', (msg: any) => {
			// Extraire le texte du format blocks
			const processedMsg: Message = {
				id: msg.id,
				content: extractTextFromBlocks(msg.content),
				username: msg.pseudo,
				createdAt: msg.createdAt,
				children: [],
			};

			setMessages((prev) => {
				// si c'une reply on l'imbrique dans le parent
				if (msg.parent?.id) {
					return prev.map((m) =>
						m.id === msg.parent!.id
							? {...m, children: [...(m.children ?? []), processedMsg] }
							: m
					);
				}
				return [...prev, processedMsg];
			});
		});

		// Ecoute les mises à jour du nombre de connexions
		socket.on('room-users-count', (count: number) => {
			setConnectionCount(count);
		});
		
		return () => {
			socket.off('new-message');
			socket.off('room-users-count');
			socket.emit('leave-room', roomSlug);
		};

	}, [roomSlug]);

	const send = (content: string, username: string, parentId?: number) => {
		getSocket().emit('send-message', {
			roomSlug,
			content,
			username,
			...(parentId && { parentId }),
		});
	};

	return { messages, send, connectionCount };
}