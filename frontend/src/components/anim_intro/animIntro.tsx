import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import './animIntro.css'

export default function  AnimIntro()
{
	const	videoRef = useRef<HTMLVideoElement>(null);
	const introPageRef = useRef<HTMLDivElement>(null);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 750);
		}

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.play().catch(err => {
				console.warn('Autoplay blocked', err);
			});
		}
	}, []);

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
			<video 
				ref={videoRef}
				className="intro-video"
				autoPlay
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