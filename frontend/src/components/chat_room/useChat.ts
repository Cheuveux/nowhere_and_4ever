// useChat.ts
import { useEffect, useState } from 'react';
import { getSocket } from './socket';
import type { Message } from './chat';
import { extractTextFromBlocks } from './utils';

export function useChat(roomSlug: string, initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [connectionCount, setConnectionCount] = useState(0);

  // ← sync si initialMessages change (quand ChatRoomWrapper refetch)
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

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
        if (prev.some((m) => m.id === processedMsg.id)) return prev;
        return [...prev, processedMsg];
      });
    });

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