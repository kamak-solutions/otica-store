import { useMemo, useState } from "react";
import { RgbaStringColorPicker } from "react-colorful";
import { useNavigate } from "react-router-dom";
import { landingPagesService } from "../../services/landing-pages.service";
import { uploadLandingPageImageFile } from "../../services/uploads.service";

type PreviewMode = "desktop" | "mobile";

interface LandingSection {
  type: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
  textColor: string;
  order: number;
  active: boolean;
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
  const [heroImagePublicId, setHeroImagePublicId] = useState("");
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);

  const [primaryColor, setPrimaryColor] = useState("#D4AF37");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const rgbaColor = (() => {
    const value = primaryColor.trim();

    if (value.startsWith("rgba(")) {
      return value;
    }

    if (value.startsWith("rgb(")) {
      const match = value.match(
        /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/
      );

      if (match) {
        return `rgba(${match[1]}, ${match[2]}, ${match[3]}, 1)`;
      }
    }

    const hex = value.replace("#", "");

    if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);

      return `rgba(${r}, ${g}, ${b}, 1)`;
    }

    return "rgba(212, 175, 55, 1)";
  })();

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

  const handleHeroImageUpload = async (file: File) => {
    try {
      setFormError("");
      setUploadingHeroImage(true);

      const response = await uploadLandingPageImageFile(file);

      setHeroImage(response.data.url);
      setHeroImagePublicId(response.data.publicId);
    } catch (error) {
      console.error("Erro ao enviar imagem da Landing Page:", error);

      setFormError(
        error instanceof Error
          ? error.message
          : "Erro ao enviar imagem da Landing Page.",
      );
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const handleAddSection = () => {
    setSections((current) => [
      ...current,
      {
        type: "features",
        title: "",
        subtitle: "",
        content: "",
        imageUrl: "",
        buttonText: "",
        buttonLink: "",
        bgColor: "",
        textColor: "",
        order: sections.length,
        active: true,
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
        heroBannerPublicId: heroImagePublicId || undefined,
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
                  <label htmlFor="landing-title">Nome da Landing Page</label>

                  <input
                    id="landing-title"
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ex: Visão 99"
                    required
                  />

                  <small>
                    Nome interno da campanha. O slug da URL será preenchido
                    automaticamente.
                  </small>
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

                  {uploadingHeroImage && <small>Enviando imagem...</small>}

                  {heroImage && (
                    <div className="landing-hero-upload-preview">
                      <div className="landing-hero-upload-preview-image">
                        <img
                          src={heroImage}
                          alt="Preview da imagem principal"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        className="landing-remove-image-button"
                        onClick={() => setHeroImage("")}
                      >
                        Remover imagem
                      </button>
                    </div>
                  )}

                  <small>
                    JPG, PNG ou WEBP. A imagem será armazenada no Cloudinary.
                  </small>
                </div>

                <div className="landing-field">
                  <label htmlFor="primary-color">Cor da campanha</label>

                  <div className="landing-color-control">
                    {showColorPicker && (
                      <div className="landing-color-picker-popover">
                        <RgbaStringColorPicker
                          color={rgbaColor}
                          onChange={setPrimaryColor}
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      className="landing-color-swatch"
                      style={{ backgroundColor: primaryColor }}
                      onClick={() => setShowColorPicker((value) => !value)}
                      aria-label="Abrir seletor de cor"
                    />

                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#D4AF37 ou rgba(212, 175, 55, 0.5)"
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
                        <label>Tipo da seção</label>

                        <select
                          value={section.type}
                          onChange={(e) =>
                            handleSectionChange(index, "type", e.target.value)
                          }
                        >
                          <option value="features">Conteúdo</option>
                          <option value="banner_9_16">Banner</option>
                          <option value="gallery">Galeria</option>
                          <option value="testimonials">Depoimentos</option>
                          <option value="cta">Chamada para ação</option>
                        </select>
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
                        <label>Subtítulo</label>

                        <input
                          type="text"
                          value={section.subtitle}
                          onChange={(e) =>
                            handleSectionChange(
                              index,
                              "subtitle",
                              e.target.value,
                            )
                          }
                          placeholder="Uma frase complementar"
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

                      <div className="landing-field">
                        <label>Imagem da seção</label>

                        <input
                          type="url"
                          value={section.imageUrl}
                          onChange={(e) =>
                            handleSectionChange(
                              index,
                              "imageUrl",
                              e.target.value,
                            )
                          }
                          placeholder="URL da imagem"
                        />
                      </div>

                      <div className="landing-field">
                        <label>Overlay / gradiente</label>

                        <select
                          value={section.bgColor ? "custom" : "none"}
                          onChange={(e) =>
                            handleSectionChange(
                              index,
                              "bgColor",
                              e.target.value === "none" ? "" : section.bgColor,
                            )
                          }
                        >
                          <option value="none">Sem overlay</option>
                          <option value="custom">Com overlay</option>
                        </select>
                      </div>

                      <div className="landing-form-grid">
                        <div className="landing-field">
                          <label>Texto do botão</label>

                          <input
                            type="text"
                            value={section.buttonText}
                            onChange={(e) =>
                              handleSectionChange(
                                index,
                                "buttonText",
                                e.target.value,
                              )
                            }
                            placeholder="Ex: Quero aproveitar"
                          />
                        </div>

                        <div className="landing-field">
                          <label>Link do botão</label>

                          <input
                            type="url"
                            value={section.buttonLink}
                            onChange={(e) =>
                              handleSectionChange(
                                index,
                                "buttonLink",
                                e.target.value,
                              )
                            }
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <div className="landing-form-grid">
                        <div className="landing-field">
                          <label>Cor de fundo</label>

                          <input
                            type="text"
                            value={section.bgColor}
                            onChange={(e) =>
                              handleSectionChange(
                                index,
                                "bgColor",
                                e.target.value,
                              )
                            }
                            placeholder="Ex: rgba(0,0,0,0.55)"
                          />
                        </div>

                        <div className="landing-field">
                          <label>Cor do texto</label>

                          <input
                            type="text"
                            value={section.textColor}
                            onChange={(e) =>
                              handleSectionChange(
                                index,
                                "textColor",
                                e.target.value,
                              )
                            }
                            placeholder="Ex: #FFFFFF"
                          />
                        </div>
                      </div>

                      <div className="landing-field">
                        <label>
                          <input
                            type="checkbox"
                            checked={section.active}
                            onChange={(e) =>
                              handleSectionChange(
                                index,
                                "active",
                                e.target.checked ? "true" : "false",
                              )
                            }
                          />
                          {" "}Seção ativa
                        </label>
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
                    ? `linear-gradient(135deg, ${rgbaColor}, ${rgbaColor}), url("${heroImage}")`
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
                      style={{
                        color: section.textColor || undefined,
                        backgroundColor:
                          section.imageUrl
                            ? undefined
                            : section.bgColor || undefined,
                      }}
                    >
                      {section.imageUrl && (
                        <div
                          className="landing-live-section-image"
                          style={{
                            backgroundImage: `url(${section.imageUrl})`,
                          }}
                        >
                          {section.bgColor && (
                            <div
                              className="landing-live-section-overlay"
                              style={{
                                background: section.bgColor,
                              }}
                            />
                          )}
                        </div>
                      )}

                      <span>{String(index + 1).padStart(2, "0")}</span>

                      <div className="landing-live-section-content">
                        <h3>{section.title || "Título da seção"}</h3>

                        {section.subtitle && (
                          <h4>{section.subtitle}</h4>
                        )}

                        <p>
                          {section.content ||
                            "O conteúdo desta seção aparecerá aqui."}
                        </p>

                        {section.buttonText && (
                          <a
                            href={section.buttonLink || "#"}
                            className="landing-live-section-button"
                            onClick={(e) => {
                              if (!section.buttonLink) {
                                e.preventDefault();
                              }
                            }}
                            style={{
                              backgroundColor: primaryColor,
                            }}
                          >
                            {section.buttonText}
                          </a>
                        )}
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
