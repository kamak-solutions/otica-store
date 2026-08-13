import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  landingPagesService,
  type LandingPage,
  type LandingPageSection,
} from "../../services/landing-pages.service";
import { uploadLandingPageImageFile } from "../../services/uploads.service";

interface EditorSection {
  id?: string;
  title: string;
  content: string;
}

export function AdminLandingPageEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [active, setActive] = useState(true);

  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [heroImagePublicId, setHeroImagePublicId] = useState("");
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);

  const [primaryColor, setPrimaryColor] = useState("#D4AF37");

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState(
    "Olá! Vim pela Landing Page.",
  );

  const [sections, setSections] = useState<EditorSection[]>([]);
  const [previewMode, setPreviewMode] = useState("desktop");

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

  async function handleHeroImageUpload(file: File) {
    try {
      setUploadingHeroImage(true);

      const result = await uploadLandingPageImageFile(file);

      setHeroImage(result.data.url);
      setHeroImagePublicId(result.data.publicId);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao enviar imagem da Landing Page.",
      );
    } finally {
      setUploadingHeroImage(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function loadLandingPage() {
      if (!id) {
        navigate("/admin/landing-pages");
        return;
      }

      try {
        setIsLoadingPage(true);

        const data = await landingPagesService.getById(id);

        if (!mounted) return;

        setLandingPage(data);

        setTitle(data.title);
        setSlug(data.slug);
        setActive(data.active);

        setHeroTitle(data.heroTitle || "");
        setHeroSubtitle(data.heroSubtitle || "");
        setHeroImage(data.heroBannerUrl || "");
        setHeroTitle(data.heroTitle || "");
        setHeroSubtitle(data.heroSubtitle || "");
        setHeroImage(data.heroBannerUrl || "");
        setHeroImagePublicId(data.heroBannerPublicId || "");

        setPrimaryColor(data.primaryColor || "#D4AF37");

        setWhatsappNumber(data.whatsappNumber || "");
        setWhatsappMessage(
          data.whatsappMessage || "Olá! Vim pela Landing Page.",
        );

        setSections(
          (data.sections || []).map((section: LandingPageSection) => ({
            id: section.id,
            title: section.title || "",
            content: section.content || "",
          })),
        );
      } catch (error) {
        console.error("Erro ao carregar landing page:", error);

        if (mounted) {
          alert("Landing page não encontrada.");
          navigate("/admin/landing-pages");
        }
      } finally {
        if (mounted) {
          setIsLoadingPage(false);
        }
      }
    }

    void loadLandingPage();

    return () => {
      mounted = false;
    };
  }, [id, navigate]);

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
    field: keyof EditorSection,
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

    if (!id || isSaving) return;

    try {
      setIsSaving(true);

      await landingPagesService.update(id, {
        title,
        slug: slug || generatedSlug,
        active,
        heroTitle,
        heroSubtitle,
        heroBannerUrl: heroImage,
        primaryColor,
        heroBannerPublicId: heroImagePublicId,
        whatsappNumber,
        whatsappMessage,

        sections: sections.map((section) => ({
          title: section.title,
          content: section.content,
        })),
      });

      navigate("/admin/landing-pages");
    } catch (error) {
      console.error("Erro ao atualizar landing page:", error);

      alert(
        "Erro ao salvar a landing page. Verifique os dados e tente novamente.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingPage) {
    return (
      <div className="landing-builder-loading">
        Carregando dados da landing page...
      </div>
    );
  }

  if (!landingPage) {
    return null;
  }

  return (
    <div className="landing-builder-page">
      <header className="landing-builder-header">
        <div>
          <button
            type="button"
            className="landing-builder-back"
            onClick={() => navigate("/admin/landing-pages")}
          >
            ← Landing Pages
          </button>

          <h1>Editar Landing Page</h1>

          <p>Atualize sua campanha e acompanhe o resultado no preview.</p>
        </div>

        <div className="landing-builder-header-actions">
          <span
            className={`landing-status ${
              active ? "landing-status-active" : "landing-status-draft"
            }`}
          >
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
                    id="hero-image-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploadingHeroImage}
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (!file) {
                        return;
                      }

                      void handleHeroImageUpload(file);

                      event.target.value = "";
                    }}
                  />

                  <small>Informe a URL da imagem do Cloudinary.</small>

                  {heroImage && (
                    <div
                      style={{
                        marginTop: 10,
                        borderRadius: 10,
                        overflow: "hidden",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <img
                        src={heroImage}
                        alt="Preview do hero"
                        style={{
                          display: "block",
                          width: "100%",
                          maxHeight: 180,
                          objectFit: "cover",
                        }}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="landing-field">
                  <label htmlFor="primary-color">Cor da campanha</label>

                  <div className="landing-color-picker">
                    <input
                      id="primary-color"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />

                    <span>{primaryColor}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="landing-editor-card">
              <div className="landing-editor-card-header">
                <div>
                  <span className="landing-step">03</span>

                  <div>
                    <h2>WhatsApp</h2>

                    <p>Configure o contato utilizado pela campanha.</p>
                  </div>
                </div>
              </div>

              <div className="landing-form-grid">
                <div className="landing-field">
                  <label htmlFor="whatsapp-number">Número do WhatsApp</label>

                  <input
                    id="whatsapp-number"
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="5511999999999"
                  />
                </div>

                <div className="landing-field">
                  <label htmlFor="whatsapp-message">Mensagem padrão</label>

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
                    <h2>Seções da campanha</h2>

                    <p>Adicione conteúdo abaixo do destaque principal.</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="landing-add-section"
                  onClick={handleAddSection}
                >
                  + Adicionar seção
                </button>
              </div>

              <div className="landing-sections-editor">
                {sections.length === 0 ? (
                  <div className="landing-editor-empty">
                    Nenhuma seção adicionada.
                  </div>
                ) : (
                  sections.map((section, index) => (
                    <article
                      className="landing-section-editor"
                      key={section.id || `section-${index}`}
                    >
                      <div className="landing-section-editor-header">
                        <strong>Seção {index + 1}</strong>

                        <button
                          type="button"
                          onClick={() => handleRemoveSection(index)}
                        >
                          Remover
                        </button>
                      </div>

                      <div className="landing-form-grid">
                        <div className="landing-field">
                          <label>Título</label>

                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) =>
                              handleSectionChange(
                                index,
                                "title",
                                e.target.value,
                              )
                            }
                            placeholder="Título da seção"
                          />
                        </div>

                        <div className="landing-field">
                          <label>Conteúdo</label>

                          <textarea
                            rows={3}
                            value={section.content}
                            onChange={(e) =>
                              handleSectionChange(
                                index,
                                "content",
                                e.target.value,
                              )
                            }
                            placeholder="Conteúdo da seção"
                          />
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </form>
        </main>

        <aside className="landing-preview">
          <div className="landing-preview-header">
            <div>
              <strong>Visualização</strong>
              <span>Veja como sua landing page ficará.</span>
            </div>

            <div className="landing-preview-controls">
              <button
                type="button"
                className={previewMode === "desktop" ? "active" : ""}
                onClick={() => setPreviewMode("desktop")}
                title="Visualização desktop"
              >
                ▭
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
                    {active ? "OFERTA ESPECIAL" : "RASCUNHO"}
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
                      <span>0{index + 1}</span>

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
