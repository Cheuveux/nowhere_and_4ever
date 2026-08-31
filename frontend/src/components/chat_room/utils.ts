// Convertir le format blocks Strapi en texte simple
export function extractTextFromBlocks(blocks: any): string {
  if (!blocks) return '';
  
  if (typeof blocks === 'string') {
    return blocks; // Déjà du texte
  }

  if (!Array.isArray(blocks)) return '';

  return blocks
    .map((block: any) => {
      if (block.children && Array.isArray(block.children)) {
        return block.children.map((child: any) => child.text || '').join('');
      }
      return '';
    })
    .join('\n');
}

export function formatDateLabel(dateStr: string)
{
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear ();
  if (isSameDay(date, today))
    return "Today";
  if (isSameDay(date, yesterday))
      return "Yesterday";
  
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

}