import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import './animIntro.css';

export default function AnimIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const introPageRef = useRef<HTMLDivElement>(null);
  const introImageRef = useRef<HTMLDivElement>(null);
  const [isMobile] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [showIntroImage, setShowIntroImage] = useState(false);
  const navigate = useNavigate;

  useEffect(() => {
    if (showIntroImage && introImageRef.current) {
      gsap.from(introImageRef.current, {
        y: -100,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.5,
        ease: "power2.out",
        clearProps: "filter",
      });
    }
  }, [showIntroImage]);

  const handlePromptResponse = (answer: 'yes' | 'no') => {
    if (answer === 'yes') {
      if (videoRef.current) {
        videoRef.current.play();
        setShowPrompt(false);
      }
    }
  };

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.style.display = 'none';
    }
    setShowIntroImage(true);
  };

  return (
    <div className="intro-page" ref={introPageRef}>
      {showPrompt && (
        <div className="intro-prompt">
          <img
            src="https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/button/btn_intro_mobile.gif"
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
          // muted
          playsInline
          controls={false}
          onEnded={handleVideoEnded}
        >
          <source
            src={isMobile
              ? 'https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/video_intro/intro_mobile_compressed.mp4'
              : 'https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/video_intro/intro_desktop_compressed.mp4'}
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
        
          <div className="intro-btn-wrapper">
            <button
              className="intro-post-button"
              onClick={() => {
                sessionStorage.setItem('introSeen', 'true');
                navigate('/');
              }}
            >
              <img
                src="https://pub-f40c928893604e5a88020abc31e69a5e.r2.dev/button/btn_intro_mobile.gif"
                alt="Enter homepage"
              />
            </button>
          </div>
        </div>

      )}
    </div>
  );
}