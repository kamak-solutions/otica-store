import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createWidget, type Widget } from "../../services/widget.service";

import { uploadBlogImageFile } from "../../services/uploads.service";

export function AdminWidgetCreate() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [type, setType] = useState<Widget["type"]>("IMAGE");

  const [position, setPosition] = useState("BLOG_SIDEBAR");

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [mediaUrl, setMediaUrl] = useState("");

  const [embedCode, setEmbedCode] = useState("");

  const [redirectUrl, setRedirectUrl] = useState("");

  const [buttonLabel, setButtonLabel] = useState("");

  const [aspectRatio, setAspectRatio] = useState("16:9");

  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(false);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const response = await uploadBlogImageFile(file);

      setMediaUrl(response.data.url);
    } catch (error) {
      console.error(error);

      alert("Erro upload");
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);

      await createWidget({
        name,

        type,

        position,

        title,

        description,

        mediaUrl: mediaUrl || undefined,

        embedCode: embedCode || undefined,

        redirectUrl,

        buttonLabel: buttonLabel || undefined,

        aspectRatio,

        active,
      });

      navigate("/admin/widgets");
    } catch (error) {
      console.error(error);

      alert("Erro ao criar widget");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>

          <h1>Novo widget</h1>

          <p>Criar bloco promocional.</p>
        </div>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <label>
          Nome
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Tipo
          <select
            value={type}
            onChange={(e) => setType(e.target.value as Widget["type"])}
          >
            <option value="IMAGE">Imagem</option>

            <option value="VIDEO">Vídeo</option>

            <option value="EMBED">Embed</option>

            <option value="HTML">HTML</option>
          </select>
        </label>

        <label>
          Posição
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            <option value="BLOG_SIDEBAR">Blog Sidebar</option>

            <option value="BLOG_ARTICLE">Artigo</option>

            <option value="HOME">Home</option>
          </select>
        </label>

        <label>
          Título
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Descrição
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        {type === "IMAGE" && (
          <label>
            Imagem
            <input type="file" accept="image/*" onChange={handleUpload} />
            {mediaUrl && (
              <img
                src={mediaUrl}
                style={{
                  width: "250px",
                  borderRadius: "10px",
                }}
              />
            )}
          </label>
        )}

        {type === "VIDEO" && (
          <label>
            URL vídeo
            <input
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
            />
          </label>
        )}

        {type === "EMBED" && (
          <label>
            Código embed
            <textarea
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
            />
          </label>
        )}

        <label>
          Proporção
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
          >
            <option value="1:1">1:1</option>

            <option value="16:9">16:9</option>

            <option value="9:16">9:16</option>
          </select>
        </label>

        <label>
          Link destino *
          <input
            required
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
          />
        </label>

        <label>
          Texto botão (opcional)
          <input
            value={buttonLabel}
            onChange={(e) => setButtonLabel(e.target.value)}
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Ativo
        </label>

        <button className="admin-submit-button">
          {loading ? "Salvando..." : "Criar widget"}
        </button>
      </form>
    </section>
  );
}
