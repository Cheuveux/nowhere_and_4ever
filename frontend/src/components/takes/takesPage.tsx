import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './takesPage.css'

// ===== ICÔNES ALÉATOIRES =====
// Importez le composant pour ajouter des icônes positionnées
import { RandomIconSpot } from '../random-icon/RandomIconSpot';

export default function TakePage() {
    const { id } = useParams();
    const [takes, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const  icon_size = 150;
    useEffect(() => {
        // Include all relations/media with populate=*
        fetch(
            `http://localhost:1337/api/takes/${id}?populate=*`
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data); // Log to see the structure
                setArticle(data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    // Render block content from Strapi rich text editor
    const renderBlockContent = (content: any) => {
        if (!content) return null;
        
        if (Array.isArray(content)) {
            return content.map((block: any, idx: number) => {
                console.log("Block structure:", block); // Debug log
                
                const text = block.children
                    ?.map((child: any) => child.text || "")
                    .join("") || "";
                
                if (!text) return null;
                
                // Handle headings
                if (block.type === "heading") {
                    const level = block.level || 1;
                    return React.createElement(
                        `h${level}` as any,
                        { key: idx, className: `takes-heading takes-h${level}` },
                        text
                    );
                }
                
                // Handle paragraphs
                if (block.type === "paragraph") {
                    return (
                        <p key={idx} className="takes-text">
                            {text}
                        </p>
                    );
                }
                
                return null;
            });
        }
        
        // Fallback for string content
        return <p className="takes-text">{content}</p>;
    };

    if (loading) return <p>Loading...</p>;
    if (!takes) return <p>Article not found.</p>;
    
    return (
        <div className="takes-page" style={{ position: 'relative' }}>
            {/* 
              ===== ICÔNES ALÉATOIRES (Coin haut droit) =====
              Cet élément ajoute une icône aléatoire au coin haut droit.
              
              PARAMÈTRES :
              - position: les options sont 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'
              - probability: 0.5 = 50% de chance d'affichage
              - size: 50 = taille en pixels
              - animate: true = animation flottante
              
              ESSAYEZ :
              - Changez position en 'top-left' ou 'bottom-left'
              - Modifiez probability : 0.1 (rare), 0.7 (fréquent), 1 (toujours)
              - Ajustez size : 30 (petit), 60 (grand)
            */}
            <RandomIconSpot 
              position="top-right" 
              probability={1} 
              size={icon_size}
              animate={true}
            />
            
            {/* ===== ICÔNES ALÉATOIRES (Coin bas gauche) ===== */}
            <RandomIconSpot 
              position="bottom-left" 
              probability={1} 
              size={icon_size}
              animate={true}
            />
            
            <div className="takes-header">
                <div className="return_btn">
                    <Link to="/">../home/</Link>
                </div>
                <div className="takes-title-section">
                    {takes.id_code && <span className="takes-id-code">#{takes.id_code}</span>}
                </div>
            </div>
            <div className="takes-content">
                {takes.take_illustration && takes.take_illustration.length > 0 && takes.take_illustration[0].url && (
                    <img 
                        src={`http://localhost:1337${takes.take_illustration[0].url}`}
                        alt={takes.title}
                        className="takes-visual"
                    />
                )}
                {renderBlockContent(takes.content)}
            </div>
        </div>
    );
}