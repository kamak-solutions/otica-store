import { Link, Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div>
          <Link to="/" className="brand">
            Ótica ShowRoom
          </Link>
          <p className="brand-subtitle">Óculos, armações e estilo para você</p>
        </div>

        <nav className="site-nav">
          <Link to="/">Produtos</Link>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <main className="page-container">
        <Outlet />
      </main>

      <footer className="site-footer" id="contato">
        <strong>Ótica ShowRoom</strong>
        <p>Atendimento personalizado, qualidade e confiança.</p>
      </footer>
    </div>
  );
}