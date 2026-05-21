import type { StorefrontBanner } from "../../../services/storefront.service";

type CampaignBannerProps = {
  banner?: StorefrontBanner;
};

const fallbackBanner = {
  kicker: "Campanha do mês",
  title: "Varilux em dobro",
  description:
    "Consulte condições especiais para lentes Varilux e monte seu orçamento com atendimento personalizado.",
  buttonLabel: "Quero orçamento",
  buttonHref: "#receita",
  imageUrl: null,
  imagePosition: "center",
  active: true,
};
export function CampaignBanner({ banner }: CampaignBannerProps) {
  const content = banner ?? fallbackBanner;

  if (!content.active) {
    return null;
  }

  return (
    <section className="site-container campaign-banner storefront-banner-with-image">
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
