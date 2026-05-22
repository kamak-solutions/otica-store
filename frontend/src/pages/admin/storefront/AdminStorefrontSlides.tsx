import { useEffect, useState } from "react";
import { uploadStorefrontImage } from "../../../services/admin-uploads.service";
import {
  createAdminHeroSlide,
  deleteAdminHeroSlide,
  listAdminHeroSlides,
  updateAdminHeroSlide,
  type UpdateStorefrontHeroSlidePayload,
} from "../../../services/admin-storefront.service";
import type { StorefrontHeroSlide } from "../../../services/storefront.service";

type SlideFormData = {
  kicker: string;
  title: string;
  description: string;
  imageUrl: string;
  primaryAction: string;
  primaryActionHref: string;
  secondaryAction: string;
  secondaryActionHref: string;
  position: string;
  active: boolean;
};

const emptySlideFormData: SlideFormData = {
  kicker: "",
  title: "",
  description: "",
  imageUrl: "",
  primaryAction: "",
  primaryActionHref: "/produtos",
  secondaryAction: "",
  secondaryActionHref: "/orcamento",
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
    primaryActionHref: slide.primaryActionHref,
    secondaryAction: slide.secondaryAction,
    secondaryActionHref: slide.secondaryActionHref,
    position: String(slide.position),
    active: slide.active,
  };
}

