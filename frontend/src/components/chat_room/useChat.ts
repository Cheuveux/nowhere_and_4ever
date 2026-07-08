import { useEffect, useState } from 'react';
import { getSocket } from './socket';
import type { Message } from './chat';
import { extractTextFromBlocks } from './utils';
import { getEndpoint } from '../../config/api';

export function useChat(roomSlug: string, initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [connectionCount, setConnectionCount] = useState(0);

  // ✅ Charge les messages existants au montage
  useEffect(() => {
    async function loadMessages() {
      try {
        // 1. Récupère l'ID de la room via son slug
        const roomRes = await fetch(
          getEndpoint(`/rooms?filters[slug][$eq]=${encodeURIComponent(roomSlug)}`)
        );
        if (!roomRes.ok) throw new Error('Failed to load room');
        const roomData = await roomRes.json();
        if (!roomData.data?.[0]?.id) throw new Error('Room not found');

        const roomId = roomData.data[0].id;

        // 2. Récupère TOUS les messages de cette room (avec leurs relations)
        const messagesRes = await fetch(
          getEndpoint(`/messages?populate=*&filters[room][id][$eq]=${roomId}&sort=createdAt:asc`)
        );
        if (!messagesRes.ok) throw new Error('Failed to load messages');
        const { data } = await messagesRes.json();

        // 3. Traite les messages pour les adapter au format attendu
        const processedMessages = data
          .filter((item: any) => !item.parent?.id) // On garde que les messages parents
          .map((item: any) => ({
            id: item.id,
            content: extractTextFromBlocks(item.content),
            username: item.pseudo,
            createdAt: item.createdAt,
            children: item.messages?.map((child: any) => ({
              id: child.id,
              content: extractTextFromBlocks(child.content),
              username: child.pseudo,
              createdAt: child.createdAt,
            })) ?? [],
          }));

        setMessages(processedMessages);
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    }

    loadMessages();
  }, [roomSlug]);

  // ✅ Gère Socket.IO pour les nouveaux messages
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
          // Si c'est une réponse, ajoute-la aux enfants du message parent
          return prev.map((m) =>
            m.id === msg.parent!.id
              ? { ...m, children: [...(m.children ?? []), processedMsg] }
              : m
          );
        }
        // Sinon, ajoute le message à la liste principale
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