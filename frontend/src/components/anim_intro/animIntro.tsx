import { useEffect, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import './animIntro.css'

export default function  AnimIntro()
{
	const	videoRef = useRef<HTMLVideoElement>(null);
	const introPageRef = useRef<HTMLDivElement>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [showPrompt, setShowPrompt] = useState(true);

	useLayoutEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 750);
		}

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	useEffect(() => {
		if (videoRef.current && !isPlaying && !showPrompt) {
			videoRef.current.play().catch(err => {
				console.warn('Autoplay blocked', err);
			});
		}
	}, [isPlaying, showPrompt]);

	const handlePromptResponse = (answer: 'yes' | 'no') => {
		if (answer === 'yes') {
			if (videoRef.current) {
				videoRef.current.play();
				setIsPlaying(true);
				setShowPrompt(false);
			}
		}
		// Si 'no', on fait rien, le bouton reste affiché
	};

	const handleVideoEnded = () => {
		// Animation GSAP : fade out smooth
		gsap.to(introPageRef.current, {
			opacity: 0,
			duration: 1.5,
			ease: "power2.inOut",
			onComplete: () => {
				window.location.href = '/';
			}
		});
	};

	return(
		<div className="intro-page" ref={introPageRef}>
			{showPrompt && (
				<div className="intro-prompt">
					<div className="intro-prompt-content">
						<p className="intro-prompt-text">ENTER :</p>
						<div className="intro-prompt-buttons">
							<button 
								className="intro-btn-yes"
								onClick={() => handlePromptResponse('yes')}
							>
								YES
							</button>
							<button 
								className="intro-btn-no"
								onClick={() => handlePromptResponse('no')}
							>
								NO
							</button>
						</div>
						<div className="intro-prompt-footer">
							<p>the magic of the illusion of choice</p>
						</div>
					</div>
				</div>
			)}
			<video 
				ref={videoRef}
				className="intro-video"
				muted
				onEnded={handleVideoEnded}
			>
				<source
					src={isMobile ? '/anim_intro/4ever_mobile_intro.mp4' : '/anim_intro/4ever_intro_ordi.mp4'}
				/>
				Probleme de video a cause du navigateur.
			</video>
		</div>
	);
}