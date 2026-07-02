import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createBrand } from "../../services/brands.service";

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9- ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AdminBrandCreate() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    setSlug(createSlug(value));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      await createBrand({
        name,
        slug,
        description: description || undefined,
        logoUrl: logoUrl || undefined,
        website: website || undefined,
      });

      navigate("/admin/marcas");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Catálogo</span>
          <h1>Nova marca</h1>
          <p>Cadastre uma marca para usar nos produtos.</p>
        </div>

        <button type="button" onClick={() => navigate("/admin/marcas")}>
          Voltar
        </button>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <label>
          Nome *
          <input
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            required
          />
        </label>

        <label>
          Slug *
          <input
            value={slug}
            onChange={(event) => setSlug(createSlug(event.target.value))}
            required
          />
        </label>

        <label>
          Descrição
          <textarea
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <label>
          Logo URL
          <input
            type="url"
            value={logoUrl}
            onChange={(event) => setLogoUrl(event.target.value)}
            placeholder="https://..."
          />
        </label>

        <label>
          Site
          <input
            type="url"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            placeholder="https://..."
          />
        </label>

        <button className="admin-submit-button" type="submit">
          {isSubmitting ? "Salvando..." : "Cadastrar marca"}
        </button>
      </form>
    </section>
  );
}