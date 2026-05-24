import { useEffect, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import './animIntro.css'

export default function  AnimIntro()
{
	const	videoRef = useRef<HTMLVideoElement>(null);
	const introPageRef = useRef<HTMLDivElement>(null);
	const introImageRef = useRef<HTMLDivElement>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [showPrompt, setShowPrompt] = useState(true);
	const [showIntroImage, setShowIntroImage] = useState(false);

	useLayoutEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 1050);
		}

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Sur desktop, lancer la vidéo automatiquement sans bouton
	// Sur mobile, afficher le prompt
	useEffect(() => {
		setShowPrompt(isMobile);
	}, [isMobile]);

	useEffect(() => {
		// Sur desktop: lancer la vidéo automatiquement
		// Sur mobile: attendre le click sur YES
		if (videoRef.current && !isPlaying && !showPrompt && !isMobile) {
			videoRef.current.play().catch(err => {
				console.warn('Autoplay blocked', err);
			});
		}
	}, [isPlaying, showPrompt, isMobile]);

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
		// Cacher la vidéo et afficher l'image intro
		if (videoRef.current) {
			videoRef.current.style.display = 'none';
		}
		setShowIntroImage(true);
	};

	return(
		<div className="intro-page" ref={introPageRef}>
			{showPrompt && (
				<div className="intro-prompt">
					<img 
						src="/img_assets/icons/enter_btn.gif" 
						alt="Enter to start"
						className="intro-prompt-image"
						onClick={() => handlePromptResponse('yes')}
					/>
				</div>
			)}
			{!showIntroImage && (
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
			)}
			{showIntroImage && (
				<div className="intro-image-container" ref={introImageRef}>
					<img 
						src="/img_assets/intro.png" 
						alt="Intro content"
						className="intro-image"
					/>
					<button 
						className="intro-post-button"
						onClick={() => window.location.href = '/'}
					>
						<img 
							src="/img_assets/post_intro_btn.png" 
							alt="Enter homepage"
						/>
					</button>
				</div>
			)}
		</div>
	);
}