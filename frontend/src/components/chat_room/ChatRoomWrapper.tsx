import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import type { Message } from './chat';
import { getEndpoint } from '../../config/api';
import { extractTextFromBlocks } from './utils';

// ChatRoomWrapper.tsx
export default function ChatRoomWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadMessages() {
    if (!slug) { setError('Room slug is missing'); setIsLoading(false); return; }
    try {
      const roomRes = await fetch(
        getEndpoint(`/rooms?filters[slug][$eq]=${encodeURIComponent(slug)}`)
      );
      if (!roomRes.ok) throw new Error('Failed to load room');
      const roomData = await roomRes.json();
      if (!roomData.data?.[0]) throw new Error('Room not found');
      const roomId = roomData.data[0].id;

      const res = await fetch(
        getEndpoint(`/messages?populate=*&filters[room][id][$eq]=${roomId}&sort=createdAt:asc`)
      );
      if (!res.ok) throw new Error('Failed to load messages');
      const { data } = await res.json();

      console.log('Total raw messages:', data.length);
      console.log('Premier message raw:', JSON.stringify(data[0], null, 2));
      
      const messages = data
        .filter((item: any) => !item.parent?.id)
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


      console.log('Msg fetches:', messages.length, messages);
      setInitialMessages(messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, [slug]);

  if (!slug) return <p>Room not found</p>;
  if (isLoading) return <p>Loading messages...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ChatRoom
      roomSlug={slug}
      initialMessages={initialMessages}
    />
  );
}