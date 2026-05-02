import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './takesPage.css'

// ===== ICÔNES ALÉATOIRES + PARTAGE ✨ =====
// Utilisez InteractiveIcon pour des icônes cliquables avec modal de partage
import { InteractiveIcon } from '../random-icon/InteractiveIcon';

export default function TakePage() {
    const { id } = useParams();
    const [takes, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
              ✨ ICÔNES ALÉATOIRES + PARTAGE (Coin haut droit)
              Cliquez sur l'icône pour partager!
              
              sizeVariation={0.3} = taille varie de ±30%
              positionVariation={30} = position varie de ±30px
            */}
            <InteractiveIcon 
              position="top-right" 
              probability={1}
              size={80}
              sizeVariation={0.3}
              positionVariation={30}
              animate={true}
            />
            
            {/* ✨ Deuxième icône (Coin bas gauche) */}
            <InteractiveIcon 
              position="bottom-left" 
              probability={1}
              size={80}
              sizeVariation={0.3}
              positionVariation={30}
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