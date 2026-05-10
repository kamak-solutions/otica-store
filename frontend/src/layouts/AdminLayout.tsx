import { Link, Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-logo" to="/admin/orcamentos">
          Ótica Admin
        </Link>

        <nav className="admin-nav">
          <Link to="/admin/orcamentos">Orçamentos</Link>
          <Link to="/">Ver vitrine</Link>
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
