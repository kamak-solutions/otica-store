import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategories } from "../../services/categories.service";
import {
  createAdminProduct,
  type CreateAdminProductPayload,
} from "../../services/products.service";
import type { Category } from "../../types/category";

type ProductFormData = {
  name: string;
  slug: string;
  description: string;
  price: string;
  salePrice: string;
  sku: string;
  brand: string;
  stock: string;
  categoryId: string;
  audience: string;
  active: boolean;
  featured: boolean;
};

const initialFormData: ProductFormData = {
  name: "",
  slug: "",
  description: "",
  price: "",
  salePrice: "",
  sku: "",
  brand: "Ótica ShowRoom",
  stock: "0",
  categoryId: "",
  audience: "unissex",
  active: true,
  featured: false,
};

function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseOptionalNumber(value: string) {
  if (!value.trim()) {
    return undefined;
  }

  return Number(value);
}

export function AdminProductCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch {
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  function updateField(
    field: keyof ProductFormData,
    value: string | boolean,
  ) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  function handleNameChange(value: string) {
    setFormData((currentData) => ({
      ...currentData,
      name: value,
      slug: currentData.slug ? currentData.slug : normalizeSlug(value),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    const payload: CreateAdminProductPayload = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description || undefined,
      price: Number(formData.price),
      salePrice: parseOptionalNumber(formData.salePrice),
      sku: formData.sku || undefined,
      brand: formData.brand || undefined,
      stock: Number(formData.stock),
      categoryId: formData.categoryId || undefined,
      audience: formData.audience || undefined,
      active: formData.active,
      featured: formData.featured,
    };

    try {
      const response = await createAdminProduct(payload);

      navigate("/admin/produtos", {
        state: {
          message: `Produto "${response.data.name}" criado com sucesso.`,
        },
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao criar produto.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <Link className="back-link" to="/admin/produtos">
        ← Voltar para produtos
      </Link>

      <div className="section-heading">
        <div>
          <span className="admin-kicker">Admin</span>
          <h1>Novo produto</h1>
          <p>Cadastre um produto para aparecer na loja.</p>
        </div>
      </div>

      {errorMessage && <div className="error-alert">{errorMessage}</div>}

      <form className="admin-product-form" onSubmit={handleSubmit}>
        <section className="admin-detail-card">
          <h2>Informações principais</h2>

          <label>
            Nome do produto
            <input
              type="text"
              value={formData.name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Ex: Óculos Solar Premium"
              required
            />
          </label>

          <label>
            Slug
            <input
              type="text"
              value={formData.slug}
              onChange={(event) =>
                updateField("slug", normalizeSlug(event.target.value))
              }
              placeholder="oculos-solar-premium"
              required
            />
          </label>

          <label>
            Descrição
            <textarea
              value={formData.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Descrição do produto"
              rows={4}
            />
          </label>
        </section>

        <section className="admin-detail-card">
          <h2>Preço e estoque</h2>

          <div className="form-grid">
            <label>
              Preço
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(event) => updateField("price", event.target.value)}
                placeholder="199.90"
                required
              />
            </label>

            <label>
              Preço promocional
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.salePrice}
                onChange={(event) =>
                  updateField("salePrice", event.target.value)
                }
                placeholder="159.90"
              />
            </label>
          </div>

          <div className="form-grid">
            <label>
              Estoque
              <input
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={(event) => updateField("stock", event.target.value)}
                required
              />
            </label>

            <label>
              SKU
              <input
                type="text"
                value={formData.sku}
                onChange={(event) => updateField("sku", event.target.value)}
                placeholder="SKU-001"
              />
            </label>
          </div>

          <label>
            Marca
            <input
              type="text"
              value={formData.brand}
              onChange={(event) => updateField("brand", event.target.value)}
              placeholder="Ótica ShowRoom"
            />
          </label>
        </section>

        <section className="admin-detail-card">
          <h2>Organização</h2>

          <label>
            Categoria
            <select
              value={formData.categoryId}
              onChange={(event) =>
                updateField("categoryId", event.target.value)
              }
            >
              <option value="">Selecione uma categoria</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Público
            <select
              value={formData.audience}
              onChange={(event) =>
                updateField("audience", event.target.value)
              }
            >
              <option value="">Não definido</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
              <option value="infantil">Infantil</option>
              <option value="unissex">Unissex</option>
            </select>
          </label>
        </section>

        <section className="admin-detail-card">
          <h2>Publicação</h2>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(event) => updateField("active", event.target.checked)}
            />
            Produto ativo na loja
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(event) =>
                updateField("featured", event.target.checked)
              }
            />
            Produto em destaque
          </label>
        </section>

        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Criando produto..." : "Criar produto"}
        </button>
      </form>
    </section>
  );
}