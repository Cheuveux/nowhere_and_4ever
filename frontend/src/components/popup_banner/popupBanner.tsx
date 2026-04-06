// import { ReactNode } from 'react';
import { useEffect, useRef} from 'react';
import gsap from 'gsap';
import './popupBanner.css';

interface EmailPopupProps {
	isOpen: boolean;
	onClose: () => void;
	heading: string;
	description: string;
	emailAdress: string;
}

export default function EmailPopup({
	isOpen,
	onClose, 
	heading,
	description,
	emailAdress,
}: EmailPopupProps){

	const contentRef = useRef<HTMLDivElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen && contentRef.current && overlayRef.current) {
			//Overlay fade-in
			gsap.fromTo(overlayRef.current,
				{ opacity: 0},
				{opacity: 1, duration: 0.3, ease: "power2.out"}
			);
			
			//Scale + rotation + wobble
			gsap.to(contentRef.current, 
				{
					rotation: () => gsap.utils.random(-2, 2),
					duration: 0.1,
					repeat: 3,
					yoyo: true,
					delay: 0.6
				});
		}
	}, [isOpen])
	if (!isOpen)
		return (null);

	return (
		<div className="popup-overlay" onClick={onClose} ref={overlayRef}>
			<div className="popup-content" onClick={(e) => e.stopPropagation()} ref={contentRef}>
				<button className='popup-close' onClick={onClose}>x</button>
				<h1 className="popup-heading">{heading}</h1>
				<h1 className="popup-description">{description}</h1>
				<a href="mailto: palomavauthier@gmail.com" className="popup-email-link">
					{emailAdress}
				</a>
			</div>
		</div>
	)
}