import { useEffect, useState } from "react";

import {
  listBlogCategories,
  createBlogCategory,
  type BlogCategory,
} from "../../services/blog-category.service";

export function AdminBlogCategories() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    position: "0",
    active: true,
  });

  async function loadCategories() {
    try {
      const data = await listBlogCategories();

      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setSubmitting(true);

      await createBlogCategory({
        name: formData.name,
        description: formData.description,

        position: Number(formData.position),

        active: formData.active,
      });

      setFormData({
        name: "",
        description: "",
        position: "0",
        active: true,
      });

      await loadCategories();
    } catch (error) {
      console.error(error);

      alert("Erro ao criar categoria.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>

          <h1>Categorias do Blog</h1>

          <p>Organize seus artigos.</p>
        </div>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <label>
          Nome
          <input
            value={formData.name}
            onChange={(e) =>
              setFormData((current) => ({
                ...current,
                name: e.target.value,
              }))
            }
          />
        </label>

        <label>
          Descrição
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData((current) => ({
                ...current,
                description: e.target.value,
              }))
            }
          />
        </label>

        <label>
          Posição
          <input
            type="number"
            value={formData.position}
            onChange={(e) =>
              setFormData((current) => ({
                ...current,
                position: e.target.value,
              }))
            }
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={formData.active}
            onChange={(e) =>
              setFormData((current) => ({
                ...current,
                active: e.target.checked,
              }))
            }
          />
          Ativa
        </label>

        <button className="admin-submit-button" type="submit">
          {submitting ? "Salvando..." : "Criar categoria"}
        </button>
      </form>

      <div className="admin-table-card">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>

                <th>Slug</th>

                <th>Posição</th>

                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>

                  <td>{category.slug}</td>

                  <td>{category.position}</td>

                  <td>{category.active ? "🟢 Ativa" : "🔴 Inativa"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
