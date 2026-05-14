import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
};

function getOrCreateMetaDescription() {
  let meta = document.querySelector<HTMLMetaElement>(
    'meta[name="description"]',
  );

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }

  return meta;
}

export function Seo({ title, description }: SeoProps) {
  useEffect(() => {
    document.title = title;

    const metaDescription = getOrCreateMetaDescription();
    metaDescription.content = description;
  }, [title, description]);

  return null;
}
