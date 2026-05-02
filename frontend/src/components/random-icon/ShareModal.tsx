import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
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
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Animation GSAP d'apparition/disparition
  useEffect(() => {
    if (!modalRef.current || !overlayRef.current) return;

    if (isOpen) {
      // Apparition
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      gsap.fromTo(
        modalRef.current,
        { x: -400, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    } else {
      // Disparition
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });

      gsap.to(modalRef.current, {
        x: -400,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          // Optionnel: nettoyer après l'animation
        },
      });
    }
  }, [isOpen]);

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

  // Ne pas rendre le DOM si fermé au début (mais garder l'animation)
  if (!isOpen && !modalRef.current) return null;

  return (
    <>
      {/* Fond semi-transparent */}
      <div 
        ref={overlayRef}
        className="share-modal-overlay" 
        onClick={onClose}
        style={{ opacity: 0, pointerEvents: isOpen ? 'auto' : 'none' }}
      />
      
      {/* Popup */}
      <div 
        ref={modalRef}
        className="share-modal"
        style={{ 
          opacity: 0,
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
      >
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
            {copied ? '💖 Copied 💖' : ' 💕 Copy it 💕'}
          </button>

          {/* Message de confirmation */}
          {copied && (
            <p className="share-modal-success">
              Link ready to be shared!
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ShareModal;
