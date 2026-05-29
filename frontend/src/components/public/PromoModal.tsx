import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Campaign } from "../../types/campaign";

type PromoModalProps = {
  campaign: Campaign | null;
};

export function PromoModal({
  campaign,
}: PromoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!campaign || !campaign.active) return;

    const storageKey =
      `campaign-${campaign.id}`;

    const alreadySeen =
      localStorage.getItem(storageKey);

    if (
      campaign.showOnlyOnce &&
      alreadySeen
    ) {
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, campaign.showDelay);

    return () => clearTimeout(timer);
  }, [campaign]);

  function closeModal() {
    if (!campaign) return;

    localStorage.setItem(
      `campaign-${campaign.id}`,
      "seen",
    );

    setIsOpen(false);
  }

  if (!campaign || !isOpen) {
    return null;
  }

  return (
    <div
      className="promo-overlay"
      onClick={closeModal}
    >
      <div
        className="promo-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          className="promo-close"
          onClick={closeModal}
        >
          ×
        </button>

        {campaign.imageUrl && (
          <div className="promo-image">
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
            />
          </div>
        )}

        <div className="promo-content">
          <h2>
            {campaign.title}
          </h2>

          <p>
            {campaign.description}
          </p>

          {campaign.buttonLink &&
            campaign.buttonText && (
              <Link
                to={campaign.buttonLink}
                className="promo-button"
              >
                {campaign.buttonText}
              </Link>
          )}
        </div>
      </div>
    </div>
  );
}