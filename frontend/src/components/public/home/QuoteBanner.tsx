import { Link } from "react-router-dom";
import type { StorefrontBanner } from "../../../services/storefront.service";

type QuoteBannerProps = {
  banner?: StorefrontBanner;
};

const fallbackBanner = {
  kicker: "Receita e lentes",
  title: "Tem receita? Envie para fazermos seu orçamento",
  description:
    "Ideal para lentes de grau, multifocais, antirreflexo, blue cut ou opções específicas para sua rotina.",
  buttonLabel: "Solicitar orçamento",
  buttonHref: "/orcamento",
  imageUrl: null,
  imagePosition: "center",
  active: true,
};

function isInternalRoute(href: string) {
  return href.startsWith("/");
}

export function QuoteBanner({ banner }: QuoteBannerProps) {
  const content = banner ?? fallbackBanner;

  if (!content.active) {
    return null;
  }

  return (
    <section
      className="site-container quote-banner storefront-banner-with-image"
      id="receita"
    >
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

      {isInternalRoute(content.buttonHref) ? (
        <Link className="button-primary" to={content.buttonHref}>
          {content.buttonLabel}
        </Link>
      ) : (
        <a className="button-primary" href={content.buttonHref}>
          {content.buttonLabel}
        </a>
      )}
    </section>
  );
}
