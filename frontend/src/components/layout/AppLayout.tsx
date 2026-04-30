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
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <main className="page-container">
        <Outlet />
      </main>
      <footer className="site-footer" id="contato">
        <div>
          <strong>Ótica ShowRoom</strong>
          <p>
            Óculos, armações, lentes e acessórios com atendimento personalizado.
          </p>
        </div>

        <div>
          <strong>Atendimento</strong>
          <p>Envie sua receita para orçamento.</p>
          <p>Consulte disponibilidade de produtos e lentes.</p>
        </div>

        <div>
          <strong>Loja</strong>
          <p>Óculos de grau</p>
          <p>Óculos solar</p>
          <p>Lentes e acessórios</p>
        </div>
      </footer>
    </div>
  );
}
