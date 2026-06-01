import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './popupBanner.css';

interface MeceneButtonProps {
    isOpen: boolean;
}

export default function MeceneButton({ isOpen }: MeceneButtonProps) {
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isVisibleForAnimation, setIsVisibleForAnimation] = useState(true);

    useEffect(() => {
        if (isOpen && buttonRef.current && isVisibleForAnimation) {
            gsap.fromTo(
                buttonRef.current,
                { opacity: 0, x: -50, y: -50 },
                { opacity: 1, x: 0, y: 0, duration: 0.6, ease: 'back.out' }
            );

            const hideTimer = setTimeout(() => {
                gsap.to(buttonRef.current, {
                    opacity: 0,
                    x: -50,
                    y: -50,
                    duration: 0.6,
                    ease: 'back.in',
                    onComplete: () => setIsVisibleForAnimation(false),
                });
            }, 10000);

            return () => clearTimeout(hideTimer);
        }
    }, [isOpen, isVisibleForAnimation]);

    useEffect(() => {
        if (isOpen && !isVisibleForAnimation) {
            const showTimer = setTimeout(() => {
                setIsVisibleForAnimation(true);
            }, 5000);

            return () => clearTimeout(showTimer);
        }
    }, [isOpen, isVisibleForAnimation]);

    if (!isOpen || !isVisibleForAnimation) return null;

    return (
        <a
            href="mailto:palomavauthier@gmail.com"
            ref={buttonRef}
            className="mecene-button"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={
                    isHovered
                        ? 'https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/button/btn_mecene_hover.gif'
                        : 'https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/button/mecene_btn.png'
                }
                alt="Mecene Button"
                className="mecene-button-img"
            />
        </a>
    );
}