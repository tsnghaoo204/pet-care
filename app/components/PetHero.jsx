import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';

export function PetHero() {
  const containerRef = useRef(null);

  // --- GIF-CAT (SASSY CAT) STATES & REFS ---
  const catCanvasRef = useRef(null);
  const catTimerRef = useRef(null);
  const [isCatHovered, setIsCatHovered] = useState(false);
  const [isCatGifPlaying, setIsCatGifPlaying] = useState(false);

  // --- GIF-DOG (DOG CƯNG) STATES & REFS ---
  const dogCanvasRef = useRef(null);
  const dogTimerRef = useRef(null);
  const [isDogHovered, setIsDogHovered] = useState(false);
  const [isDogGifPlaying, setIsDogGifPlaying] = useState(false);

  // --- GIF-MEME (CAT MEME) STATES & REFS ---
  const [isCatMemeHovered, setIsCatMemeHovered] = useState(false);

  useEffect(() => {
    // Capture static frame 1 of Cat GIF on canvas load
    const catImg = new Image();
    catImg.src = '/img/gif-cat.gif';
    catImg.onload = () => {
      if (catCanvasRef.current) {
        const canvas = catCanvasRef.current;
        canvas.width = catImg.width || 300;
        canvas.height = catImg.height || 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(catImg, 0, 0);
        }
      }
    };

    // Capture static frame 1 of Dog GIF on canvas load
    const dogImg = new Image();
    dogImg.src = '/img/gif-dog.gif';
    dogImg.onload = () => {
      if (dogCanvasRef.current) {
        const canvas = dogCanvasRef.current;
        canvas.width = dogImg.width || 300;
        canvas.height = dogImg.height || 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(dogImg, 0, 0);
        }
      }
    };

    return () => {
      if (catTimerRef.current) clearTimeout(catTimerRef.current);
      if (dogTimerRef.current) clearTimeout(dogTimerRef.current);
    };
  }, []);

  // --- GIF-CAT HOVER HANDLERS ---
  const handleCatMouseEnter = () => {
    setIsCatHovered(true);
    setIsCatGifPlaying(true);
    if (catTimerRef.current) clearTimeout(catTimerRef.current);
  };

  const handleCatMouseLeave = () => {
    if (catTimerRef.current) clearTimeout(catTimerRef.current);
    setIsCatHovered(false);
    setIsCatGifPlaying(false);
  };

  // --- GIF-DOG HOVER HANDLERS ---
  const handleDogMouseEnter = () => {
    setIsDogHovered(true);
    setIsDogGifPlaying(true);
    if (dogTimerRef.current) clearTimeout(dogTimerRef.current);
  };

  const handleDogMouseLeave = () => {
    if (dogTimerRef.current) clearTimeout(dogTimerRef.current);
    setIsDogHovered(false);
    setIsDogGifPlaying(false);
  };

  // --- GIF-MEME HOVER HANDLERS ---
  const handleCatMemeMouseEnter = () => {
    setIsCatMemeHovered(true);
  };

  const handleCatMemeMouseLeave = () => {
    setIsCatMemeHovered(false);
  };

  return (
    <section className="pet-hero pet-hero-full-width" ref={containerRef}>
      <div className="pet-hero-full-panel">
        <div className="living-room-container custom-bg-stage">
          {/* Background Image Container */}
          <div className="custom-background-img">
            <img src="/img/background.png" alt="Living Room Background" />
          </div>

          {/* ---------------- GIF-MEME (CAT MEME - AUTO LOOPS ALWAYS) 😸 ---------------- */}
          <div
            className={`gif-meme cat-meme-wrapper ${isCatMemeHovered ? 'is-moving' : 'is-idle'}`}
            style={{
              position: 'absolute',
              top: '48%',
              left: '10%',
              width: '16%',
              aspectRatio: '1 / 1',
              zIndex: 10,
              cursor: 'pointer',
            }}
            onMouseEnter={handleCatMemeMouseEnter}
            onMouseLeave={handleCatMemeMouseLeave}
          >
            {/* Speech Bubble on Hover */}
            {isCatMemeHovered && (
              <div className="pet-speech-bubble bubble-gif-meme">
                <span className="bubble-text">Meow~ Grab some yummy treats & cozy cat trees for me! 🐾✨</span>
                <Link to="/collections/all" className="bubble-link">Explore Cat Trees ➔</Link>
              </div>
            )}

            {/* Always-Playing Animated GIF */}
            <img
              src="/img/gif-meme.gif"
              alt="gif-meme"
              className="cat-media-element"
              style={{ display: 'block' }}
            />
            <span className="pet-label-tag">gif-meme 😸</span>
          </div>

          {/* ---------------- GIF-CAT (SASSY CAT STICKER) 🐱 ---------------- */}
          <div
            className={`gif-cat sassy-cat-wrapper ${isCatHovered ? 'is-moving' : 'is-idle'}`}
            style={{
              position: 'absolute',
              top: '52%',
              left: '45%',
              width: '15%',
              aspectRatio: '1 / 1',
              zIndex: 10,
              cursor: 'pointer',
            }}
            onMouseEnter={handleCatMouseEnter}
            onMouseLeave={handleCatMouseLeave}
          >
            {/* Speech Bubble on Hover */}
            {isCatHovered && (
              <div className="pet-speech-bubble bubble-gif-cat">
                <span className="bubble-text">Meow~ Check out cute interactive cat toys & collars! 🐾✨</span>
                <Link to="/collections/all" className="bubble-link">Shop Cat Toys ➔</Link>
              </div>
            )}

            {/* Static Canvas Frame */}
            <canvas
              ref={catCanvasRef}
              className="cat-media-element"
              style={{
                display: isCatGifPlaying ? 'none' : 'block',
              }}
            />

            {/* Animated GIF Image */}
            <img
              src="/img/gif-cat.gif"
              alt="gif-cat"
              className="cat-media-element"
              style={{
                display: isCatGifPlaying ? 'block' : 'none',
              }}
            />
            <span className="pet-label-tag">gif-cat 🐱</span>
          </div>

          {/* ---------------- GIF-DOG (DOG CƯNG ON SOFA) 🐶 ---------------- */}
          <div
            className={`gif-dog dog-sticker-wrapper ${isDogHovered ? 'is-moving' : 'is-idle'}`}
            style={{
              position: 'absolute',
              top: '12%',
              left: '62%',
              width: '18%',
              aspectRatio: '1 / 1',
              zIndex: 10,
              cursor: 'pointer',
            }}
            onMouseEnter={handleDogMouseEnter}
            onMouseLeave={handleDogMouseLeave}
          >
            {/* Speech Bubble on Hover */}
            {isDogHovered && (
              <div className="pet-speech-bubble bubble-gif-dog">
                <span className="bubble-text">Woof woof~ Get me a tasty chew bone & durable toy please! 🦴✨</span>
                <Link to="/collections/all" className="bubble-link">Shop Dog Toys ➔</Link>
              </div>
            )}

            {/* Static Canvas Frame */}
            <canvas
              ref={dogCanvasRef}
              className="cat-media-element"
              style={{
                display: isDogGifPlaying ? 'none' : 'block',
              }}
            />

            {/* Animated GIF Image */}
            <img
              src="/img/gif-dog.gif"
              alt="gif-dog"
              className="cat-media-element"
              style={{
                display: isDogGifPlaying ? 'block' : 'none',
              }}
            />
            <span className="pet-label-tag">gif-dog 🐶</span>
          </div>
        </div>
      </div>
    </section>
  );
}
