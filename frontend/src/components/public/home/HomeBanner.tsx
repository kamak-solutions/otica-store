import type { StorefrontBanner } from "../../../services/storefront.service";

type HomeBannerProps = {
  banner?: StorefrontBanner;
};

const fallbackBanner = {
  kicker: "Vitrine da semana",
  title: "Armações, solares e lentes com atendimento personalizado",
  description:
    "Escolha seu produto, envie sua receita se precisar e receba uma orientação mais segura para comprar melhor.",
  buttonLabel: "Ver produtos",
  buttonHref: "#modelos",
  imageUrl: null,
  imagePosition: "center",
  active: true,
};

export function HomeBanner({ banner }: HomeBannerProps) {
  const content = banner ?? fallbackBanner;

  if (!content.active) {
    return null;
  }

  return (
    <section className="site-container home-banner storefront-banner-with-image">
      {content.imageUrl && (
        <img
          className="storefront-banner-image"
          src={content.imageUrl}
          alt={content.title}
          style={{ objectPosition: content.imagePosition ?? "center" }}
        />
      )}

      <div className="storefront-banner-content">
        <span>{content.kicker}</span>
        <h2>{content.title}</h2>
        <p>{content.description}</p>
      </div>

      <a className="button-primary" href={content.buttonHref}>
        {content.buttonLabel}
      </a>
    </section>
  );
}
