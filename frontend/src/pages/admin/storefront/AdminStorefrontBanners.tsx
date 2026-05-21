import { useEffect, useState } from "react";
import { uploadStorefrontImage } from "../../../services/admin-uploads.service";
import {
  listAdminBanners,
  updateAdminBanner,
  type UpdateStorefrontBannerPayload,
} from "../../../services/admin-storefront.service";
import type { StorefrontBanner } from "../../../services/storefront.service";

type BannerFormData = {
  kicker: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  imageUrl: string;
  imagePosition: string;
  active: boolean;
};

const imagePositionOptions = [
  { label: "Centro", value: "center" },
  { label: "Topo", value: "top" },
  { label: "Base", value: "bottom" },
  { label: "Esquerda", value: "left" },
  { label: "Direita", value: "right" },
  { label: "Centro superior", value: "center top" },
  { label: "Centro inferior", value: "center bottom" },
];

const bannerLabels: Record<string, string> = {
  home_banner: "Banner principal da home",
  campaign_banner: "Banner de campanha",
  quote_banner: "Banner de orçamento",
};

const linkSuggestions = [
  { label: "Modelos / produtos", value: "#modelos" },
  { label: "Categorias", value: "#categorias" },
  { label: "Orçamento / receita", value: "#receita" },
  { label: "Página de orçamento", value: "/orcamento" },
  { label: "Armações", value: "/armacoes" },
  { label: "Lentes", value: "/lentes" },
  { label: "Blog", value: "/blog" },
];

function createFormDataFromBanner(banner: StorefrontBanner): BannerFormData {
  return {
    kicker: banner.kicker,
    title: banner.title,
    description: banner.description,
    buttonLabel: banner.buttonLabel,
    buttonHref: banner.buttonHref,
    imageUrl: banner.imageUrl ?? "",
    imagePosition: banner.imagePosition ?? "center",
    active: banner.active,
  };
}

