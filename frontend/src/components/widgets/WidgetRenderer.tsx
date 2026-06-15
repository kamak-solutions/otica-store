import type { Widget } from "../../services/widget.service";

type Props = {
  widget: Widget;
};

export function WidgetRenderer({ widget }: Props) {
  function openLink() {
    window.open(widget.redirectUrl, "_blank");
  }

  return (
    <div className="widget-card">
      {widget.title && <h3>{widget.title}</h3>}

      {widget.description && <p>{widget.description}</p>}

      {widget.type === "IMAGE" && widget.mediaUrl && (
        <img
          className="widget-media"
          src={widget.mediaUrl}
          alt={widget.title ?? ""}
        />
      )}

      {widget.type === "VIDEO" && widget.mediaUrl && (
        <video className="widget-media" controls src={widget.mediaUrl} />
      )}

      {widget.type === "EMBED" && widget.embedCode && (
        <div
          className="widget-media"
          dangerouslySetInnerHTML={{
            __html: widget.embedCode,
          }}
        />
      )}

      {widget.buttonLabel && (
        <button className="button-primary" onClick={openLink}>
          {widget.buttonLabel}
        </button>
      )}
    </div>
  );
}
