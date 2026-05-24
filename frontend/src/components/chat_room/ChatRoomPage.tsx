import ChatRoom from '@/components/ChatRoom';
import type { Message } from '@/types/chat';

// Charge les messages existants côté serveur (SSR)
// pour que la page ne soit pas vide au premier chargement
async function getInitialMessages(slug: string): Promise<Message[]> {
  try {
    // ✅ Utiliser VITE_ pour Vite
    const apiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
    
    const res = await fetch(
      `${apiUrl}/api/messages` +
      `?filters[room][slug][$eq]=${slug}` +
      `&filters[parent][$null]=true` +
      `&populate=children` +
      `&sort=createdAt:asc` +
      `&pagination[pageSize]=50`,
      { cache: 'no-store' }
    );

    const { data } = await res.json();

    // Strapi retourne { id, attributes } — on aplatit
    return data.map((item: any) => ({
      id: item.id,
      ...item.attributes,
      children: item.attributes.children?.data?.map((child: any) => ({
        id: child.id,
        ...child.attributes,
      })) ?? [],
    }));
  } catch (err) {
    console.error('Erreur chargement messages:', err);
    return [];
  }
}

export default async function ChatPage({
  params,
}: {
  params: { slug: string };
}) {
  const initialMessages = await getInitialMessages(params.slug);

  return (
    <ChatRoom
      roomSlug={params.slug}
      initialMessages={initialMessages}
    />
  );
}