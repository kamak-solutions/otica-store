import { useState } from "react";

type Props = {
  title: string;
};

export function BlogShare({ title }: Props) {
  const [copied, setCopied] = useState(false);

  const url = window.location.href;


  function shareWhatsApp() {
    const text = `${title}\n\nConfira o artigo:\n${url}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }


  function shareFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  }


  async function copyLink() {
    await navigator.clipboard.writeText(url);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }


  return (
    <div className="blog-share">

      <strong>
        Compartilhar artigo
      </strong>


      <div className="blog-share-buttons">

        <button
          type="button"
          onClick={shareWhatsApp}
        >
          WhatsApp
        </button>


        <button
          type="button"
          onClick={shareFacebook}
        >
          Facebook
        </button>


        <button
          type="button"
          onClick={copyLink}
        >
          {copied ? "Copiado!" : "Copiar link"}
        </button>

      </div>

    </div>
  );
}