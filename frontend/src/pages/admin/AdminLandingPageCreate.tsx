import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { landingPagesService } from "../../services/landing-pages.service";
import { uploadLandingPageImageFile } from "../../services/uploads.service";

type PreviewMode = "desktop" | "mobile";

interface LandingSection {
  title: string;
  content: string;
}

export function AdminLandingPageCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [active, setActive] = useState(true);

  const [heroBadge, setHeroBadge] = useState("OFERTA ESPECIAL");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);

  const [primaryColor, setPrimaryColor] = useState("#D4AF37");

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState(
    "Olá! Vim pela Landing Page.",
  );

  const [sections, setSections] = useState<LandingSection[]>([]);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");

  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const generatedSlug = useMemo(() => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }, [title]);

  const handleTitleChange = (value: string) => {
    setTitle(value);

    if (!slug) {
      setSlug(
        value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
      );
    }
  };

  const handleHeroImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setFormError("");
      setUploadingHeroImage(true);

      const response = await uploadLandingPageImageFile(file);

      setHeroImage(response.data.url);
    } catch (error) {
      console.error("Erro ao enviar imagem da Landing Page:", error);

      setFormError(
        error instanceof Error
          ? error.message
          : "Erro ao enviar imagem da Landing Page.",
      );
    } finally {
      setUploadingHeroImage(false);

      event.target.value = "";
    }
  };

  const handleAddSection = () => {
    setSections((current) => [
      ...current,
      {
        title: "",
        content: "",
      },
    ]);
  };

  const handleRemoveSection = (index: number) => {
    setSections((current) => current.filter((_, i) => i !== index));
  };

  const handleSectionChange = (
    index: number,
    field: keyof LandingSection,
    value: string,
  ) => {
    setSections((current) =>
      current.map((section, i) =>
        i === index
          ? {
              ...section,
              [field]: value,
            }
          : section,
      ),
    );
  };

  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(
        /\D/g,
        "",
      )}?text=${encodeURIComponent(whatsappMessage)}`
    : "#";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSaving) {
      return;
    }

    try {
      setFormError("");
      setIsSaving(true);

      await landingPagesService.create({
        title,
        slug: slug || generatedSlug,
        active,
        heroBadge,
        heroTitle,
        heroSubtitle,
        heroBannerUrl: heroImage || undefined,
        primaryColor,
        whatsappNumber,
        whatsappMessage,
        sections,
      });

      navigate("/admin/landing-pages");
    } catch (error) {
      console.error("Erro ao criar landing page:", error);

      setFormError(
        error instanceof Error
          ? error.message
          : "Erro ao salvar a Landing Page.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="landing-builder">
      <header className="landing-builder-header">
        <div>
          <button
            type="button"
            className="landing-builder-back"
            onClick={() => navigate("/admin/landing-pages")}
          >
            ← Landing Pages
          </button>

          <h1>Nova Landing Page</h1>

          <p>
            Crie uma página promocional e acompanhe o resultado em tempo real.
          </p>
        </div>

        <div className="landing-builder-header-actions">
          <span
            className={`landing-status ${
              active ? "landing-status-active" : "landing-status-inactive"
            }`}
          >
            <span />
            {active ? "Publicada após salvar" : "Rascunho"}
          </span>

          <button
            type="submit"
            form="landing-page-form"
            className="landing-save-button"
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar Landing Page"}
          </button>
        </div>
      </header>

      {formError && (
        <div className="landing-form-error" role="alert">
          {formError}
        </div>
      )}

      <div className="landing-builder-layout">
        <main className="landing-editor">
          <form id="landing-page-form" onSubmit={handleSubmit}>
            <section className="landing-editor-card">
              <div className="landing-editor-card-header">
                <div>
                  <span className="landing-step">01</span>

                  <div>
                    <h2>Informações básicas</h2>

                    <p>Defina o nome e o endereço da campanha.</p>
                  </div>
                </div>
              </div>

              <div className="landing-form-grid">
                <div className="landing-field landing-field-full">
                  <label htmlFor="landing-title">Nome da campanha</label>

                  <input
                    id="landing-title"
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ex: Visão 99"
                    required
                  />
                </div>

                <div className="landing-field">
                  <label htmlFor="landing-slug">Slug da URL</label>

                  <input
                    id="landing-slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="visao-99"
                    required
                  />

                  <small>
                    /l/
                    {slug || generatedSlug || "sua-campanha"}
                  </small>
                </div>

                <div className="landing-field landing-field-status">
                  <label>Status</label>

                  <label className="landing-switch">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                    />

                    <span />

                    <strong>
                      {active ? "Landing Page ativa" : "Salvar como rascunho"}
                    </strong>
                  </label>
                </div>
              </div>
            </section>

            <section className="landing-editor-card">
              <div className="landing-editor-card-header">
                <div>
                  <span className="landing-step">02</span>

                  <div>
                    <h2>Hero da campanha</h2>

                    <p>
                      É a primeira coisa que o cliente verá ao entrar na página.
                    </p>
                  </div>
                </div>
              </div>

              <div className="landing-form-grid">
                <div className="landing-field landing-field-full">
                  <label htmlFor="hero-badge">Badge do destaque</label>

                  <input
                    id="hero-badge"
                    type="text"
                    value={heroBadge}
                    onChange={(e) => setHeroBadge(e.target.value)}
                    placeholder="OFERTA ESPECIAL"
                    maxLength={80}
                  />
                </div>

                <div className="landing-field landing-field-full">
                  <label htmlFor="hero-title">Título principal</label>

                  <input
                    id="hero-title"
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    placeholder="Ex: Óculos completos por apenas R$ 99"
                    required
                  />
                </div>

                <div className="landing-field landing-field-full">
                  <label htmlFor="hero-subtitle">Subtítulo</label>

                  <textarea
                    id="hero-subtitle"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    placeholder="Explique rapidamente o principal benefício da campanha."
                    rows={3}
                  />
                </div>

                <div className="landing-field landing-field-full">
                  <label htmlFor="hero-image">Imagem principal</label>

                  <input
                    id="hero-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleHeroImageUpload}
                    disabled={uploadingHeroImage}
                  />

                  {uploadingHeroImage && <small>Enviando imagem...</small>}

                  {heroImage && (
                    <div className="landing-hero-upload-preview">
                      <img src={heroImage} alt="Preview da imagem principal" />
                    </div>
                  )}

                  <small>
                    JPG, PNG ou WEBP. A imagem será armazenada no Cloudinary.
                  </small>
                </div>

                <div className="landing-field">
                  <label htmlFor="primary-color">Cor da campanha</label>

                  <div className="landing-color-control">
                    <input
                      id="primary-color"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />

                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="landing-editor-card">
              <div className="landing-editor-card-header">
                <div>
                  <span className="landing-step">03</span>

                  <div>
                    <h2>WhatsApp e conversão</h2>

                    <p>
                      Configure o botão que levará o cliente diretamente para o
                      atendimento.
                    </p>
                  </div>
                </div>
              </div>

              <div className="landing-form-grid">
                <div className="landing-field">
                  <label htmlFor="whatsapp-number">WhatsApp</label>

                  <input
                    id="whatsapp-number"
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="5511963208855"
                  />
                </div>

                <div className="landing-field">
                  <label htmlFor="whatsapp-message">Mensagem automática</label>

                  <input
                    id="whatsapp-message"
                    type="text"
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="landing-editor-card">
              <div className="landing-editor-card-header">
                <div>
                  <span className="landing-step">04</span>

                  <div>
                    <h2>Conteúdo da campanha</h2>

                    <p>
                      Adicione informações extras que aparecerão abaixo do
                      destaque.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="landing-add-section-button"
                  onClick={handleAddSection}
                >
                  + Adicionar seção
                </button>
              </div>

              {sections.length === 0 ? (
                <div className="landing-empty-sections">
                  <div>＋</div>

                  <strong>Nenhuma seção adicionada</strong>

                  <p>
                    Você pode adicionar benefícios, condições, informações da
                    promoção ou outros conteúdos.
                  </p>
                </div>
              ) : (
                <div className="landing-sections-editor">
                  {sections.map((section, index) => (
                    <div className="landing-section-editor" key={index}>
                      <div className="landing-section-editor-header">
                        <strong>Seção {index + 1}</strong>

                        <button
                          type="button"
                          onClick={() => handleRemoveSection(index)}
                        >
                          Remover
                        </button>
                      </div>

                      <div className="landing-field">
                        <label>Título</label>

                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) =>
                            handleSectionChange(index, "title", e.target.value)
                          }
                          placeholder="Ex: O que está incluso"
                        />
                      </div>

                      <div className="landing-field">
                        <label>Conteúdo</label>

                        <textarea
                          rows={4}
                          value={section.content}
                          onChange={(e) =>
                            handleSectionChange(
                              index,
                              "content",
                              e.target.value,
                            )
                          }
                          placeholder="Descreva esta parte da campanha..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </form>
        </main>

        <aside className="landing-preview-panel">
          <div className="landing-preview-toolbar">
            <div>
              <strong>Pré-visualização</strong>

              <span>Atualizada em tempo real</span>
            </div>

            <div className="landing-preview-modes">
              <button
                type="button"
                className={previewMode === "desktop" ? "active" : ""}
                onClick={() => setPreviewMode("desktop")}
                title="Visualização desktop"
              >
                ▣
              </button>

              <button
                type="button"
                className={previewMode === "mobile" ? "active" : ""}
                onClick={() => setPreviewMode("mobile")}
                title="Visualização mobile"
              >
                ▯
              </button>
            </div>
          </div>

          <div className="landing-preview-stage">
            <div
              className={`landing-live-preview ${
                previewMode === "mobile" ? "landing-live-preview-mobile" : ""
              }`}
            >
              <div
                className="landing-live-hero"
                style={{
                  backgroundImage: heroImage
                    ? `linear-gradient(135deg, rgba(0,0,0,.68), rgba(0,0,0,.25)), url("${heroImage}")`
                    : `linear-gradient(135deg, ${primaryColor}, #111827)`,
                }}
              >
                <div className="landing-live-hero-content">
                  <span className="landing-live-badge">
                    {heroBadge || (active ? "OFERTA ESPECIAL" : "RASCUNHO")}
                  </span>

                  <h2>{heroTitle || title || "Sua campanha começa aqui"}</h2>

                  <p>
                    {heroSubtitle ||
                      "Adicione um subtítulo para apresentar sua oferta ao cliente."}
                  </p>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!whatsappNumber) {
                        e.preventDefault();
                      }
                    }}
                    className="landing-live-whatsapp"
                    style={{
                      backgroundColor: primaryColor,
                    }}
                  >
                    💬{" "}
                    {whatsappNumber ? "Garantir oferta" : "Configurar WhatsApp"}
                  </a>
                </div>
              </div>

              <div className="landing-live-content">
                {sections.length === 0 ? (
                  <div className="landing-live-placeholder">
                    <strong>Suas seções aparecerão aqui</strong>

                    <span>
                      Use “Adicionar seção” para começar a montar o conteúdo.
                    </span>
                  </div>
                ) : (
                  sections.map((section, index) => (
                    <article
                      className="landing-live-section"
                      key={`${index}-${section.title}`}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>

                      <div>
                        <h3>{section.title || "Título da seção"}</h3>

                        <p>
                          {section.content ||
                            "O conteúdo desta seção aparecerá aqui."}
                        </p>
                      </div>
                    </article>
                  ))
                )}
              </div>

              <footer className="landing-live-footer">
                <strong>{title || "Sua campanha"}</strong>

                <span>Ótica Show Room</span>
              </footer>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
