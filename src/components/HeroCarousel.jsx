import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const CAROUSEL_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    title: 'Custom Modular Kitchens',
    highlight: 'Engineered For Elegance',
    description: 'Transform your culinary space with our premium, moisture-resistant modular kitchens handcrafted to fit your home layout perfectly.',
    cta: 'Explore Kitchens',
    category: 'Modular Kitchen'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    title: 'Wardrobes & Bedroom Cupboards',
    highlight: 'Maximize Style & Storage',
    description: 'Sleek sliding wardrobes and classic solid wood cupboards carved from seasoned teak, optimizing space and durability.',
    cta: 'Browse Cupboards',
    category: 'bedroom cupboard'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    title: 'Exquisite Teak Wood Doors',
    highlight: 'Handcrafted Grand Entrances',
    description: 'First impressions matter. Secure your home with solid teak doors featuring traditional patterns and CNC router designs.',
    cta: 'View Custom Doors',
    category: 'Wooden Door'
  }
];

export default function HeroCarousel({ onSelectCategory }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIdx((prevIdx) => (prevIdx + 1) % CAROUSEL_SLIDES.length);
  }, []);

  const handlePrev = () => {
    setCurrentIdx((prevIdx) => (prevIdx - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  // Autoplay functionality
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <div className="hero-carousel-container">
      {CAROUSEL_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`carousel-slide ${index === currentIdx ? 'active' : ''}`}
          style={{ backgroundImage: `linear-gradient(to right, rgba(30, 20, 10, 0.85) 30%, rgba(30, 20, 10, 0.4) 100%), url(${slide.image})` }}
        >
          {index === currentIdx && (
            <div className="container slide-content-wrapper">
              <div className="slide-content">
                <span className="slide-badge">{slide.highlight}</span>
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-description">{slide.description}</p>
                <button
                  className="btn btn-accent slide-cta-btn"
                  onClick={() => onSelectCategory(slide.category)}
                >
                  <span>{slide.cta}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Slide Navigation Arrows */}
      <button className="carousel-nav-btn prev" onClick={handlePrev} aria-label="Previous slide">
        <ChevronLeft size={24} />
      </button>
      <button className="carousel-nav-btn next" onClick={handleNext} aria-label="Next slide">
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="carousel-dots">
        {CAROUSEL_SLIDES.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIdx ? 'active' : ''}`}
            onClick={() => setCurrentIdx(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style>{`
        .hero-carousel-container {
          position: relative;
          height: 520px;
          overflow: hidden;
          background-color: #1e1b18;
          border-bottom: 2px solid var(--border);
        }

        .carousel-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity var(--transition-slow), visibility var(--transition-slow);
          display: flex;
          align-items: center;
        }

        .carousel-slide.active {
          opacity: 1;
          visibility: visible;
          z-index: 10;
        }

        .slide-content-wrapper {
          display: flex;
          align-items: center;
          height: 100%;
          text-align: left;
        }

        .slide-content {
          max-width: 600px;
          color: white;
          padding: 20px;
          animation: slideUp 0.6s ease-out forwards;
        }

        .slide-badge {
          display: inline-block;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--accent);
          background-color: rgba(234, 179, 8, 0.12);
          border: 1px solid rgba(234, 179, 8, 0.3);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          margin-bottom: 16px;
        }

        .slide-title {
          font-family: var(--font-serif);
          font-size: 3.2rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 16px;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slide-description {
          font-size: 1.1rem;
          color: #ebdcd0;
          margin-bottom: 28px;
          line-height: 1.6;
        }

        .slide-cta-btn {
          padding: 12px 28px;
          font-size: 1rem;
        }

        /* Nav controls */
        .carousel-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
          transition: all var(--transition-fast);
        }
        .carousel-nav-btn:hover {
          background-color: var(--primary);
          box-shadow: var(--shadow-md);
        }
        
        .carousel-nav-btn.prev {
          left: 24px;
        }
        .carousel-nav-btn.next {
          right: 24px;
        }

        /* Dots */
        .carousel-dots {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 20;
        }

        .carousel-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.4);
          transition: all var(--transition-fast);
        }

        .carousel-dot.active {
          width: 28px;
          border-radius: var(--radius-full);
          background-color: var(--accent);
        }

        @media (max-width: 768px) {
          .hero-carousel-container {
            height: 400px;
          }
          .slide-title {
            font-size: 2.2rem;
          }
          .slide-description {
            font-size: 0.95rem;
          }
          .carousel-nav-btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
