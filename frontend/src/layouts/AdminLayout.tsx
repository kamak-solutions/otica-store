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
      location.pathname.startsWith("/admin/categorias") ||
      location.pathname.startsWith("/admin/marcas"),
  );
  const [isCrmMenuOpen, setIsCrmMenuOpen] = useState(
    location.pathname.startsWith("/admin/crm") ||
      location.pathname.startsWith("/admin/clientes"),
  );
  const [isBlogMenuOpen, setIsBlogMenuOpen] = useState(
    location.pathname.startsWith("/admin/blog"),
  );

  // 🚀 Estado do menu dropdown de Landing Pages
  const [isLandingPagesMenuOpen, setIsLandingPagesMenuOpen] = useState(
    location.pathname.startsWith("/admin/landing-pages"),
  );

  const isBlogActive = location.pathname.startsWith("/admin/blog");

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const isStorefrontActive = location.pathname.startsWith("/admin/vitrine");

  const isProductsActive =
    location.pathname.startsWith("/admin/produtos") ||
    location.pathname.startsWith("/admin/categorias") ||
    location.pathname.startsWith("/admin/marcas");
    
  const isCrmActive =
    location.pathname.startsWith("/admin/crm") ||
    location.pathname.startsWith("/admin/clientes");

  // 🚀 Verificador de rota ativa para Landing Pages
  const isLandingPagesActive = location.pathname.startsWith("/admin/landing-pages");

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
                setIsStorefrontMenuOpen((currentValue) => !currentValue)
              }
            >
              <span>Vitrine</span>
              <strong>{isStorefrontMenuOpen ? "⌄" : "›"}</strong>
            </button>

            {isStorefrontMenuOpen && (
              <div className="admin-nav-submenu">
                <Link to="/admin/vitrine/slides">Slides principais</Link>
                <Link to="/admin/vitrine/banners">Banners secundários</Link>
                <Link to="/admin/vitrine/cores">Cores</Link>
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
                setIsProductsMenuOpen((currentValue) => !currentValue)
              }
            >
              <span>Catálogo</span>
              <strong>{isProductsMenuOpen ? "⌄" : "›"}</strong>
            </button>

            {isProductsMenuOpen && (
              <div className="admin-nav-submenu">
                <Link to="/admin/produtos">Lista de produtos</Link>
                <Link to="/admin/categorias">Categorias</Link>
                <Link to="/admin/marcas">Marcas</Link>
              </div>
            )}
          </div>

          {/* BLOG */}
          <div className="admin-nav-group">
            <button
              type="button"
              className={`admin-nav-dropdown-button ${
                isBlogActive ? "active" : ""
              }`}
              onClick={() => setIsBlogMenuOpen((currentValue) => !currentValue)}
            >
              <span>Blog</span>
              <strong>{isBlogMenuOpen ? "⌄" : "›"}</strong>
            </button>

            {isBlogMenuOpen && (
              <div className="admin-nav-submenu">
                <Link to="/admin/blog">Artigos</Link>
                <Link to="/admin/blog/novo">Novo artigo</Link>
                <Link to="/admin/blog/categorias">Categorias</Link>
              </div>
            )}
          </div>

          {/* 🚀 LANDING PAGES */}
          <div className="admin-nav-group">
            <button
              type="button"
              className={`admin-nav-dropdown-button ${
                isLandingPagesActive ? "active" : ""
              }`}
              onClick={() => setIsLandingPagesMenuOpen((currentValue) => !currentValue)}
            >
              <span>Landing Pages</span>
              <strong>{isLandingPagesMenuOpen ? "⌄" : "›"}</strong>
            </button>

            {isLandingPagesMenuOpen && (
              <div className="admin-nav-submenu">
                <Link to="/admin/landing-pages">Gerenciar LPs</Link>
                <Link to="/admin/landing-pages/nova">Nova Landing Page</Link>
              </div>
            )}
          </div>

          <Link to="/admin/pedidos">Pedidos</Link>

          {/* CRM */}
          <div className="admin-nav-group">
            <button
              type="button"
              className={`admin-nav-dropdown-button ${
                isCrmActive ? "active" : ""
              }`}
              onClick={() => setIsCrmMenuOpen((currentValue) => !currentValue)}
            >
              <span>CRM</span>
              <strong>{isCrmMenuOpen ? "⌄" : "›"}</strong>
            </button>

            {isCrmMenuOpen && (
              <div className="admin-nav-submenu">
                <Link to="/admin/crm">Dashboard CRM</Link>
                <Link to="/admin/clientes">Clientes</Link>
              </div>
            )}
          </div>

          <Link to="/admin/usuarios">Usuários</Link>
          <Link to="/admin/orcamentos">Orçamentos</Link>
          <Link to="/admin/auditoria">Auditoria</Link>
          <Link to="/admin/campanhas">Campanhas</Link>
          <Link to="/">Ver vitrine</Link>
        </nav>

        <button className="admin-logout-button" type="button" onClick={signOut}>
          Sair
        </button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}