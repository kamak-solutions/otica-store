import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Seo } from "../../components/seo/Seo";
import { getProducts } from "../../services/products.service";
import type { Product } from "../../types/product";
import { getCategories } from "../../services/categories.service";
import type { Category } from "../../types/category";

const audienceOptions = [
  { label: "Todos", value: "todos" },
  { label: "Feminino", value: "feminino" },
  { label: "Masculino", value: "masculino" },
  { label: "Infantil", value: "infantil" },
  { label: "Unissex", value: "unissex" },
];

function formatPrice(value: string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getMainImage(product: Product) {
  return product.images.find((image) => image.isMain) ?? product.images[0];
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("busca") ?? "");

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("categoria") ?? "todos",
  );

  const [selectedAudience, setSelectedAudience] = useState(
    searchParams.get("publico") ?? "todos",
  );

  const [selectedType, setSelectedType] = useState(
    searchParams.get("tipo") ?? "todos",
  );
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Erro ao carregar produtos.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);
  useEffect(() => {
    setSelectedCategory(searchParams.get("categoria") ?? "todos");

    setSelectedAudience(searchParams.get("publico") ?? "todos");

    setSelectedType(searchParams.get("tipo") ?? "todos");

    setSearchTerm(searchParams.get("busca") ?? "");
  }, [searchParams]);
  const productTypeOptions = useMemo(() => {
    return [
      { label: "Todos", value: "todos" },

      ...Array.from(
        new Set(products.map((product) => product.productType).filter(Boolean)),
      ).map((type) => ({
        label: type!,
        value: type!,
      })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm.trim());

    return products.filter((product) => {
      if (onlyAvailable && (!product.active || product.stock <= 0)) {
        return false;
      }

      if (onlyFeatured && !product.featured) {
        return false;
      }

      if (
        selectedCategory !== "todos" &&
        product.category?.slug !== selectedCategory
      ) {
        return false;
      }

      if (
        selectedAudience !== "todos" &&
        product.audience !== selectedAudience
      ) {
        return false;
      }

      if (normalizedSearch) {
        const searchableText = normalizeText(
          [
            product.name,
            product.description ?? "",
            product.brand ?? "",
            product.category?.name ?? "",
            product.audience ?? "",
            product.productType ?? "",
          ].join(" "),
        );

        if (!searchableText.includes(normalizedSearch)) {
          return false;
        }
      }
      if (selectedType !== "todos" && product.productType !== selectedType) {
        return false;
      }

      return true;
    });
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedAudience,
    selectedType,
    onlyFeatured,
    onlyAvailable,
  ]);

  return (
    <main className="products-page">
      <Seo
        title="Produtos | Ótica ShowRoom"
        description="Veja armações, óculos solares e óculos de grau infantis, femininos, masculinos e unissex na Ótica ShowRoom."
      />

      <section className="site-container products-hero">
        <span>Produtos</span>
        <h1>Armações e óculos para todos os estilos</h1>
        <p>
          Explore armações infantis, femininas, masculinas, solares e de grau
          com atendimento personalizado para escolher melhor.
        </p>
      </section>

      <section className="site-container products-layout">
        <aside className="products-filters">
          <div>
            <label htmlFor="product-search">Buscar produto</label>
            <input
              id="product-search"
              type="search"
              placeholder="Ex: infantil, solar, feminino..."
              value={searchTerm}
              onChange={(event) => {
                const value = event.target.value;

                setSearchTerm(value);

                const nextParams = new URLSearchParams(searchParams);

                if (!value.trim()) {
                  nextParams.delete("busca");
                } else {
                  nextParams.set("busca", value);
                }

                setSearchParams(nextParams);
              }}
            />
          </div>

          <div>
            <label htmlFor="product-category">Categoria</label>
            <select
              id="product-category"
              value={selectedCategory}
              onChange={(event) => {
                const value = event.target.value;

                setSelectedCategory(value);

                const nextParams = new URLSearchParams(searchParams);

                if (value === "todos") {
                  nextParams.delete("categoria");
                } else {
                  nextParams.set("categoria", value);
                }

                setSearchParams(nextParams);
              }}
            >
              <option value="todos">Todos</option>

              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="product-type">Tipo / Modelo</label>

            <select
              id="product-type"
              value={selectedType}
              onChange={(event) => {
                const value = event.target.value;

                setSelectedType(value);

                const nextParams = new URLSearchParams(searchParams);

                if (value === "todos") {
                  nextParams.delete("tipo");
                } else {
                  nextParams.set("tipo", value);
                }

                setSearchParams(nextParams);
              }}
            >
              {productTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="product-audience">Público</label>

            <select
              id="product-audience"
              value={selectedAudience}
              onChange={(event) => {
                const value = event.target.value;

                setSelectedAudience(value);

                const nextParams = new URLSearchParams(searchParams);

                if (value === "todos") {
                  nextParams.delete("publico");
                } else {
                  nextParams.set("publico", value);
                }

                setSearchParams(nextParams);
              }}
            >
              {audienceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <label className="products-checkbox">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(event) => setOnlyAvailable(event.target.checked)}
            />
            Mostrar apenas disponíveis
          </label>

          <label className="products-checkbox">
            <input
              type="checkbox"
              checked={onlyFeatured}
              onChange={(event) => setOnlyFeatured(event.target.checked)}
            />
            Mostrar apenas destaques
          </label>

          <button
            type="button"
            className="products-clear-button"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("todos");
              setSelectedAudience("todos");
              setOnlyFeatured(false);
              setOnlyAvailable(true);
              setSearchParams({});
              setSelectedType("todos");
            }}
          >
            Limpar filtros
          </button>
        </aside>

        <div className="products-results">
          <div className="products-results-heading">
            <div>
              <span>{filteredProducts.length} produto(s)</span>
              <h2>Catálogo de armações e óculos</h2>
            </div>
          </div>

          {errorMessage && (
            <p className="section-empty-message">{errorMessage}</p>
          )}

          {isLoading && (
            <p className="section-empty-message">Carregando produtos...</p>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <p className="section-empty-message">
              Nenhum produto encontrado para os filtros selecionados.
            </p>
          )}

          <div className="products-grid">
            {filteredProducts.map((product) => {
              const mainImage = getMainImage(product);
              const displayPrice = product.salePrice ?? product.price;

              return (
                <article className="products-card" key={product.id}>
                  <Link to={`/produtos/${product.slug}`}>
                    {mainImage ? (
                      <img
                        src={mainImage.url}
                        alt={mainImage.alt ?? product.name}
                      />
                    ) : (
                      <div className="products-card-placeholder">
                        Sem imagem
                      </div>
                    )}
                  </Link>

                  <div className="products-card-content">
                    <div className="products-card-tags">
                      {product.category && <span>{product.category.name}</span>}

                      {product.audience && <span>{product.audience}</span>}

                      {product.productType && (
                        <span>{product.productType}</span>
                      )}
                    </div>

                    <h3>{product.name}</h3>

                    {product.description && <p>{product.description}</p>}

                    <div className="products-card-price">
                      {product.salePrice && (
                        <span>{formatPrice(product.price)}</span>
                      )}

                      <strong>{formatPrice(displayPrice)}</strong>
                    </div>

                    <Link
                      className="button-primary"
                      to={`/produtos/${product.slug}`}
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
