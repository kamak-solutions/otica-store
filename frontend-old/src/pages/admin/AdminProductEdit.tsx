import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../../services/categories.service";
import {
  getAdminProducts,
  updateAdminProduct,
  type UpdateAdminProductPayload,
} from "../../services/products.service";
import type { Category } from "../../types/category";
import type { Product } from "../../types/product";

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

function productToFormData(product: Product): ProductFormData {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    price: product.price,
    salePrice: product.salePrice ?? "",
    sku: product.sku ?? "",
    brand: product.brand ?? "",
    stock: String(product.stock),
    categoryId: product.category?.id ?? "",
    audience: product.audience ?? "",
    active: product.active,
    featured: product.featured,
  };
}

export function AdminProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProductFormData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productName, setProductName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setErrorMessage("Produto inválido.");
        setIsLoading(false);
        return;
      }

      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          getAdminProducts(),
          getCategories(),
        ]);

        const product = productsResponse.data.find((item) => item.id === id);

        if (!product) {
          setErrorMessage("Produto não encontrado.");
          return;
        }

        setCategories(categoriesResponse.data);
        setProductName(product.name);
        setFormData(productToFormData(product));
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Erro ao carregar produto.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

  function updateField(field: keyof ProductFormData, value: string | boolean) {
    setFormData((currentData) => {
      if (!currentData) {
        return currentData;
      }

      return {
        ...currentData,
        [field]: value,
      };
    });
  }

  function handleNameChange(value: string) {
    setFormData((currentData) => {
      if (!currentData) {
        return currentData;
      }

      return {
        ...currentData,
        name: value,
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id || !formData) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const payload: UpdateAdminProductPayload = {
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
      const response = await updateAdminProduct(id, payload);

      navigate("/admin/produtos", {
        state: {
          message: `Produto "${response.data.name}" atualizado com sucesso.`,
        },
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao atualizar produto.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p className="state-message">Carregando produto...</p>;
  }

  if (errorMessage && !formData) {
    return (
      <section className="state-message error-message">
        <p>{errorMessage}</p>
        <Link to="/admin/produtos">Voltar para produtos</Link>
      </section>
    );
  }

  if (!formData) {
    return (
      <section className="state-message">
        <p>Produto não encontrado.</p>
        <Link to="/admin/produtos">Voltar para produtos</Link>
      </section>
    );
  }

  return (
    <section>
      <Link className="back-link" to="/admin/produtos">
        ← Voltar para produtos
      </Link>

      <div className="section-heading">
        <div>
          <span className="admin-kicker">Admin</span>
          <h1>Editar produto</h1>
          <p>{productName}</p>
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
              />
            </label>
          </div>

          <label>
            Marca
            <input
              type="text"
              value={formData.brand}
              onChange={(event) => updateField("brand", event.target.value)}
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
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </section>
  );
}