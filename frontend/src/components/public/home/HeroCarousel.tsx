import { useEffect, useState } from "react";
import { heroSlides } from "../../../data/home-content";

export function HeroCarousel() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlideIndex((currentIndex) =>
        currentIndex === heroSlides.length - 1 ? 0 : currentIndex + 1,
      );
    }, 5500);

    return () => window.clearInterval(interval);
  }, []);

  const activeSlide = heroSlides[activeSlideIndex];

  return (
    <section className="hero-slider">
      <img
        className="hero-slider-image"
        src={activeSlide.imageUrl}
        alt={activeSlide.title}
      />

      <div className="hero-slider-overlay" />

      <div className="site-container hero-slider-inner">
        <div className="hero-slider-content">
          <span>{activeSlide.kicker}</span>

          <h1>{activeSlide.title}</h1>

          <p>{activeSlide.description}</p>

          <div className="hero-actions">
            <a className="button-primary" href="#modelos">
              {activeSlide.primaryAction}
            </a>

            <a className="button-secondary" href="#receita">
              {activeSlide.secondaryAction}
            </a>
          </div>
        </div>
      </div>

      <div className="site-container hero-dots-container">
        <div className="hero-dots">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.title}
              className={index === activeSlideIndex ? "active" : ""}
              type="button"
              aria-label={`Ir para banner ${index + 1}`}
              onClick={() => setActiveSlideIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
