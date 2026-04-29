import { Link, Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <Link to="/admin/pedidos" className="admin-brand">
            Ótica ShowRoom
          </Link>
          <p>Painel administrativo</p>
        </div>

        <nav className="admin-nav">
          <Link to="/admin/pedidos">Pedidos</Link>
          <Link to="/">Ver loja</Link>
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
