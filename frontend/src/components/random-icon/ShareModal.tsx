import React, { useState } from 'react';
import './ShareModal.css';

interface ShareModalProps {
  // URL à partager
  url: string;
  // Titre optionnel
  title?: string;
  // Si le modal est ouvert
  isOpen: boolean;
  // Callback pour fermer
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  url,
  title = 'Share it to others',
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  // ✅ Copier le lien dans le presse-papiers
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      // Réinitialiser après 2 secondes
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  // ✅ Ne pas afficher si fermé
  if (!isOpen) return null;

  return (
    <>
      {/* Fond semi-transparent */}
      <div className="share-modal-overlay" onClick={onClose} />
      
      {/* Popup */}
      <div className="share-modal">
        <div className="share-modal-header">
          <h2>{title}</h2>
          <button className="share-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="share-modal-content">
          {/* Afficher l'URL */}
          <div className="share-modal-url-display">
            <p className="share-modal-url">{url}</p>
          </div>

          {/* Bouton Copier */}
          <button 
            className={`share-modal-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyLink}
          >
            {copied ? '✅ Copié!' : '📋 Copier le lien'}
          </button>

          {/* Message de confirmation */}
          {copied && (
            <p className="share-modal-success">
              Le lien a été copié dans votre presse-papiers!
            </p>
          )}

          {/* Autres options de partage (optionnel) */}
          <div className="share-modal-other-options">
            <p className="share-modal-label">Ou partager via:</p>
            <div className="share-modal-buttons">
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-modal-social twitter"
              >
                𝕏 Twitter
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-modal-social facebook"
              >
                f Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareModal;
