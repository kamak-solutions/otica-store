import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addAdminProductImage,
  getAdminProductById,
  updateAdminProduct,
} from "../../services/admin-products.service";
import { getCategories } from "../../services/categories.service";
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
  audience: string;
  categoryId: string;
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
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function AdminProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imagePosition, setImagePosition] = useState("0");
  const [imageIsMain, setImageIsMain] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageErrorMessage, setImageErrorMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setErrorMessage("Produto inválido.");
        setIsLoading(false);
        return;
      }

      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          getAdminProductById(id),
          getCategories(),
        ]);

        const product = productResponse.data;

        setProduct(product);

        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          price: product.price,
          salePrice: product.salePrice ?? "",
          sku: product.sku ?? "",
          brand: product.brand ?? "",
          stock: String(product.stock),
          audience: product.audience ?? "",
          categoryId: product.category?.id ?? "",
          active: product.active,
          featured: product.featured,
        });

        setCategories(categoriesResponse.data);
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

  function updateField<K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K],
  ) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }
  async function handleAddImage(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (!id) {
      setImageErrorMessage("Produto inválido.");
      return;
    }

    setIsAddingImage(true);
    setImageErrorMessage("");

    try {
      const response = await addAdminProductImage(id, {
        url: imageUrl,
        publicId: imagePublicId || undefined,
        alt: imageAlt || undefined,
        position: Number(imagePosition),
        isMain: imageIsMain,
      });

      setProduct(response.data);
      setImageUrl("");
      setImagePublicId("");
      setImageAlt("");
      setImagePosition("0");
      setImageIsMain(false);
    } catch (error) {
      setImageErrorMessage(
        error instanceof Error ? error.message : "Erro ao adicionar imagem.",
      );
    } finally {
      setIsAddingImage(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      setErrorMessage("Produto inválido.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await updateAdminProduct(id, {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        price: formData.price,
        salePrice: formData.salePrice || undefined,
        sku: formData.sku || undefined,
        brand: formData.brand || undefined,
        stock: Number(formData.stock),
        audience: formData.audience || undefined,
        categoryId: formData.categoryId || undefined,
        active: formData.active,
        featured: formData.featured,
      });

      navigate("/admin/produtos");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao atualizar produto.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="admin-page">
        <p className="admin-state-message">Carregando produto...</p>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>
          <h1>Editar produto</h1>
          <p>Atualize as informações principais do produto.</p>
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
              onChange={(event) => updateField("name", event.target.value)}
              required
            />
          </label>

          <label>
            Slug *
            <input
              type="text"
              value={formData.slug}
              onChange={(event) =>
                updateField("slug", createSlug(event.target.value))
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
          </div>

          <label>
            Categoria
            <select
              value={formData.categoryId}
              onChange={(event) =>
                updateField("categoryId", event.target.value)
              }
            >
              <option value="">Sem categoria</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

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
        <section>
          <h2>Imagens do produto</h2>

          {product?.images.length ? (
            <div className="admin-product-edit-images">
              {product.images.map((image) => (
                <article key={image.id}>
                  <img src={image.url} alt={image.alt ?? product.name} />

                  <div>
                    <strong>{image.alt ?? "Imagem do produto"}</strong>
                    <span>
                      {image.isMain ? "Imagem principal" : "Imagem secundária"}
                    </span>
                    <small>Posição: {image.position}</small>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="admin-inline-message">
              Este produto ainda não possui imagens cadastradas.
            </p>
          )}
        </section>

        <section>
          <h2>Adicionar imagem</h2>

          {imageErrorMessage && (
            <p className="admin-state-message admin-error-message">
              {imageErrorMessage}
            </p>
          )}

          <div className="admin-product-image-form">
            <label>
              URL da imagem *
              <input
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://res.cloudinary.com/..."
                required
              />
            </label>

            <div className="admin-form-grid">
              <label>
                Public ID
                <input
                  type="text"
                  value={imagePublicId}
                  onChange={(event) => setImagePublicId(event.target.value)}
                  placeholder="otica-showroom/products/imagem"
                />
              </label>

              <label>
                Posição
                <input
                  type="number"
                  min="0"
                  value={imagePosition}
                  onChange={(event) => setImagePosition(event.target.value)}
                />
              </label>
            </div>

            <label>
              Texto alternativo
              <input
                type="text"
                value={imageAlt}
                onChange={(event) => setImageAlt(event.target.value)}
                placeholder="Ex: Armação infantil flex conforto"
              />
            </label>

            <div className="admin-checkbox-row">
              <label>
                <input
                  type="checkbox"
                  checked={imageIsMain}
                  onChange={(event) => setImageIsMain(event.target.checked)}
                />
                Definir como imagem principal
              </label>
            </div>

            <button
              className="admin-submit-button"
              type="button"
              disabled={isAddingImage || !imageUrl}
              onClick={handleAddImage}
            >
              {isAddingImage ? "Adicionando imagem..." : "Adicionar imagem"}
            </button>
          </div>
        </section>

        <button
          className="admin-submit-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando produto..." : "Salvar alterações"}
        </button>
      </form>
    </section>
  );
}