export function AdminStorefrontSlides() {
  const [slides, setSlides] = useState<StorefrontHeroSlide[]>([]);
  const [formData, setFormData] = useState<SlideFormData>(emptySlideFormData);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadSlides() {
    try {
      setErrorMessage("");

      const response = await listAdminHeroSlides();

      setSlides(
        response.data.sort(
          (firstSlide, secondSlide) =>
            firstSlide.position - secondSlide.position,
        ),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao carregar slides.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSlides();
  }, []);

  function updateFormField(
    field: keyof SlideFormData,
    value: string | boolean,
  ) {
    setFormData((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function handleNewSlide() {
    setEditingSlideId(null);
    setFormData({
      ...emptySlideFormData,
      position: String(slides.length + 1),
    });
    setSuccessMessage("");
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function handleEditSlide(slide: StorefrontHeroSlide) {
    setEditingSlideId(slide.id);
    setFormData(createFormDataFromSlide(slide));
    setSuccessMessage("");
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function handleCancelForm() {
    setEditingSlideId(null);
    setFormData(emptySlideFormData);
    setIsFormOpen(false);
  }

  async function handleUploadImage(file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await uploadStorefrontImage(file);

      setFormData((currentForm) => ({
        ...currentForm,
        imageUrl: response.data.url,
      }));

      setSuccessMessage("Imagem enviada com sucesso.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao enviar imagem.",
      );
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: UpdateStorefrontHeroSlidePayload = {
      kicker: formData.kicker,
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      primaryAction: formData.primaryAction,
      primaryActionHref: formData.primaryActionHref,
      secondaryAction: formData.secondaryAction,
      secondaryActionHref: formData.secondaryActionHref,
      position: Number(formData.position),
      active: formData.active,
    };

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (editingSlideId) {
        const response = await updateAdminHeroSlide(editingSlideId, payload);

        setSlides((currentSlides) =>
          currentSlides
            .map((slide) =>
              slide.id === editingSlideId ? response.data : slide,
            )
            .sort(
              (firstSlide, secondSlide) =>
                firstSlide.position - secondSlide.position,
            ),
        );

        setSuccessMessage("Slide atualizado com sucesso.");
      } else {
        const response = await createAdminHeroSlide(payload);

        setSlides((currentSlides) =>
          [...currentSlides, response.data].sort(
            (firstSlide, secondSlide) =>
              firstSlide.position - secondSlide.position,
          ),
        );

        setSuccessMessage("Slide criado com sucesso.");
      }

      setEditingSlideId(null);
      setFormData(emptySlideFormData);
      setIsFormOpen(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao salvar slide.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleSlide(slide: StorefrontHeroSlide) {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const response = await updateAdminHeroSlide(slide.id, {
        active: !slide.active,
      });

      setSlides((currentSlides) =>
        currentSlides.map((currentSlide) =>
          currentSlide.id === slide.id ? response.data : currentSlide,
        ),
      );

      setSuccessMessage(
        response.data.active
          ? "Slide ativado com sucesso."
          : "Slide desativado com sucesso.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao alterar status do slide.",
      );
    }
  }

  async function handleDeleteSlide(slide: StorefrontHeroSlide) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o slide "${slide.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await deleteAdminHeroSlide(slide.id);

      setSlides((currentSlides) =>
        currentSlides.filter((currentSlide) => currentSlide.id !== slide.id),
      );

      if (editingSlideId === slide.id) {
        handleCancelForm();
      }

      setSuccessMessage("Slide excluído com sucesso.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao excluir slide.",
      );
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Vitrine</span>
          <h1>Slides principais</h1>
          <p>Gerencie os banners grandes do topo da home.</p>
        </div>

        <button type="button" onClick={handleNewSlide}>
          Novo slide
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

      {isLoading && <p className="admin-state-message">Carregando slides...</p>}

      {isFormOpen && (
        <form className="admin-storefront-card" onSubmit={handleSubmit}>
          <h2>{editingSlideId ? "Editar slide" : "Novo slide"}</h2>

          {formData.imageUrl && (
            <div className="admin-storefront-preview">
              <img src={formData.imageUrl} alt={formData.title} />

              <div>
                <span>{formData.kicker}</span>
                <strong>{formData.title}</strong>
                <p>{formData.description}</p>
              </div>
            </div>
          )}

          <div className="admin-storefront-form-grid">
            <label>
              Chamada
              <input
                type="text"
                value={formData.kicker}
                onChange={(event) =>
                  updateFormField("kicker", event.target.value)
                }
                required
              />
            </label>

            <label>
              Posição
              <input
                type="number"
                min="0"
                value={formData.position}
                onChange={(event) =>
                  updateFormField("position", event.target.value)
                }
                required
              />
            </label>

            <label className="admin-storefront-full">
              Título
              <input
                type="text"
                value={formData.title}
                onChange={(event) =>
                  updateFormField("title", event.target.value)
                }
                required
              />
            </label>

            <label className="admin-storefront-full">
              Descrição
              <textarea
                value={formData.description}
                onChange={(event) =>
                  updateFormField("description", event.target.value)
                }
                required
              />
            </label>

            <label className="admin-storefront-full">
              URL da imagem
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(event) =>
                  updateFormField("imageUrl", event.target.value)
                }
                required
              />
            </label>

            <label className="admin-storefront-full">
              Enviar imagem
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploadingImage}
                onChange={(event) => handleUploadImage(event.target.files?.[0])}
              />
            </label>

            <label>
              Botão principal
              <input
                type="text"
                value={formData.primaryAction}
                onChange={(event) =>
                  updateFormField("primaryAction", event.target.value)
                }
                required
              />
            </label>
            <label>
              Link do botão principal
              <input
                type="text"
                value={formData.primaryActionHref}
                onChange={(event) =>
                  updateFormField("primaryActionHref", event.target.value)
                }
                placeholder="/produtos"
                required
              />
            </label>

            <label>
              Botão secundário
              <input
                type="text"
                value={formData.secondaryAction}
                onChange={(event) =>
                  updateFormField("secondaryAction", event.target.value)
                }
                required
              />
            </label>
            <label>
              Link do botão secundário
              <input
                type="text"
                value={formData.secondaryActionHref}
                onChange={(event) =>
                  updateFormField("secondaryActionHref", event.target.value)
                }
                placeholder="/orcamento"
                required
              />
            </label>

            <label className="admin-storefront-checkbox">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(event) =>
                  updateFormField("active", event.target.checked)
                }
              />
              Slide ativo
            </label>
          </div>

          <div className="admin-storefront-actions">
            <button
              type="button"
              className="admin-storefront-secondary-action"
              onClick={handleCancelForm}
            >
              Cancelar
            </button>

            <button type="submit" disabled={isSaving || uploadingImage}>
              {isSaving ? "Salvando..." : "Salvar slide"}
            </button>
          </div>
        </form>
      )}

      <div className="admin-storefront-card">
        <h2>Slides cadastrados</h2>

        {!isLoading && slides.length === 0 && (
          <p className="admin-state-message">Nenhum slide encontrado.</p>
        )}

        <div className="admin-storefront-table">
          {slides.map((slide) => (
            <article className="admin-storefront-table-row" key={slide.id}>
              <img src={slide.imageUrl} alt={slide.title} />

              <div>
                <strong>{slide.title}</strong>
                <span>
                  Posição {slide.position} ·{" "}
                  {slide.active ? "Ativo" : "Inativo"}
                </span>
              </div>

              <div className="admin-storefront-table-actions">
                <button type="button" onClick={() => handleEditSlide(slide)}>
                  Editar
                </button>

                <button type="button" onClick={() => handleToggleSlide(slide)}>
                  {slide.active ? "Desativar" : "Ativar"}
                </button>

                <button
                  type="button"
                  className="admin-storefront-danger-action"
                  onClick={() => handleDeleteSlide(slide)}
                >
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
