import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './popupBanner.css';

interface MeceneButtonProps {
	isOpen: boolean;
}

export default function MeceneButton({ isOpen }: MeceneButtonProps) {
	const buttonRef = useRef<HTMLDivElement>(null);
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		if (isOpen && buttonRef.current) {
			// GSAP entrance animation - slide in from top-left with fade
			gsap.fromTo(
				buttonRef.current,
				{ opacity: 0, x: -50, y: -50 },
				{ opacity: 1, x: 0, y: 0, duration: 0.6, ease: 'back.out' }
			);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<a
			href="mailto:palomavauthier@gmail.com"
			// ref={buttonRef}
			className="mecene-button"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<img
				src={
					isHovered
						? '/img_assets/btn_popup/mecene_button_hover.png'
						: '/img_assets/btn_popup/mecene_button.png'
				}
				alt="Mecene Button"
				className="mecene-button-img"
			/>
		</a>
	);
}