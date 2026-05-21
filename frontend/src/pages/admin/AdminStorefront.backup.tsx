import { useEffect, useState } from "react";
import { uploadStorefrontImage } from "../../services/admin-uploads.service";
import {
  createAdminHeroSlide,
  deleteAdminHeroSlide,
  listAdminBanners,
  listAdminHeroSlides,
  updateAdminBanner,
  updateAdminHeroSlide,
  type UpdateStorefrontBannerPayload,
  type UpdateStorefrontHeroSlidePayload,
} from "../../services/admin-storefront.service";
import type {
  StorefrontBanner,
  StorefrontHeroSlide,
} from "../../services/storefront.service";

type SlideFormData = {
  kicker: string;
  title: string;
  description: string;
  imageUrl: string;
  primaryAction: string;
  secondaryAction: string;
  position: string;
  active: boolean;
};
type BannerFormData = {
  kicker: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  imageUrl: string;
  active: boolean;
};

const bannerLabels: Record<string, string> = {
  home_banner: "Banner principal da home",
  campaign_banner: "Banner de campanha",
  quote_banner: "Banner de orçamento",
};
const emptySlideFormData: SlideFormData = {
  kicker: "",
  title: "",
  description: "",
  imageUrl: "",
  primaryAction: "",
  secondaryAction: "",
  position: "0",
  active: true,
};

function createFormDataFromSlide(slide: StorefrontHeroSlide): SlideFormData {
  return {
    kicker: slide.kicker,
    title: slide.title,
    description: slide.description,
    imageUrl: slide.imageUrl,
    primaryAction: slide.primaryAction,
    secondaryAction: slide.secondaryAction,
    position: String(slide.position),
    active: slide.active,
  };
}
function createFormDataFromBanner(banner: StorefrontBanner): BannerFormData {
  return {
    kicker: banner.kicker,
    title: banner.title,
    description: banner.description,
    buttonLabel: banner.buttonLabel,
    buttonHref: banner.buttonHref,
    imageUrl: banner.imageUrl ?? "",
    active: banner.active,
  };
}

