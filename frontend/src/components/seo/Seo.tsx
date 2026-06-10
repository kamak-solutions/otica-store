import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  imageUrl?: string;
};

function getOrCreateMetaByName(name: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }

  return meta;
}

function getOrCreateMetaByProperty(property: string) {
  let meta = document.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`,
  );

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }

  return meta;
}

export function Seo({ title, description, imageUrl }: SeoProps) {
  useEffect(() => {
    const currentUrl = window.location.href;
    const finalImageUrl =
      imageUrl ?? "https://oticashowroom.com.br/og-image.png";

    document.title = title;

    getOrCreateMetaByName("description").content = description;

    getOrCreateMetaByProperty("og:title").content = title;
    getOrCreateMetaByProperty("og:description").content = description;
    getOrCreateMetaByProperty("og:url").content = currentUrl;
    getOrCreateMetaByProperty("og:image").content = finalImageUrl;

    getOrCreateMetaByName("twitter:title").content = title;
    getOrCreateMetaByName("twitter:description").content = description;
    getOrCreateMetaByName("twitter:image").content = finalImageUrl;
    getOrCreateMetaByName("twitter:card").content = "summary_large_image";
  }, [title, description, imageUrl]);

  return null;
}
