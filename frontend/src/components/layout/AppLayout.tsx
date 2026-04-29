import { Link, Outlet } from "react-router-dom";
import { useCart } from "../../store/cart/use-cart";

export function AppLayout() {
  const { totalItems } = useCart();

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
          <Link to="/carrinho">Carrinho ({totalItems})</Link>
          <Link to="/admin/pedidos">Admin Pedidos</Link>
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
