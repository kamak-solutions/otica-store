import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { listAdminProducts } from "../../services/admin-products.service";
import { listAdminOrders } from "../../services/admin-orders.service";
import { listAdminQuoteRequests } from "../../services/admin-quote-requests.service";

type DashboardStats = {
  productsTotal: number;
  productsActive: number;
  productsOutOfStock: number;
  ordersTotal: number;
  ordersPending: number;
  quotesTotal: number;
  quotesPending: number;
};

const initialStats: DashboardStats = {
  productsTotal: 0,
  productsActive: 0,
  productsOutOfStock: 0,
  ordersTotal: 0,
  ordersPending: 0,
  quotesTotal: 0,
  quotesPending: 0,
};

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadDashboard() {
    try {
      setErrorMessage("");

      const [productsResponse, ordersResponse, quotesResponse] =
        await Promise.all([
          listAdminProducts(),
          listAdminOrders(),
          listAdminQuoteRequests(),
        ]);

      const products = productsResponse.data;
      const orders = ordersResponse.data;
      const quotes = quotesResponse.data;

      setStats({
        productsTotal: products.length,
        productsActive: products.filter((product) => product.active).length,
        productsOutOfStock: products.filter((product) => product.stock <= 0)
          .length,
        ordersTotal: orders.length,
        ordersPending: orders.filter((order) => order.status === "pending")
          .length,
        quotesTotal: quotes.length,
        quotesPending: quotes.filter((quote) => quote.status === "pending")
          .length,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao carregar dashboard.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>
          <h1>Dashboard</h1>
          <p>Visão geral da operação da Ótica ShowRoom.</p>
        </div>

        <button type="button" onClick={loadDashboard}>
          Atualizar
        </button>
      </div>

      {isLoading && (
        <p className="admin-state-message">Carregando dashboard...</p>
      )}

      {errorMessage && (
        <p className="admin-state-message admin-error-message">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && (
        <>
          <div className="admin-dashboard-stats">
            <article>
              <span>Produtos</span>
              <strong>{stats.productsTotal}</strong>
              <small>{stats.productsActive} ativos</small>
            </article>

            <article>
              <span>Sem estoque</span>
              <strong>{stats.productsOutOfStock}</strong>
              <small>produtos precisam atenção</small>
            </article>

            <article>
              <span>Pedidos</span>
              <strong>{stats.ordersTotal}</strong>
              <small>{stats.ordersPending} pendentes</small>
            </article>

            <article>
              <span>Orçamentos</span>
              <strong>{stats.quotesTotal}</strong>
              <small>{stats.quotesPending} pendentes</small>
            </article>
          </div>

          <div className="admin-dashboard-grid">
            <Link to="/admin/produtos">
              <span>Vitrine</span>
              <strong>Produtos</strong>
              <p>Cadastre, edite, destaque e gerencie imagens dos produtos.</p>
            </Link>

            <Link to="/admin/pedidos">
              <span>Checkout</span>
              <strong>Pedidos</strong>
              <p>Acompanhe pedidos, clientes, itens e status de atendimento.</p>
            </Link>

            <Link to="/admin/orcamentos">
              <span>Atendimento</span>
              <strong>Orçamentos</strong>
              <p>Veja solicitações com receita, filtros e status de análise.</p>
            </Link>

            <Link to="/admin/auditoria">
              <span>Segurança</span>
              <strong>Auditoria</strong>
              <p>Confira ações administrativas importantes registradas.</p>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
