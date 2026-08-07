import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { landingPagesService, type LandingPage } from '../../services/landing-pages.service';

export function LandingPageDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    async function fetchLandingPage() {
      try {
        const data = await landingPagesService.getBySlug(slug!);
        if (isMounted) {
          setPage(data);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError('Página não encontrada.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchLandingPage();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-gray-600">{error || 'Página não encontrada'}</p>
      </div>
    );
  }

  const whatsappLink = page.whatsappNumber
    ? `https://wa.me/${page.whatsappNumber}?text=${encodeURIComponent(
        page.whatsappMessage || 'Olá! Gostaria de mais informações.'
      )}`
    : null;

  return (
    <div
      style={{
        backgroundColor: page.backgroundColor || '#0F0F0F',
        color: page.textColor || '#FFFFFF',
        fontFamily: page.fontFamily || 'sans-serif',
      }}
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
          style={{ color: page.primaryColor || '#D4AF37' }}
        >
          {page.heroTitle || page.title}
        </h1>

        {page.heroSubtitle && (
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            {page.heroSubtitle}
          </p>
        )}

        {page.heroBannerUrl && (
          <div className="mt-8">
            <img
              src={page.heroBannerUrl}
              alt={page.title}
              className="rounded-lg shadow-2xl mx-auto max-h-96 object-cover"
            />
          </div>
        )}

        {whatsappLink && (
          <div className="mt-10">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 text-lg font-medium rounded-md text-black transition-transform transform hover:scale-105"
              style={{ backgroundColor: page.primaryColor || '#D4AF37' }}
            >
              {page.ctaText || 'Faça seu orçamento online'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}