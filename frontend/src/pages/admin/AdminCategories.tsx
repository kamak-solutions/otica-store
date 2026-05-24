import { useEffect, useState } from "react";

import {
  createAdminCategory,
  listAdminCategories,
} from "../../services/admin-categories.service";

import type { Category } from "../../types/category";

type FormData = {
  name: string;
  slug: string;
  description: string;
  parentId: string;
};

const initialFormData: FormData = {
  name: "",
  slug: "",
  description: "",
  parentId: "",
};

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadCategories() {
    try {
      const response = await listAdminCategories();

      setCategories(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao carregar categorias.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function updateField(field: keyof FormData, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createAdminCategory({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        parentId: formData.parentId || undefined,
      });

      setSuccessMessage("Categoria criada com sucesso.");

      setFormData(initialFormData);

      await loadCategories();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao criar categoria.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const parentCategories = categories.filter((category) => !category.parent);

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>
          <h1>Categorias</h1>
          <p>Organize categorias e subcategorias.</p>
        </div>
      </div>

      {errorMessage && <p className="admin-error-message">{errorMessage}</p>}

      {successMessage && (
        <p className="admin-success-message">{successMessage}</p>
      )}

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <label>
          Nome
          <input
            value={formData.name}
            onChange={(e) => {
              updateField("name", e.target.value);

              if (!formData.slug) {
                updateField("slug", createSlug(e.target.value));
              }
            }}
          />
        </label>

        <label>
          Slug
          <input
            value={formData.slug}
            onChange={(e) => updateField("slug", createSlug(e.target.value))}
          />
        </label>

        <label>
          Categoria pai
          <select
            value={formData.parentId}
            onChange={(e) => updateField("parentId", e.target.value)}
          >
            <option value="">Nenhuma</option>

            {parentCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Descrição
          <textarea
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </label>

        <button className="admin-submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar categoria"}
        </button>
      </form>

      <section className="admin-form-card">
        <h2>Categorias cadastradas</h2>

        {isLoading ? (
          <p>Carregando...</p>
        ) : categories.length === 0 ? (
          <p>Nenhuma categoria cadastrada.</p>
        ) : (
          <div className="admin-categories-list">
            {categories.map((category) => (
              <article
                key={category.id}
                className={`admin-category-item ${
                  category.parent ? "child" : "parent"
                }`}
              >
                <div>
                  <strong>
                    {category.parent && "↳ "}
                    {category.name}
                  </strong>

                  <p>Slug: {category.slug}</p>

                  {category.parent && (
                    <small>Categoria pai: {category.parent.name}</small>
                  )}

                  {!category.parent && (category.children?.length ?? 0) > 0 && (
                    <small>
                      {category.children?.length ?? 0} subcategoria(s)
                    </small>
                  )}
                </div>

                <span>{category.active ? "Ativa" : "Inativa"}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
