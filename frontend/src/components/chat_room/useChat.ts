import { useEffect, useState } from 'react';
import { getSocket } from './socket';
import type { Message } from './chat';
import { extractTextFromBlocks } from './utils';

export function useChat(roomSlug: string, initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [connectionCount, setConnectionCount] = useState(0);

	useEffect(() => {
    fetch(`/api/chat/messages?roomSlug=${roomSlug}`)
      .then(res => res.json())
      .then((freshMessages: Message[]) => {
        setMessages(freshMessages);
      })
      .catch(err => console.error('Erreur fetch messages:', err));
  }, [roomSlug]);
  
  useEffect(() => {
    const socket = getSocket();
    socket.emit('join-room', roomSlug);
    
    socket.on('new-message', (msg: any) => {
      const processedMsg: Message = {
        id: msg.id,
        content: extractTextFromBlocks(msg.content),
        username: msg.pseudo,
        createdAt: msg.createdAt,
        children: [],
      };
      setMessages((prev) => {
        if (msg.parent?.id) {
          return prev.map((m) =>
            m.id === msg.parent!.id
              ? { ...m, children: [...(m.children ?? []), processedMsg] }
              : m
          );
        }
        // évite les doublons si le message existe déjà
        if (prev.some((m) => m.id === processedMsg.id)) return prev;
        return [...prev, processedMsg];
      });
    });

    socket.on('room-users-count', (count: number) => {
      setConnectionCount(count);
    });

    socket.on('connect', () => {
      console.log('Socket connected', socket.id);
      // re-join la room après reconnexion
      socket.emit('join-room', roomSlug);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.off('new-message');
      socket.off('room-users-count');
      socket.off('connect');
      socket.off('disconnect');
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