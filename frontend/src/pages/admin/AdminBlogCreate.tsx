import { useEffect, useState } from "react";

import {
  listBlogCategories,
  type BlogCategory,
} from "../../services/blog-category.service";

import { useNavigate } from "react-router-dom";

import { createBlogPost } from "../../services/blog.service";

export function AdminBlogCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");

  const [excerpt, setExcerpt] = useState("");

  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState<BlogCategory[]>([]);

  const [readingTime, setReadingTime] = useState("");

  const [published, setPublished] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await listBlogCategories();

        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadCategories();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setSubmitting(true);

      await createBlogPost({
        title,
        excerpt,
        categoryId,
        readingTime,
        published,

        content: [
          {
            heading: "Introdução",

            paragraphs: ["Conteúdo inicial do artigo."],
          },
        ],
      });

      navigate("/admin/blog");
    } catch (error) {
      console.error(error);

      alert("Erro ao criar artigo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>

          <h1>Novo artigo</h1>

          <p>Criar artigo do blog.</p>
        </div>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <label>
          Título
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Resumo
          <textarea
            rows={4}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </label>

        <label>
          Categoria
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Selecione</option>

            {categories.map((category: BlogCategory) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tempo de leitura
          <input
            value={readingTime}
            onChange={(e) => setReadingTime(e.target.value)}
            placeholder="5 min"
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Publicado
        </label>

        <button className="admin-submit-button" type="submit">
          {submitting ? "Salvando..." : "Criar artigo"}
        </button>
      </form>
    </section>
  );
}
