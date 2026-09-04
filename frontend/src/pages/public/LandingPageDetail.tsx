import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  landingPagesService,
  type LandingPage,
  type LandingPageSection,
} from "../../services/landing-pages.service";
import { Seo } from "../../components/seo/Seo";

export function LandingPageDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadPage() {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await landingPagesService.getBySlug(slug);
        setLandingPage(data);
      } catch (err) {
        console.error("Erro ao carregar landing page:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px 20px",
          color: "#fff",
          background: "#0f172a",
          minHeight: "60vh",
        }}
      >
        <p>Carregando oferta...</p>
      </div>
    );
  }

  if (error || !landingPage) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px 20px",
          color: "#fff",
          background: "#0f172a",
          minHeight: "60vh",
        }}
      >
        <h2>Página não encontrada</h2>
        <p>A promoção que você está procurando não existe ou foi desativada.</p>
      </div>
    );
  }

  const whatsappLink = landingPage.whatsappNumber
    ? `https://wa.me/${landingPage.whatsappNumber}?text=${encodeURIComponent(landingPage.whatsappMessage || "Olá! Vim pela Landing Page.")}`
    : "#";

  return (
    <div className="landing-page-container">
      <Seo
        title={landingPage.title}
        description={
          landingPage.heroSubtitle || "Aproveite nossa promoção especial."
        }
        imageUrl={landingPage.heroBannerUrl}
      />

      {/* Hero Section */}
      <div
        className="landing-hero"
        style={{
          backgroundImage: landingPage.heroBannerUrl
            ? `linear-gradient(135deg, ${landingPage.primaryColor || "#0f172a"} 0%, rgba(15, 23, 42, 0.35) 45%, rgba(15, 23, 42, 0.92) 100%), url("${landingPage.heroBannerUrl}")`
            : `linear-gradient(135deg, ${landingPage.primaryColor || "#0f172a"} 0%, #111827 100%)`,
        }}
      >
        <div className="landing-hero-content">
          <h1 className="landing-title">
            {landingPage.heroTitle || landingPage.title}
          </h1>
          {landingPage.heroSubtitle && (
            <p className="landing-subtitle">{landingPage.heroSubtitle}</p>
          )}

          {landingPage.whatsappNumber && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-whatsapp-btn"
              style={{ backgroundColor: landingPage.primaryColor || "#25d366" }}
            >
              💬 {landingPage.ctaText || "Garantir Oferta no WhatsApp"}
            </a>
          )}
        </div>
      </div>

      {/* Conteúdo Dinâmico / Seções */}
      {landingPage.sections && landingPage.sections.length > 0 && (
        <div className="landing-sections">
          {[...landingPage.sections]
            .filter((section) => section.active !== false)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((section: LandingPageSection, index: number) => {
              const sectionStyle = {
                backgroundColor: section.bgColor || undefined,
                color: section.textColor || undefined,
              };

              const isBanner = section.type === "banner_9_16";
              const isGallery = section.type === "gallery";
              const isTestimonials = section.type === "testimonials";
              const isCta = section.type === "cta";

              return (
                <article
                  key={section.id || index}
                  className={`landing-section-card landing-section-${section.type || "features"}`}
                  style={sectionStyle}
                >
                  {section.imageUrl && (
                    <div className="landing-section-image-wrapper">
                      <img
                        src={section.imageUrl}
                        alt={section.title || "Imagem da campanha"}
                        className={
                          isBanner
                            ? "landing-section-image landing-section-image-banner"
                            : "landing-section-image"
                        }
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="landing-section-content">
                    {section.title && (
                      <h3 className="landing-section-title">
                        {section.title}
                      </h3>
                    )}

                    {section.subtitle && (
                      <p className="landing-section-subtitle">
                        {section.subtitle}
                      </p>
                    )}

                    {section.content && (
                      <p className="landing-section-text">
                        {section.content}
                      </p>
                    )}

                    {section.buttonText && (
                      <a
                        href={section.buttonLink || "#"}
                        className="landing-section-button"
                        style={{
                          backgroundColor:
                            landingPage.primaryColor || "#25d366",
                        }}
                        onClick={(event) => {
                          if (!section.buttonLink) {
                            event.preventDefault();
                          }
                        }}
                      >
                        {section.buttonText}
                      </a>
                    )}

                    {isGallery && !section.imageUrl && (
                      <p className="landing-section-text">
                        Galeria da campanha.
                      </p>
                    )}

                    {isTestimonials && !section.content && (
                      <p className="landing-section-text">
                        Depoimentos dos nossos clientes.
                      </p>
                    )}

                    {isCta && !section.content && (
                      <p className="landing-section-text">
                        Aproveite esta oportunidade.
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
        </div>
      )}
    </div>
  );
}
