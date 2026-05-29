import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCampaign } from "../../services/campaigns.service";
import { uploadCampaignImageFile } from "../../services/uploads.service";

export function AdminCampaignCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    imageUrl: string;
    buttonText: string;
    buttonLink: string;

    location: "home" | "products" | "global";

    showDelay: string;

    showOnlyOnce: boolean;

    active: boolean;
  }>({
    title: "",
    description: "",
    imageUrl: "",
    buttonText: "",
    buttonLink: "",

    location: "home",

    showDelay: "3000",

    showOnlyOnce: true,

    active: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  function updateField(field: string, value: string | boolean) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }
  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);

      const response = await uploadCampaignImageFile(file);

      updateField("imageUrl", response.data.url);
    } catch (error) {
      console.error(error);

      alert("Erro ao enviar imagem.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setSubmitting(true);

      await createCampaign({
        ...formData,

        showDelay: Number(formData.showDelay),
      });

      navigate("/admin/campanhas");
    } catch (error) {
      console.error(error);

      alert("Erro ao criar campanha.");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>
          <h1>Nova campanha</h1>
          <p>Crie promoções e popups para sua loja</p>
        </div>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <label>
          Título
          <input
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </label>

        <label>
          Descrição
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </label>

        <label>
          Banner da campanha
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploadingImage && <span>Enviando imagem...</span>}
          {formData.imageUrl && (
            <div className="campaign-image-preview">
              <img src={formData.imageUrl} alt="Preview" />
            </div>
          )}
        </label>

        <div className="admin-form-grid">
          <label>
            Texto botão
            <input
              value={formData.buttonText}
              onChange={(e) => updateField("buttonText", e.target.value)}
            />
          </label>

          <label>
            Link botão
            <input
              value={formData.buttonLink}
              onChange={(e) => updateField("buttonLink", e.target.value)}
            />
          </label>
        </div>

        <div className="admin-form-grid">
          <label>
            Local
            <select
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
            >
              <option value="home">Home</option>

              <option value="products">Produtos</option>

              <option value="global">Global</option>
            </select>
          </label>

          <label>
            Delay(ms)
            <input
              type="number"
              value={formData.showDelay}
              onChange={(e) => updateField("showDelay", e.target.value)}
            />
          </label>
        </div>

        <div className="admin-checkbox-row">
          <label>
            <input
              type="checkbox"
              checked={formData.showOnlyOnce}
              onChange={(e) => updateField("showOnlyOnce", e.target.checked)}
            />
            Mostrar apenas uma vez
          </label>

          <label>
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => updateField("active", e.target.checked)}
            />
            Ativa
          </label>
        </div>

        <button className="admin-submit-button" type="submit">
          {submitting ? "Salvando..." : "Criar campanha"}
        </button>
      </form>
    </section>
  );
}
