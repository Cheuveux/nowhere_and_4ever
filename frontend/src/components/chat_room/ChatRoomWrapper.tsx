import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import type { Message } from './chat';
import { getEndpoint } from '../../config/api';
import { extractTextFromBlocks } from './utils';

export default function ChatRoomWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

// Dans ChatRoomWrapper
useEffect(() => {
  async function loadMessages() {
    if (!slug) {
      setError('Room slug is missing');
      setIsLoading(false);
      return;
    }

    try {
      const roomRes = await fetch(
        getEndpoint(`/rooms?filters[slug][$eq]=${encodeURIComponent(slug || '')}`)
      );
      if (!roomRes.ok) throw new Error('Failed to load room');
      const roomData = await roomRes.json();

      if (!roomData.data || roomData.data.length === 0) {
        throw new Error('Room not found');
      }

      const roomId = roomData.data[0].id;

      const res = await fetch(
        getEndpoint(`/messages?populate=*&filters[room][id][$eq]=${roomId}&sort=createdAt:asc`)
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error:', errorText);
        throw new Error('Failed to load messages');
      }

      const { data } = await res.json();

      const messages = data
        .filter((item: any) => item.room?.id === roomId && !item.parent?.id)
        .map((item: any) => {
          const children = item.messages?.map((child: any) => ({
            id: child.id,
            content: extractTextFromBlocks(child.content),
            username: child.pseudo,
            createdAt: child.createdAt,
          })) ?? [];

          return {
            id: item.id,
            content: extractTextFromBlocks(item.content),
            username: item.pseudo,
            createdAt: item.createdAt,
            children,
          };
        });

      setInitialMessages(messages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }

  loadMessages(); // Charge au montage

  // ✅ Recharge les messages quand l'onglet redevient actif
  const handleFocus = () => loadMessages();
  window.addEventListener('focus', handleFocus);
  return () => window.removeEventListener('focus', handleFocus);
}, [slug]);

  if (!slug) return <p>Room not found</p>;
  if (isLoading) return <p>Loading messages...</p>;
  if (error) return <p>Error: {error}</p>;

  return <ChatRoom roomSlug={slug} initialMessages={initialMessages} />;
}
