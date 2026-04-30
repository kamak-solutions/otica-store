
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  addProductImage,
  deactivateAdminProduct,
  getAdminProducts,
  reactivateAdminProduct,
} from "../../services/products.service";
import type { Product } from "../../types/product";

type ImageFormState = {
  url: string;
  publicId: string;
  alt: string;
  position: string;
  isMain: boolean;
};

const initialImageForm: ImageFormState = {
  url: "",
  publicId: "",
  alt: "",
  position: "0",
  isMain: true,
};

function getMainImage(product: Product) {
  return product.images.find((image) => image.isMain) ?? product.images[0];
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [imageForms, setImageForms] = useState<Record<string, ImageFormState>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [savingProductId, setSavingProductId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await getAdminProducts();
        setProducts(response.data);

        const forms = response.data.reduce<Record<string, ImageFormState>>(
          (acc, product) => {
            acc[product.id] = {
              ...initialImageForm,
              alt: product.name,
            };

            return acc;
          },
          {},
        );

        setImageForms(forms);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Erro ao carregar produtos.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  function updateImageForm(
    productId: string,
    field: keyof ImageFormState,
    value: string | boolean,
  ) {
    setImageForms((currentForms) => ({
      ...currentForms,
      [productId]: {
        ...currentForms[productId],
        [field]: value,
      },
    }));
  }
  const location = useLocation();
  const routeMessage = location.state as { message?: string } | null;

  async function handleAddImage(product: Product) {
    const form = imageForms[product.id];

    if (!form?.url) {
      setErrorMessage("Informe a URL da imagem.");
      return;
    }

    try {
      setSavingProductId(product.id);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await addProductImage(product.id, {
        url: form.url,
        publicId: form.publicId || undefined,
        alt: form.alt || product.name,
        position: Number(form.position) || 0,
        isMain: form.isMain,
      });

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id ? response.data : currentProduct,
        ),
      );

      setImageForms((currentForms) => ({
        ...currentForms,
        [product.id]: {
          ...initialImageForm,
          alt: product.name,
        },
      }));

      setSuccessMessage("Imagem adicionada com sucesso.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao adicionar imagem.",
      );
    } finally {
      setSavingProductId(null);
    }
  }

  if (isLoading) {
    return <p className="state-message">Carregando produtos...</p>;
  }

  if (errorMessage && products.length === 0) {
    return <p className="state-message error-message">{errorMessage}</p>;
  }

  async function handleDeactivateProduct(product: Product) {
    const confirmDeactivate = window.confirm(
      `Tem certeza que deseja desativar o produto "${product.name}"?`,
    );

    if (!confirmDeactivate) {
      return;
    }

    try {
      setSavingProductId(product.id);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await deactivateAdminProduct(product.id);

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id ? response.data : currentProduct,
        ),
      );

      setSuccessMessage(
        `Produto "${response.data.name}" desativado com sucesso.`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao desativar produto.",
      );
    } finally {
      setSavingProductId(null);
    }
  }
  async function handleReactivateProduct(product: Product) {
    try {
      setSavingProductId(product.id);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await reactivateAdminProduct(product.id);

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id ? response.data : currentProduct,
        ),
      );

      setSuccessMessage(
        `Produto "${response.data.name}" reativado com sucesso.`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao reativar produto.",
      );
    } finally {
      setSavingProductId(null);
    }
  }

  return (
    <section>
      <div className="section-heading">
        <div>
          <span className="admin-kicker">Admin</span>
          <h1>Produtos</h1>
          <p>{products.length} produto(s) encontrado(s)</p>
        </div>

        <Link
          className="primary-button admin-heading-action"
          to="/admin/produtos/novo"
        >
          Novo produto
        </Link>
      </div>
      {routeMessage?.message && (
        <div className="success-message">{routeMessage.message}</div>
      )}
      {errorMessage && <div className="error-alert">{errorMessage}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="admin-products-list">
        {products.map((product) => {
          const mainImage = getMainImage(product);
          const form = imageForms[product.id] ?? initialImageForm;

          return (
            <article className="admin-product-card" key={product.id}>
              <div className="admin-product-preview">
                {mainImage ? (
                  <img
                    src={mainImage.url}
                    alt={mainImage.alt ?? product.name}
                  />
                ) : (
                  <span>Sem imagem</span>
                )}
              </div>

              <div className="admin-product-content">
                <div className="admin-product-header">
                  <div>
                    <h2>{product.name}</h2>
                    <p>{product.slug}</p>
                  </div>

                  <span
                    className={product.active ? "active-pill" : "inactive-pill"}
                  >
                    {product.active ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <p className="admin-product-price">
                  R$ {product.salePrice ?? product.price}
                </p>

                <div className="admin-image-form">
                  <h3>Adicionar imagem</h3>

                  <label>
                    URL da imagem
                    <input
                      type="url"
                      placeholder="https://res.cloudinary.com/..."
                      value={form.url}
                      onChange={(event) =>
                        updateImageForm(product.id, "url", event.target.value)
                      }
                    />
                  </label>

                  <div className="form-grid">
                    <label>
                      Public ID
                      <input
                        type="text"
                        placeholder="pasta/imagem"
                        value={form.publicId}
                        onChange={(event) =>
                          updateImageForm(
                            product.id,
                            "publicId",
                            event.target.value,
                          )
                        }
                      />
                    </label>

                    <label>
                      Posição
                      <input
                        type="number"
                        min="0"
                        value={form.position}
                        onChange={(event) =>
                          updateImageForm(
                            product.id,
                            "position",
                            event.target.value,
                          )
                        }
                      />
                    </label>
                  </div>

                  <label>
                    Texto alternativo
                    <input
                      type="text"
                      value={form.alt}
                      onChange={(event) =>
                        updateImageForm(product.id, "alt", event.target.value)
                      }
                    />
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.isMain}
                      onChange={(event) =>
                        updateImageForm(
                          product.id,
                          "isMain",
                          event.target.checked,
                        )
                      }
                    />
                    Definir como imagem principal
                  </label>

                  <button
                    className="primary-button"
                    type="button"
                    disabled={savingProductId === product.id}
                    onClick={() => handleAddImage(product)}
                  >
                    {savingProductId === product.id
                      ? "Salvando..."
                      : "Adicionar imagem"}
                  </button>
                  <div className="admin-product-actions">
                    <Link
                      className="secondary-button admin-edit-product-link"
                      to={`/admin/produtos/${product.id}/editar`}
                    >
                      Editar produto
                    </Link>

                    {product.active ? (
                      <button
                        className="danger-button"
                        type="button"
                        disabled={savingProductId === product.id}
                        onClick={() => handleDeactivateProduct(product)}
                      >
                        {savingProductId === product.id
                          ? "Desativando..."
                          : "Desativar"}
                      </button>
                    ) : (
                      <button
                        className="secondary-button"
                        type="button"
                        disabled={savingProductId === product.id}
                        onClick={() => handleReactivateProduct(product)}
                      >
                        {savingProductId === product.id
                          ? "Reativando..."
                          : "Reativar"}
                      </button>
                    )}
                  </div>
                </div>

                {product.images.length > 0 && (
                  <div className="admin-product-images">
                    <h3>Imagens cadastradas</h3>

                    <div>
                      {product.images.map((image) => (
                        <img
                          key={image.id}
                          src={image.url}
                          alt={image.alt ?? product.name}
                          title={image.isMain ? "Principal" : "Imagem"}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
