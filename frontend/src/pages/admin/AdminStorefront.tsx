import { useEffect, useState } from "react";
import { uploadStorefrontImage } from "../../services/admin-uploads.service";
import {
  createAdminHeroSlide,
  listAdminHeroSlides,
  updateAdminHeroSlide,
  type UpdateStorefrontHeroSlidePayload,
} from "../../services/admin-storefront.service";
import type { StorefrontHeroSlide } from "../../services/storefront.service";

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

  useEffect(() => {
    loadSlides();
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
      <form className="admin-storefront-card" onSubmit={handleCreateSlide}>
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
    </section>
  );
}
