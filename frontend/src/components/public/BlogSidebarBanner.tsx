import { Link } from "react-router-dom";

type Props = {
  title: string;
  description?: string | null;

  type: "IMAGE" | "VIDEO" | "EMBED" | "HTML";

  mediaUrl?: string | null;
  embedCode?: string | null;

  redirectUrl?: string | null;

  buttonLabel?: string | null;

  aspectRatio?: string;
};

export function BlogSidebarBanner({
  title,
  description,
  type,
  mediaUrl,
  embedCode,
  redirectUrl,
  buttonLabel,
  aspectRatio,
}: Props) {

  return (
    <div className="blog-widget">

      <div
        className={`blog-widget-media ${aspectRatio ?? "16-9"}`}
      >

        {type === "IMAGE" && mediaUrl && (
          <img
            src={mediaUrl}
            alt={title}
          />
        )}


        {type === "VIDEO" && mediaUrl && (
          <video
            src={mediaUrl}
            controls
          />
        )}


        {type === "EMBED" && embedCode && (
          <div
            className="blog-widget-embed"
            dangerouslySetInnerHTML={{
              __html: embedCode,
            }}
          />
        )}


        {type === "HTML" && embedCode && (
          <div
            dangerouslySetInnerHTML={{
              __html: embedCode,
            }}
          />
        )}

      </div>


      <h3>
        {title}
      </h3>


      {description && (
        <p>
          {description}
        </p>
      )}



      {redirectUrl && (
        <Link
          className="button-primary"
          to={redirectUrl}
        >
          {buttonLabel ?? "Saiba mais"}
        </Link>
      )}

    </div>
  );
}