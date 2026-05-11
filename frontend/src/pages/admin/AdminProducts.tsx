import { useEffect, useState } from "react";
import {
  deactivateAdminProduct,
  listAdminProducts,
  updateAdminProduct,
} from "../../services/admin-products.service";
import type { Product } from "../../types/product";

type ProductFilter = "all" | "active" | "inactive" | "featured" | "out_of_stock";

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

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState<ProductFilter>("all");
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
        error instanceof Error
          ? error.message
          : "Erro ao desativar produto.",
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
        error instanceof Error
          ? error.message
          : "Erro ao reativar produto.",
      );
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (activeFilter === "active") {
      return product.active;
    }

    if (activeFilter === "inactive") {
      return !product.active;
    }

    if (activeFilter === "featured") {
      return product.featured;
    }

    if (activeFilter === "out_of_stock") {
      return product.stock <= 0;
    }

    return true;
  });

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>
          <h1>Produtos</h1>
          <p>Gerencie os produtos exibidos na vitrine da Ótica ShowRoom.</p>
        </div>

        <button type="button" onClick={loadProducts}>
          Atualizar
        </button>
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
          Nenhum produto encontrado para este filtro.
        </p>
      )}

      <div className="admin-products-grid">
        {filteredProducts.map((product) => {
          const mainImage = getMainImage(product);

          return (
            <article className="admin-product-card" key={product.id}>
              <div className="admin-product-image">
                {mainImage ? (
                  <img src={mainImage.url} alt={mainImage.alt ?? product.name} />
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
