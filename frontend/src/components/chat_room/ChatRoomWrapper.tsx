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

  useEffect(() => {
    if (!slug) {
      setError('Room slug is missing');
      setIsLoading(false);
      return;
    }

    async function loadMessages() {
      try {
        // ✅ Step 1: Fetch room by slug to get its ID
        const roomRes = await fetch(
          getEndpoint(`/rooms?filters[slug][$eq]=${encodeURIComponent(slug || '')}`)
        );
        if (!roomRes.ok) throw new Error('Failed to load room');
        const roomData = await roomRes.json();
        
        if (!roomData.data || roomData.data.length === 0) {
          throw new Error('Room not found');
        }

        const roomId = roomData.data[0].id;

        // ✅ Step 2: Fetch messages WITH relations (including nested children)
        const res = await fetch(
          getEndpoint(`/messages?populate=*&sort=createdAt:asc`)
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error('API Error:', errorText);
          throw new Error('Failed to load messages');
        }

        const { data } = await res.json();

        console.log('🔍 FULL FIRST MESSAGE:', JSON.stringify(data[0], null, 2));
        console.log('🔍 RoomId:', roomId);

        // ✅ Filter by roomId and parent-only, client-side
        const messages = data
          .filter((item: any) => {
            const matchRoom = item.room?.id === roomId;
            return matchRoom && !item.parent?.id;
          })
          .map((item: any) => {
            const children = item.messages?.map((child: any) => ({
              id: child.id,
              content: extractTextFromBlocks(child.content),
              username: child.pseudo,
              createdAt: child.createdAt,
            })) ?? [];

            console.log(`📨 Message ${item.id}: ${children.length} enfants`);

            const mapped = {
              id: item.id,
              content: extractTextFromBlocks(item.content),
              username: item.pseudo,
              createdAt: item.createdAt,
              children,
            };
            return mapped;
          });

        console.log('✅ Final messages:', messages);
        messages.forEach((msg: Message) => {
          console.log(`  Message ${msg.id}: "${msg.content.substring(0, 30)}" - ${msg.children.length} réponses`);
        });
        setInitialMessages(messages);
      } catch (err) {
        console.error('Error loading messages:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    loadMessages();
  }, [slug]);

  if (!slug) return <p>Room not found</p>;
  if (isLoading) return <p>Loading messages...</p>;
  if (error) return <p>Error: {error}</p>;

  return <ChatRoom roomSlug={slug} initialMessages={initialMessages} />;
}
