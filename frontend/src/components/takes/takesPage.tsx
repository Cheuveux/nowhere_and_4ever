import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEndpoint } from "../../config/api";
import './takesPage.css';
import { InteractiveIcon } from '../random-icon/InteractiveIcon';

export default function TakePage() {
    const { id } = useParams();
    const [takes, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(
            getEndpoint(`/takes/${id}?populate=*`)
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setArticle(data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const   TAKE_STYLES: Record <string, string> = {
        "q1p5of779n0au0cvt97ftl6b" : "takes-style-linear", // prod
        "i1u5saj3vl7ejj18vz4uvr00" : "takes-style-linear", // equiv local
    };


    const renderBlockContent = (content: any) => {
        if (!content) return null;
        if (Array.isArray(content)) {
            return content.map((block: any, idx: number) => {
                const text = block.children
                    ?.map((child: any) => child.text || "")
                    .join("") || "";
                if (!text) return null;

                if (block.type === "heading") {
                    const level = block.level || 1;
                    return React.createElement(
                        `h${level}` as any,
                        { key: idx, className: `takes-heading takes-h${level}` },
                        text
                    );
                }
                if (block.type === "paragraph") {
                    return <p key={idx} className="takes-text">{text}</p>;
                }
                return null;
            });
        }
        return <p className="takes-text">{content}</p>;
    };

    if (loading) return <p>Loading...</p>;
    if (!takes) return <p>Article not found.</p>;
    const takeStyle = TAKE_STYLES[takes.documentId] ?? "";

    return (
        <div className="takes-page" style={{ position: 'relative' }}>
            <InteractiveIcon
                position="top-right"
                probability={1}
                size={80}
                sizeVariation={0.3}
                positionVariation={30}
                animate={true}
            />
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
                    <Link to="/">
                        <img src="https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/button/home.png" alt="" />
                    </Link>
                </div>
                <div className="takes-title-section">
                    {takes.id_code && <span className="takes-id-code">#{takes.id_code}</span>}
                </div>
            </div>
            <div className={`takes-content ${takeStyle}`}>
                {takes.take_illustration && takes.take_illustration.length > 0 && takes.take_illustration[0].url && (
                    <img
                    	src={
                                takes.take_illustration[0].url.startsWith('http')
                                ? takes.take_illustration[0].url
                                : `${import.meta.env.VITE_API_URL || "http://localhost:1337"}${takes.take_illustration[0].url}`
                            }
                        alt={takes.title}
                        className="takes-visual"
                    />
                )}
                {renderBlockContent(takes.content)}
            </div>
        </div>
    );
}