export function AdminStorefront() {
  const [slides, setSlides] = useState<StorefrontHeroSlide[]>([]);
  const [forms, setForms] = useState<Record<string, SlideFormData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingSlideId, setSavingSlideId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newSlideForm, setNewSlideForm] =
    useState<SlideFormData>(emptySlideFormData);
  const [isCreatingSlide, setIsCreatingSlide] = useState(false);
  const [uploadingImageFor, setUploadingImageFor] = useState("");
  const [banners, setBanners] = useState<StorefrontBanner[]>([]);
  const [bannerForms, setBannerForms] = useState<
    Record<string, BannerFormData>
  >({});
  const [savingBannerId, setSavingBannerId] = useState("");
  const [openSection, setOpenSection] = useState<
    "banners" | "new-slide" | "slides"
  >("banners");

  async function loadSlides() {
    try {
      setErrorMessage("");

      const response = await listAdminHeroSlides();

      setSlides(response.data);

      const nextForms = response.data.reduce<Record<string, SlideFormData>>(
        (accumulator, slide) => {
          accumulator[slide.id] = createFormDataFromSlide(slide);
          return accumulator;
        },
        {},
      );

      setForms(nextForms);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao carregar vitrine.",
      );
    } finally {
      setIsLoading(false);
    }
  }

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

      setBannerForms(nextForms);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao carregar banners.",
      );
    }
  }
  useEffect(() => {
    loadSlides();
    loadBanners();
  }, []);
  function updateFormField(
    slideId: string,
    field: keyof SlideFormData,
    value: string | boolean,
  ) {
    setForms((currentForms) => ({
      ...currentForms,
      [slideId]: {
        ...currentForms[slideId],
        [field]: value,
      },
    }));
  }
  function updateNewSlideField(
    field: keyof SlideFormData,
    value: string | boolean,
  ) {
    setNewSlideForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }
  async function handleUploadImage(
    target: "new" | string,
    file: File | undefined,
  ) {
    if (!file) {
      return;
    }

    try {
      setUploadingImageFor(target);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await uploadStorefrontImage(file);
      if (target === "new") {
        setNewSlideForm((currentForm) => ({
          ...currentForm,
          imageUrl: response.data.url,
        }));
      } else if (target.startsWith("banner:")) {
        const bannerId = target.replace("banner:", "");

        updateBannerFormField(bannerId, "imageUrl", response.data.url);
      } else {
        updateFormField(target, "imageUrl", response.data.url);
      }

      setSuccessMessage("Imagem enviada com sucesso.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao enviar imagem.",
      );
    } finally {
      setUploadingImageFor("");
    }
  }
  async function handleCreateSlide(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: UpdateStorefrontHeroSlidePayload = {
      kicker: newSlideForm.kicker,
      title: newSlideForm.title,
      description: newSlideForm.description,
      imageUrl: newSlideForm.imageUrl,
      primaryAction: newSlideForm.primaryAction,
      secondaryAction: newSlideForm.secondaryAction,
      position: Number(newSlideForm.position),
      active: newSlideForm.active,
    };

    try {
      setIsCreatingSlide(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await createAdminHeroSlide(payload);

      setSlides((currentSlides) =>
        [...currentSlides, response.data].sort(
          (firstSlide, secondSlide) =>
            firstSlide.position - secondSlide.position,
        ),
      );

      setForms((currentForms) => ({
        ...currentForms,
        [response.data.id]: createFormDataFromSlide(response.data),
      }));

      setNewSlideForm(emptySlideFormData);
      setSuccessMessage("Novo slide criado com sucesso.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao criar slide.",
      );
    } finally {
      setIsCreatingSlide(false);
    }
  }
  async function handleToggleSlideActive(slide: StorefrontHeroSlide) {
    const formData = forms[slide.id];

    if (!formData) {
      return;
    }

    const nextActive = !formData.active;

    const payload: UpdateStorefrontHeroSlidePayload = {
      kicker: formData.kicker,
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      primaryAction: formData.primaryAction,
      secondaryAction: formData.secondaryAction,
      position: Number(formData.position),
      active: nextActive,
    };

    try {
      setSavingSlideId(slide.id);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await updateAdminHeroSlide(slide.id, payload);

      setSlides((currentSlides) =>
        currentSlides
          .map((currentSlide) =>
            currentSlide.id === slide.id ? response.data : currentSlide,
          )
          .sort(
            (firstSlide, secondSlide) =>
              firstSlide.position - secondSlide.position,
          ),
      );

      setForms((currentForms) => ({
        ...currentForms,
        [slide.id]: createFormDataFromSlide(response.data),
      }));

      setSuccessMessage(
        nextActive
          ? "Slide ativado com sucesso."
          : "Slide desativado com sucesso.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao alterar status do slide.",
      );
    } finally {
      setSavingSlideId("");
    }
  }
  async function handleDeleteSlide(slide: StorefrontHeroSlide) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o slide "${slide.title}"? Essa ação não pode ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setSavingSlideId(slide.id);
      setErrorMessage("");
      setSuccessMessage("");

      await deleteAdminHeroSlide(slide.id);

      setSlides((currentSlides) =>
        currentSlides.filter((currentSlide) => currentSlide.id !== slide.id),
      );

      setForms((currentForms) => {
        const nextForms = { ...currentForms };
        delete nextForms[slide.id];
        return nextForms;
      });

      setSuccessMessage("Slide excluído com sucesso.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao excluir slide.",
      );
    } finally {
      setSavingSlideId("");
    }
  }
  function updateBannerFormField(
    bannerId: string,
    field: keyof BannerFormData,
    value: string | boolean,
  ) {
    setBannerForms((currentForms) => ({
      ...currentForms,
      [bannerId]: {
        ...currentForms[bannerId],
        [field]: value,
      },
    }));
  }
  async function handleSaveBanner(banner: StorefrontBanner) {
    const formData = bannerForms[banner.id];

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

      setBannerForms((currentForms) => ({
        ...currentForms,
        [banner.id]: createFormDataFromBanner(response.data),
      }));

      setSuccessMessage("Banner da vitrine atualizado com sucesso.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao salvar banner.",
      );
    } finally {
      setSavingBannerId("");
    }
  }
  async function handleSaveSlide(slide: StorefrontHeroSlide) {
    const formData = forms[slide.id];

    if (!formData) {
      return;
    }

    const payload: UpdateStorefrontHeroSlidePayload = {
      kicker: formData.kicker,
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      primaryAction: formData.primaryAction,
      secondaryAction: formData.secondaryAction,
      position: Number(formData.position),
      active: formData.active,
    };

    try {
      setSavingSlideId(slide.id);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await updateAdminHeroSlide(slide.id, payload);

      setSlides((currentSlides) =>
        currentSlides
          .map((currentSlide) =>
            currentSlide.id === slide.id ? response.data : currentSlide,
          )
          .sort(
            (firstSlide, secondSlide) =>
              firstSlide.position - secondSlide.position,
          ),
      );

      setForms((currentForms) => ({
        ...currentForms,
        [slide.id]: createFormDataFromSlide(response.data),
      }));

      setSuccessMessage("Slide da vitrine atualizado com sucesso.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao salvar slide da vitrine.",
      );
    } finally {
      setSavingSlideId("");
    }
  }
  function toggleSection(section: "banners" | "new-slide" | "slides") {
    setOpenSection((currentSection) =>
      currentSection === section ? "banners" : section,
    );
  }
  function renderSectionButton(
    section: "banners" | "new-slide" | "slides",
    title: string,
    description: string,
  ) {
    const isOpen = openSection === section;

    return (
      <button
        type="button"
        className={`admin-storefront-accordion-button ${isOpen ? "active" : ""}`}
        onClick={() => toggleSection(section)}
      >
        <div>
          <strong>{title}</strong>
          <span>{description}</span>
        </div>

        <span>{isOpen ? "−" : "+"}</span>
      </button>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>
          <h1>Vitrine</h1>
          <p>
            Edite os banners principais da home sem precisar alterar código.
          </p>
        </div>

        <button type="button" onClick={loadSlides}>
          Atualizar
        </button>
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
        <p className="admin-state-message">Carregando vitrine...</p>
      )}

      {!isLoading && slides.length === 0 && (
        <p className="admin-state-message">Nenhum slide encontrado.</p>
      )}

      {renderSectionButton(
        "banners",
        "Banners secundários",
        "Edite as chamadas da home, campanha e orçamento.",
      )}

      {openSection === "banners" && (
        <>
          {
            /* aqui fica todo o bloco dos banners secundários */

            <div id="banners-secundarios" className="admin-storefront-section-heading">
              <span>Home</span>
              <h2>Banners secundários</h2>
              <p>Edite as chamadas da home, campanha e orçamento.</p>
            </div>
          }
        </>
      )}

      <div className="admin-storefront-list">
        {banners.map((banner) => {
          const formData = bannerForms[banner.id];

          if (!formData) {
            return null;
          }

          return (
            <article className="admin-storefront-card" key={banner.id}>
              <div className="admin-storefront-banner-preview">
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt={formData.title} />
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
                  Link do botão
                  <input
                    type="text"
                    value={formData.buttonHref}
                    onChange={(event) =>
                      updateBannerFormField(
                        banner.id,
                        "buttonHref",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label>
                  Chamada
                  <input
                    type="text"
                    value={formData.kicker}
                    onChange={(event) =>
                      updateBannerFormField(
                        banner.id,
                        "kicker",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label>
                  Texto do botão
                  <input
                    type="text"
                    value={formData.buttonLabel}
                    onChange={(event) =>
                      updateBannerFormField(
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
                      updateBannerFormField(
                        banner.id,
                        "title",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="admin-storefront-full">
                  Descrição
                  <textarea
                    value={formData.description}
                    onChange={(event) =>
                      updateBannerFormField(
                        banner.id,
                        "description",
                        event.target.value,
                      )
                    }
                  />
                </label>
                <label className="admin-storefront-full">
                  URL da imagem
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(event) =>
                      updateBannerFormField(
                        banner.id,
                        "imageUrl",
                        event.target.value,
                      )
                    }
                    placeholder="Opcional: URL da imagem do banner"
                  />
                </label>

                <label className="admin-storefront-full">
                  Enviar imagem
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploadingImageFor === `banner:${banner.id}`}
                    onChange={(event) =>
                      handleUploadImage(
                        `banner:${banner.id}`,
                        event.target.files?.[0],
                      )
                    }
                  />
                </label>

                <label className="admin-storefront-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(event) =>
                      updateBannerFormField(
                        banner.id,
                        "active",
                        event.target.checked,
                      )
                    }
                  />
                  Banner ativo
                </label>
              </div>

              <div className="admin-storefront-actions">
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

      {renderSectionButton(
        "new-slide",
        "Novo slide",
        "Crie um novo banner principal para a home.",
      )}

      {openSection === "new-slide" && (
        <>
          {
            /* aqui fica o formulário Novo slide */

            <div id="slides-principais" className="admin-storefront-section-heading">
              <span>Hero</span>
              <h2>Slides principais</h2>
              <p>Gerencie os banners grandes do topo da home.</p>
            </div>
          }
        </>
      )}
      <div className="admin-storefront-list">
        {slides.map((slide) => {
          const formData = forms[slide.id];

          if (!formData) {
            return null;
          }

          return (
            <article className="admin-storefront-card" key={slide.id}>
              <div className="admin-storefront-preview">
                <img src={formData.imageUrl} alt={formData.title} />

                <div>
                  <span>{formData.kicker}</span>
                  <strong>{formData.title}</strong>
                  <p>{formData.description}</p>
                </div>
              </div>

              <div className="admin-storefront-form-grid">
                <label>
                  Chamada
                  <input
                    type="text"
                    value={formData.kicker}
                    onChange={(event) =>
                      updateFormField(slide.id, "kicker", event.target.value)
                    }
                  />
                </label>

                <label>
                  Posição
                  <input
                    type="number"
                    min="0"
                    value={formData.position}
                    onChange={(event) =>
                      updateFormField(slide.id, "position", event.target.value)
                    }
                  />
                </label>

                <label className="admin-storefront-full">
                  Título
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(event) =>
                      updateFormField(slide.id, "title", event.target.value)
                    }
                  />
                </label>

                <label className="admin-storefront-full">
                  Descrição
                  <textarea
                    value={formData.description}
                    onChange={(event) =>
                      updateFormField(
                        slide.id,
                        "description",
                        event.target.value,
                      )
                    }
                  />
                </label>
                <label className="admin-storefront-full">
                  URL da imagem
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(event) =>
                      updateFormField(slide.id, "imageUrl", event.target.value)
                    }
                  />
                </label>

                <label className="admin-storefront-full">
                  Enviar nova imagem
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploadingImageFor === slide.id}
                    onChange={(event) =>
                      handleUploadImage(slide.id, event.target.files?.[0])
                    }
                  />
                </label>

                <label>
                  Botão principal
                  <input
                    type="text"
                    value={formData.primaryAction}
                    onChange={(event) =>
                      updateFormField(
                        slide.id,
                        "primaryAction",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label>
                  Botão secundário
                  <input
                    type="text"
                    value={formData.secondaryAction}
                    onChange={(event) =>
                      updateFormField(
                        slide.id,
                        "secondaryAction",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="admin-storefront-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(event) =>
                      updateFormField(slide.id, "active", event.target.checked)
                    }
                  />
                  Slide ativo
                </label>
              </div>

              <div className="admin-storefront-actions">
                <button
                  type="button"
                  className="admin-storefront-secondary-action"
                  disabled={savingSlideId === slide.id}
                  onClick={() => handleToggleSlideActive(slide)}
                >
                  {formData.active ? "Desativar slide" : "Ativar slide"}
                </button>
                <button
                  type="button"
                  className="admin-storefront-danger-action"
                  disabled={savingSlideId === slide.id}
                  onClick={() => handleDeleteSlide(slide)}
                >
                  Excluir slide
                </button>

                <button
                  type="button"
                  disabled={savingSlideId === slide.id}
                  onClick={() => handleSaveSlide(slide)}
                >
                  {savingSlideId === slide.id ? "Salvando..." : "Salvar slide"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {renderSectionButton(
        "new-slide",
        "Novo slide",
        "Crie um novo banner principal para a home.",
      )}

      {openSection === "new-slide" && (
        <>
          {
            /* aqui fica o formulário Novo slide */
            <form
              className="admin-storefront-card"
              onSubmit={handleCreateSlide}
            >
              <h2>Novo slide</h2>

              <div className="admin-storefront-form-grid">
                <label>
                  Chamada
                  <input
                    type="text"
                    value={newSlideForm.kicker}
                    onChange={(event) =>
                      updateNewSlideField("kicker", event.target.value)
                    }
                    required
                  />
                </label>

                <label>
                  Posição
                  <input
                    type="number"
                    min="0"
                    value={newSlideForm.position}
                    onChange={(event) =>
                      updateNewSlideField("position", event.target.value)
                    }
                    required
                  />
                </label>

                <label className="admin-storefront-full">
                  Título
                  <input
                    type="text"
                    value={newSlideForm.title}
                    onChange={(event) =>
                      updateNewSlideField("title", event.target.value)
                    }
                    required
                  />
                </label>

                <label className="admin-storefront-full">
                  Descrição
                  <textarea
                    value={newSlideForm.description}
                    onChange={(event) =>
                      updateNewSlideField("description", event.target.value)
                    }
                    required
                  />
                </label>

                <label className="admin-storefront-full">
                  URL da imagem
                  <input
                    type="url"
                    value={newSlideForm.imageUrl}
                    onChange={(event) =>
                      updateNewSlideField("imageUrl", event.target.value)
                    }
                    required
                  />
                </label>
                <label className="admin-storefront-full">
                  Enviar imagem
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploadingImageFor === "new"}
                    onChange={(event) =>
                      handleUploadImage("new", event.target.files?.[0])
                    }
                  />
                </label>

                <label>
                  Botão principal
                  <input
                    type="text"
                    value={newSlideForm.primaryAction}
                    onChange={(event) =>
                      updateNewSlideField("primaryAction", event.target.value)
                    }
                    required
                  />
                </label>

                <label>
                  Botão secundário
                  <input
                    type="text"
                    value={newSlideForm.secondaryAction}
                    onChange={(event) =>
                      updateNewSlideField("secondaryAction", event.target.value)
                    }
                    required
                  />
                </label>

                <label className="admin-storefront-checkbox">
                  <input
                    type="checkbox"
                    checked={newSlideForm.active}
                    onChange={(event) =>
                      updateNewSlideField("active", event.target.checked)
                    }
                  />
                  Slide ativo
                </label>
              </div>

              <div className="admin-storefront-actions">
                <button type="submit" disabled={isCreatingSlide}>
                  {isCreatingSlide ? "Criando..." : "Criar novo slide"}
                </button>
              </div>
            </form>
          }
        </>
      )}
    </section>
  );
}
