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
