import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { deleteBrand, listBrands, type Brand } from "../../services/brands.service";

export function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);

  async function loadBrands() {
    const response = await listBrands();
    setBrands(response.data);
  }

  useEffect(() => {
    loadBrands();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Deseja desativar esta marca?");

    if (!confirmed) return;

    await deleteBrand(id);
    await loadBrands();
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Catálogo</span>
          <h1>Marcas</h1>
          <p>Gerencie as marcas usadas no catálogo óptico.</p>
        </div>

        <Link to="/admin/marcas/nova">
          <button type="button">Nova marca</button>
        </Link>
      </div>

      <div className="admin-table-card">
        {brands.map((brand) => (
          <article className="admin-list-row" key={brand.id}>
            <div>
              <strong>{brand.name}</strong>
              <span>{brand.slug}</span>
            </div>

            <div className="admin-list-actions">
              <Link to={`/admin/marcas/${brand.id}/editar`}>
                Editar
              </Link>

              <button type="button" onClick={() => handleDelete(brand.id)}>
                Desativar
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}