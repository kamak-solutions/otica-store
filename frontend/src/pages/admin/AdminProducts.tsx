import { useEffect, useState } from "react";
import {
  deactivateAdminProduct,
  listAdminProducts,
  updateAdminProduct,
} from "../../services/admin-products.service";
import type { Product } from "../../types/product";
import { Link } from "react-router-dom";

type ProductFilter =
  | "all"
  | "active"
  | "inactive"
  | "featured"
  | "out_of_stock";

const filterLabels: Record<ProductFilter, string> = {
  all: "Todos",
  active: "Ativos",
  inactive: "Inativos",
  featured: "Destaques",
  out_of_stock: "Sem estoque",
};

const filters: ProductFilter[] = [
  "all",
  "active",
  "inactive",
  "featured",
  "out_of_stock",
];

function formatPrice(value: string | null) {
  if (!value) {
    return "-";
  }

  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getMainImage(product: Product) {
  return product.images.find((image) => image.isMain) ?? product.images[0];
}

function normalizeText(value: string | null | undefined) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState<ProductFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadProducts() {
    try {
      setErrorMessage("");
      const response = await listAdminProducts();
      setProducts(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao carregar produtos.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleFeatured(product: Product) {
    try {
      const response = await updateAdminProduct(product.id, {
        featured: !product.featured,
      });

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id ? response.data : currentProduct,
        ),
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar destaque do produto.",
      );
    }
  }

  async function handleDeactivate(product: Product) {
    const confirmed = window.confirm(
      `Deseja desativar o produto "${product.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await deactivateAdminProduct(product.id);

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id ? response.data : currentProduct,
        ),
      );
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Erro ao desativar produto.",
      );
    }
  }

  async function handleReactivate(product: Product) {
    try {
      const response = await updateAdminProduct(product.id, {
        active: true,
      });

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id ? response.data : currentProduct,
        ),
      );
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Erro ao reativar produto.",
      );
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const normalizedSearchTerm = normalizeText(searchTerm);

  const filteredProducts = products.filter((product) => {
    const matchesStatusFilter =
      activeFilter === "active"
        ? product.active
        : activeFilter === "inactive"
          ? !product.active
          : activeFilter === "featured"
            ? product.featured
            : activeFilter === "out_of_stock"
              ? product.stock <= 0
              : true;

    if (!matchesStatusFilter) {
      return false;
    }

    if (!normalizedSearchTerm) {
      return true;
    }

    const searchableText = normalizeText(
      [
        product.name,
        product.slug,
        product.sku,
        product.brand,
        product.audience,
        product.category?.name,
        product.category?.slug,
      ].join(" "),
    );

    return searchableText.includes(normalizedSearchTerm);
  });
  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>
          <h1>Produtos</h1>
          <p>Gerencie os produtos exibidos na vitrine da Ótica ShowRoom.</p>
        </div>

        <div className="admin-heading-actions">
          <Link className="admin-primary-link" to="/admin/produtos/novo">
            + Novo produto
          </Link>

          <button type="button" onClick={loadProducts}>
            Atualizar
          </button>
        </div>
      </div>
      <div className="admin-search-bar">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar por nome, SKU, slug, marca, categoria..."
        />

        {searchTerm && (
          <button type="button" onClick={() => setSearchTerm("")}>
            Limpar
          </button>
        )}
      </div>

      <div className="admin-filter-bar">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={activeFilter === filter ? "active" : ""}
            onClick={() => setActiveFilter(filter)}
          >
            {filterLabels[filter]}
          </button>
        ))}
      </div>

      {isLoading && (
        <p className="admin-state-message">Carregando produtos...</p>
      )}

      {errorMessage && (
        <p className="admin-state-message admin-error-message">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && filteredProducts.length === 0 && (
        <p className="admin-state-message">
          Nenhum produto encontrado para este filtro ou busca.
        </p>
      )}

      <div className="admin-products-grid">
        {filteredProducts.map((product) => {
          const mainImage = getMainImage(product);

          return (
            <article className="admin-product-card" key={product.id}>
              <div className="admin-product-image">
                {mainImage ? (
                  <img
                    src={mainImage.url}
                    alt={mainImage.alt ?? product.name}
                  />
                ) : (
                  <span>Sem imagem</span>
                )}

                <div className="admin-product-badges">
                  {product.featured && <span>Destaque</span>}
                  {!product.active && <span>Inativo</span>}
                  {product.stock <= 0 && <span>Sem estoque</span>}
                </div>
              </div>

              <div className="admin-product-content">
                <div className="admin-product-header">
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.slug}</span>
                  </div>
                </div>

                <p>{product.description ?? "Sem descrição."}</p>

                <div className="admin-product-meta-grid">
                  <div>
                    <span>Preço</span>
                    <strong>{formatPrice(product.price)}</strong>
                  </div>

                  <div>
                    <span>Promocional</span>
                    <strong>{formatPrice(product.salePrice)}</strong>
                  </div>

                  <div>
                    <span>Estoque</span>
                    <strong>{product.stock}</strong>
                  </div>

                  <div>
                    <span>Categoria</span>
                    <strong>{product.category?.name ?? "-"}</strong>
                  </div>
                </div>

                <div className="admin-product-actions">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(product)}
                  >
                    {product.featured ? "Remover destaque" : "Destacar"}
                  </button>

                  {product.active ? (
                    <button
                      className="danger"
                      type="button"
                      onClick={() => handleDeactivate(product)}
                    >
                      Desativar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleReactivate(product)}
                    >
                      Reativar
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
