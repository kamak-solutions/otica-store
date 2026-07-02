import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdminProduct } from "../../services/admin-products.service";
import { getCategories } from "../../services/categories.service";
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
  productType: string;
  frameUse: string;
  frameShape: string;
  color: string;
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
  brand: "",
  stock: "0",
  audience: "",
  productType: "",
  frameUse: "",
  frameShape: "",
  color: "",
  categoryId: "",
  active: true,
  featured: false,
};

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

export function AdminProductCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
  const parentCategories = categories.filter((category) => !category.parent);

  const childCategories = categories.filter(
    (category) => category.parent?.id === selectedParentCategory,
  );

  function updateField<K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K],
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
      slug: createSlug(value),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await createAdminProduct({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        price: formData.price,
        salePrice: formData.salePrice || undefined,
        sku: formData.sku || undefined,
        brand: formData.brand || undefined,
        stock: Number(formData.stock),
        audience: formData.audience || undefined,
        productType: formData.productType || undefined,
        frameUse: formData.frameUse || undefined,
        frameShape: formData.frameShape || undefined,
        color: formData.color || undefined,
        categoryId: formData.categoryId || undefined,
        active: formData.active,
        featured: formData.featured,
      });

      navigate("/admin/produtos");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao criar produto.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>
          <h1>Novo produto</h1>
          <p>Cadastre um novo produto para exibir na vitrine.</p>
        </div>

        <button type="button" onClick={() => navigate("/admin/produtos")}>
          Voltar
        </button>
      </div>

      {errorMessage && (
        <p className="admin-state-message admin-error-message">
          {errorMessage}
        </p>
      )}

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <section>
          <h2>Informações principais</h2>

          <label>
            Nome *
            <input
              type="text"
              value={formData.name}
              onChange={(event) => handleNameChange(event.target.value)}
              required
            />
          </label>

          <label>
            Slug *
            <input
              type="text"
              value={formData.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              onBlur={() => updateField("slug", createSlug(formData.slug))}
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
              rows={5}
            />
          </label>
        </section>

        <section>
          <h2>Preço e estoque</h2>

          <div className="admin-form-grid">
            <label>
              Preço *
              <input
                type="text"
                value={formData.price}
                onChange={(event) => updateField("price", event.target.value)}
                placeholder="199.90"
                required
              />
            </label>

            <label>
              Preço promocional
              <input
                type="text"
                value={formData.salePrice}
                onChange={(event) =>
                  updateField("salePrice", event.target.value)
                }
                placeholder="159.90"
              />
            </label>
          </div>

          <div className="admin-form-grid">
            <label>
              Estoque *
              <input
                type="number"
                min="0"
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
        </section>

        <section>
          <h2>Classificação</h2>

          <div className="admin-form-grid">
            <label>
              Marca
              <input
                type="text"
                value={formData.brand}
                onChange={(event) => updateField("brand", event.target.value)}
              />
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
            <label>
              Tipo do produto
              <select
                value={formData.productType}
                onChange={(event) =>
                  updateField("productType", event.target.value)
                }
              >
                <option value="">Não definido</option>
                <option value="frame">Armação</option>
                <option value="lens">Lente</option>
                <option value="sunglasses">Óculos de sol</option>
                <option value="contact_lens">Lente de contato</option>
                <option value="accessory">Acessório</option>
              </select>
            </label>
          </div>
          <div className="admin-form-grid">
            <label>
              Formato da armação
              <select
                value={formData.frameShape}
                onChange={(event) =>
                  updateField("frameShape", event.target.value)
                }
              >
                <option value="">Não definido</option>
                <option value="redondo">Redondo</option>
                <option value="gatinho">Gatinho</option>
                <option value="quadrado">Quadrado</option>
                <option value="retangular">Retangular</option>
                <option value="aviador">Aviador</option>
                <option value="oval">Oval</option>
              </select>
            </label>

            <label>
              Cor
              <input
                type="text"
                value={formData.color}
                onChange={(event) => updateField("color", event.target.value)}
                placeholder="Preto, dourado, transparente..."
              />
            </label>
          </div>

          <div className="admin-form-grid">
            <label>
              Categoria principal
              <select
                value={selectedParentCategory}
                onChange={(event) => {
                  setSelectedParentCategory(event.target.value);

                  updateField("categoryId", "");
                }}
              >
                <option value="">
                  {selectedParentCategory
                    ? "Nenhuma subcategoria"
                    : "Selecione"}
                </option>

                {parentCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Subcategoria
              <select
                value={formData.categoryId}
                onChange={(event) =>
                  updateField("categoryId", event.target.value)
                }
                disabled={
                  !selectedParentCategory || childCategories.length === 0
                }
              >
                <option value="">Selecione</option>

                {childCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="admin-checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(event) =>
                  updateField("active", event.target.checked)
                }
              />
              Produto ativo
            </label>

            <label>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(event) =>
                  updateField("featured", event.target.checked)
                }
              />
              Produto em destaque
            </label>
          </div>
        </section>

        <button
          className="admin-submit-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Criando produto..." : "Criar produto"}
        </button>
      </form>
    </section>
  );
}
