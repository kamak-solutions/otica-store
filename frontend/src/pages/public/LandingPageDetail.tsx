import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { landingPagesService, type LandingPage, type LandingPageSection } from '../../services/landing-pages.service'
import { Seo } from '../../components/seo/Seo';

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
        console.error('Erro ao carregar landing page:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#fff', background: '#0f172a', minHeight: '60vh' }}>
        <p>Carregando oferta...</p>
      </div>
    );
  }

  if (error || !landingPage) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#fff', background: '#0f172a', minHeight: '60vh' }}>
        <h2>Página não encontrada</h2>
        <p>A promoção que você está procurando não existe ou foi desativada.</p>
      </div>
    );
  }

  const whatsappLink = landingPage.whatsappNumber
    ? `https://wa.me/${landingPage.whatsappNumber}?text=${encodeURIComponent(landingPage.whatsappMessage || 'Olá! Vim pela Landing Page.')}`
    : '#';

  return (
    <div className="landing-page-container">
      <Seo 
        title={landingPage.title} 
        description={landingPage.heroSubtitle || 'Aproveite nossa promoção especial.'} 
        imageUrl={landingPage.heroBannerUrl} 
      />

      {/* Hero Section */}
      <div 
        className="landing-hero"
        style={landingPage.heroBannerUrl ? { backgroundImage: `url(${landingPage.heroBannerUrl})` } : {}}
      >
        <div className="landing-hero-overlay" />
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
            >
              💬 {landingPage.ctaText || 'Garantir Oferta no WhatsApp'}
            </a>
          )}
        </div>
      </div>

      {/* Conteúdo Dinâmico / Seções */}
      {landingPage.sections && landingPage.sections.length > 0 && (
        <div className="landing-sections">
          {landingPage.sections.map((section: LandingPageSection, index: number) => {
            const content = section.content as { title?: string; text?: string; content?: string };
            return (
              <div key={section.id || index} className="landing-section-card">
                {content.title && <h3 className="landing-section-title">{content.title}</h3>}
                <p className="landing-section-text">{content.text || content.content || ''}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}