export function AdminStorefrontBanners() {
  const [banners, setBanners] = useState<StorefrontBanner[]>([]);
  const [forms, setForms] = useState<Record<string, BannerFormData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingBannerId, setSavingBannerId] = useState("");
  const [uploadingBannerId, setUploadingBannerId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadBanners() {
    try {
      setErrorMessage("");

      const response = await listAdminBanners();

      setBanners(response.data);

      const nextForms = response.data.reduce<Record<string, BannerFormData>>(
        (accumulator, banner) => {
          accumulator[banner.id] = createFormDataFromBanner(banner);
          return accumulator;
        },
        {},
      );

      setForms(nextForms);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao carregar banners.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBanners();
  }, []);

  function updateFormField(
    bannerId: string,
    field: keyof BannerFormData,
    value: string | boolean,
  ) {
    setForms((currentForms) => ({
      ...currentForms,
      [bannerId]: {
        ...currentForms[bannerId],
        [field]: value,
      },
    }));
  }

  async function handleUploadImage(bannerId: string, file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      setUploadingBannerId(bannerId);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await uploadStorefrontImage(file);

      updateFormField(bannerId, "imageUrl", response.data.url);

      setSuccessMessage(
        "Imagem enviada com sucesso. Clique em salvar para aplicar.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao enviar imagem.",
      );
    } finally {
      setUploadingBannerId("");
    }
  }

  async function handleSaveBanner(banner: StorefrontBanner) {
    const formData = forms[banner.id];

    if (!formData) {
      return;
    }

    const payload: UpdateStorefrontBannerPayload = {
      kicker: formData.kicker,
      title: formData.title,
      description: formData.description,
      buttonLabel: formData.buttonLabel,
      buttonHref: formData.buttonHref,
      imageUrl: formData.imageUrl || null,
      imagePosition: formData.imagePosition,
      active: formData.active,
    };

    try {
      setSavingBannerId(banner.id);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await updateAdminBanner(banner.id, payload);

      setBanners((currentBanners) =>
        currentBanners.map((currentBanner) =>
          currentBanner.id === banner.id ? response.data : currentBanner,
        ),
      );

      setForms((currentForms) => ({
        ...currentForms,
        [banner.id]: createFormDataFromBanner(response.data),
      }));

      setSuccessMessage("Banner atualizado com sucesso.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao salvar banner.",
      );
    } finally {
      setSavingBannerId("");
    }
  }

  async function handleToggleBanner(banner: StorefrontBanner) {
    const formData = forms[banner.id];

    if (!formData) {
      return;
    }

    const nextActive = !formData.active;

    updateFormField(banner.id, "active", nextActive);

    try {
      setSavingBannerId(banner.id);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await updateAdminBanner(banner.id, {
        active: nextActive,
      });

      setBanners((currentBanners) =>
        currentBanners.map((currentBanner) =>
          currentBanner.id === banner.id ? response.data : currentBanner,
        ),
      );

      setForms((currentForms) => ({
        ...currentForms,
        [banner.id]: createFormDataFromBanner(response.data),
      }));

      setSuccessMessage(
        nextActive
          ? "Banner ativado com sucesso."
          : "Banner desativado com sucesso.",
      );
    } catch (error) {
      updateFormField(banner.id, "active", formData.active);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao alterar status do banner.",
      );
    } finally {
      setSavingBannerId("");
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Vitrine</span>
          <h1>Banners secundários</h1>
          <p>Edite as chamadas da home, campanha e orçamento.</p>
        </div>

        <button type="button" onClick={loadBanners}>
          Atualizar
        </button>
      </div>

      <div className="admin-storefront-help-card">
        <strong>Dica de links</strong>
        <p>
          Use links internos como <code>#modelos</code>,{" "}
          <code>#categorias</code>, <code>#receita</code>,{" "}
          <code>/orcamento</code>, <code>/blog</code>.
        </p>
      </div>

      {errorMessage && (
        <p className="admin-state-message admin-error-message">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p className="admin-state-message admin-success-message">
          {successMessage}
        </p>
      )}

      {isLoading && (
        <p className="admin-state-message">Carregando banners...</p>
      )}

      <div className="admin-storefront-list">
        {banners.map((banner) => {
          const formData = forms[banner.id];

          if (!formData) {
            return null;
          }

          return (
            <article className="admin-storefront-card" key={banner.id}>
              <div className="admin-storefront-banner-preview">
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt={formData.title}
                    style={{ objectPosition: formData.imagePosition }}
                  />
                )}

                <div>
                  <span>{formData.kicker}</span>
                  <strong>{formData.title}</strong>
                  <p>{formData.description}</p>
                  <small>{formData.buttonLabel}</small>
                </div>
              </div>

              <div className="admin-storefront-form-grid">
                <label>
                  Tipo
                  <input
                    type="text"
                    value={bannerLabels[banner.key] ?? banner.key}
                    disabled
                  />
                </label>

                <label>
                  Status
                  <input
                    type="text"
                    value={formData.active ? "Ativo" : "Inativo"}
                    disabled
                  />
                </label>

                <label>
                  Chamada
                  <input
                    type="text"
                    value={formData.kicker}
                    onChange={(event) =>
                      updateFormField(banner.id, "kicker", event.target.value)
                    }
                  />
                </label>

                <label>
                  Texto do botão
                  <input
                    type="text"
                    value={formData.buttonLabel}
                    onChange={(event) =>
                      updateFormField(
                        banner.id,
                        "buttonLabel",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="admin-storefront-full">
                  Título
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(event) =>
                      updateFormField(banner.id, "title", event.target.value)
                    }
                  />
                </label>

                <label className="admin-storefront-full">
                  Descrição
                  <textarea
                    value={formData.description}
                    onChange={(event) =>
                      updateFormField(
                        banner.id,
                        "description",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label>
                  Link do botão
                  <input
                    type="text"
                    value={formData.buttonHref}
                    onChange={(event) =>
                      updateFormField(
                        banner.id,
                        "buttonHref",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label>
                  Sugestões de link
                  <select
                    value=""
                    onChange={(event) => {
                      if (event.target.value) {
                        updateFormField(
                          banner.id,
                          "buttonHref",
                          event.target.value,
                        );
                      }
                    }}
                  >
                    <option value="">Selecionar destino</option>
                    {linkSuggestions.map((suggestion) => (
                      <option key={suggestion.value} value={suggestion.value}>
                        {suggestion.label} — {suggestion.value}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-storefront-full">
                  URL da imagem
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(event) =>
                      updateFormField(banner.id, "imageUrl", event.target.value)
                    }
                    placeholder="Opcional: URL da imagem do banner"
                  />
                </label>

                <label className="admin-storefront-full">
                  Enviar imagem
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploadingBannerId === banner.id}
                    onChange={(event) =>
                      handleUploadImage(banner.id, event.target.files?.[0])
                    }
                  />
                </label>
                <label>
                  Posição da imagem
                  <select
                    value={formData.imagePosition}
                    onChange={(event) =>
                      updateFormField(
                        banner.id,
                        "imagePosition",
                        event.target.value,
                      )
                    }
                  >
                    {imagePositionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-storefront-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(event) =>
                      updateFormField(banner.id, "active", event.target.checked)
                    }
                  />
                  Banner ativo
                </label>
              </div>

              <div className="admin-storefront-actions">
                <button
                  type="button"
                  className="admin-storefront-secondary-action"
                  disabled={savingBannerId === banner.id}
                  onClick={() => handleToggleBanner(banner)}
                >
                  {formData.active ? "Desativar banner" : "Ativar banner"}
                </button>

                <button
                  type="button"
                  disabled={savingBannerId === banner.id}
                  onClick={() => handleSaveBanner(banner)}
                >
                  {savingBannerId === banner.id
                    ? "Salvando..."
                    : "Salvar banner"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
