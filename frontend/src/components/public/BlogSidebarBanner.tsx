import { Link } from "react-router-dom";

type Props = {
  title: string;
  description?: string | null;

  type: "IMAGE" | "VIDEO" | "HTML";

  mediaUrl?: string | null;

  redirectUrl?: string | null;

  buttonLabel?: string | null;

  aspectRatio?: string;
};

export function BlogSidebarBanner({
  title,
  description,
  type,
  mediaUrl,
  redirectUrl,
  buttonLabel,
  aspectRatio,
}: Props) {
  const isVertical = aspectRatio === "9:16";

  const finalAspectRatio =
    aspectRatio === "9:16"
      ? "9 / 16"
      : aspectRatio === "1:1"
        ? "1 / 1"
        : "16 / 9";

  return (
    <div className="blog-widget">
      <div
        className={`blog-widget-media ${
          isVertical ? "widget-vertical" : ""
        }`}
        style={{
          aspectRatio: finalAspectRatio,
        }}
      >
        {type === "IMAGE" && mediaUrl && (
          <img
            src={mediaUrl}
            alt={title}
            className="widget-media-content"
          />
        )}

        {type === "VIDEO" && mediaUrl && (
          <video
            src={mediaUrl}
            controls
            playsInline
            className="widget-media-content"
          />
        )}
      </div>

      <div className="blog-widget-content">
        <h3>{title}</h3>

        {description && <p>{description}</p>}

        {redirectUrl && (
          <Link className="button-primary" to={redirectUrl}>
            {buttonLabel ?? "Saiba mais"}
          </Link>
        )}
      </div>
    </div>
  );
}