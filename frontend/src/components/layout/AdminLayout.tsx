import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth/use-auth";

export function AdminLayout() {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <Link to="/admin/pedidos" className="admin-brand">
            Ótica ShowRoom
          </Link>
          <p>Painel administrativo</p>

          {admin && (
            <div className="admin-user-box">
              <strong>{admin.name}</strong>
              <span>{admin.role}</span>
            </div>
          )}

          <nav className="admin-nav">
            <Link to="/admin/pedidos">Pedidos</Link>
            <Link to="/">Ver loja</Link>
          </nav>
        </div>

        <button className="secondary-button" type="button" onClick={handleLogout}>
          Sair
        </button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}