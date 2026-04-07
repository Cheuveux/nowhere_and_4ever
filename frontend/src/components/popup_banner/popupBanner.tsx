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
	emailAdress,
}: EmailPopupProps){

	const contentRef = useRef<HTMLDivElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isOpen && overlayRef.current) {
			//Overlay fade-in
			gsap.fromTo(overlayRef.current,
				{ opacity: 0},
				{opacity: 1, duration: 0.3, ease: "power2.out"}
			);
		}
	}, [isOpen])
	if (!isOpen)
		return (null);

	return (
		<div className="popup-overlay" onClick={onClose} ref={overlayRef}>
			<div className="popup-content" onClick={(e) => e.stopPropagation()} ref={contentRef}>
				<button className='popup-close' onClick={onClose}>x</button>
				<a 
					href="mailto:palomavauthier@gmail.com"
					className="popup-email-button"
				>
					{emailAdress}
				</a>
			</div>
		</div>
	)
}