import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAdminAuth } from "../store/auth/use-admin-auth";

export function AdminLayout() {
  const { isAuthenticated, user, signOut } = useAdminAuth();
  const location = useLocation();

  const [isStorefrontMenuOpen, setIsStorefrontMenuOpen] = useState(
    location.pathname.startsWith("/admin/vitrine"),
  );

  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(
    location.pathname.startsWith("/admin/produtos") ||
      location.pathname.startsWith("/admin/categorias"),
  );

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const isStorefrontActive =
    location.pathname.startsWith("/admin/vitrine");

  const isProductsActive =
    location.pathname.startsWith("/admin/produtos") ||
    location.pathname.startsWith("/admin/categorias");

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-logo" to="/admin">
          Ótica Admin
        </Link>

        {user && (
          <div className="admin-user-card">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
        )}

        <nav className="admin-nav">
          <Link to="/admin">Dashboard</Link>

          {/* VITRINE */}
          <div className="admin-nav-group">
            <button
              type="button"
              className={`admin-nav-dropdown-button ${
                isStorefrontActive ? "active" : ""
              }`}
              onClick={() =>
                setIsStorefrontMenuOpen(
                  (currentValue) => !currentValue,
                )
              }
            >
              <span>Vitrine</span>
              <strong>
                {isStorefrontMenuOpen ? "⌄" : "›"}
              </strong>
            </button>

            {isStorefrontMenuOpen && (
              <div className="admin-nav-submenu">
                <Link to="/admin/vitrine/slides">
                  Slides principais
                </Link>

                <Link to="/admin/vitrine/banners">
                  Banners secundários
                </Link>

                <Link to="/admin/vitrine/cores">
                  Cores
                </Link>
              </div>
            )}
          </div>

          {/* PRODUTOS */}
          <div className="admin-nav-group">
            <button
              type="button"
              className={`admin-nav-dropdown-button ${
                isProductsActive ? "active" : ""
              }`}
              onClick={() =>
                setIsProductsMenuOpen(
                  (currentValue) => !currentValue,
                )
              }
            >
              <span>Produtos</span>
              <strong>
                {isProductsMenuOpen ? "⌄" : "›"}
              </strong>
            </button>

            {isProductsMenuOpen && (
              <div className="admin-nav-submenu">
                <Link to="/admin/produtos">
                  Lista de produtos
                </Link>

                <Link to="/admin/categorias">
                  Categorias
                </Link>
              </div>
            )}
          </div>

          <Link to="/admin/pedidos">
            Pedidos
          </Link>

          <Link to="/admin/clientes">
            Clientes
          </Link>

          <Link to="/admin/usuarios">
            Usuários
          </Link>

          <Link to="/admin/orcamentos">
            Orçamentos
          </Link>

          <Link to="/admin/auditoria">
            Auditoria
          </Link>

          <Link to="/">
            Ver vitrine
          </Link>
        </nav>

        <button
          className="admin-logout-button"
          type="button"
          onClick={signOut}
        >
          Sair
        </button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}