import { Link, Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../store/auth/use-admin-auth";

export function AdminLayout() {
  const { isAuthenticated, user, signOut } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

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
          <Link to="/admin/orcamentos">Orçamentos</Link>
          <Link to="/admin/pedidos">Pedidos</Link>
          <Link to="/admin/produtos">Produtos</Link>
          <Link to="/admin/auditoria">Auditoria</Link>
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
