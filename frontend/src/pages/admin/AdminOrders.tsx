import { useEffect, useState } from "react";
import {
  listAdminOrders,
  updateAdminOrderStatus,
  type AdminOrder,
  type OrderStatus,
} from "../../services/admin-orders.service";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready: "Pronto",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const statusOptions: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatPrice(value: string | number) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [activeStatusFilter, setActiveStatusFilter] = useState<
    OrderStatus | "all"
  >("all");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadOrders() {
    try {
      setErrorMessage("");
      const response = await listAdminOrders();
      setOrders(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao carregar pedidos.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    try {
      const response = await updateAdminOrderStatus(orderId, status);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? response.data : order,
        ),
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar status do pedido.",
      );
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders =
    activeStatusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === activeStatusFilter);

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>
          <h1>Pedidos</h1>
          <p>Acompanhe os pedidos criados pelo checkout da vitrine.</p>
        </div>

        <button type="button" onClick={loadOrders}>
          Atualizar
        </button>
      </div>

      <div className="admin-filter-bar">
        <button
          type="button"
          className={activeStatusFilter === "all" ? "active" : ""}
          onClick={() => setActiveStatusFilter("all")}
        >
          Todos
        </button>

        {statusOptions.map((status) => (
          <button
            key={status}
            type="button"
            className={activeStatusFilter === status ? "active" : ""}
            onClick={() => setActiveStatusFilter(status)}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {isLoading && <p className="admin-state-message">Carregando pedidos...</p>}

      {errorMessage && (
        <p className="admin-state-message admin-error-message">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && filteredOrders.length === 0 && (
        <p className="admin-state-message">
          Nenhum pedido encontrado para este filtro.
        </p>
      )}

      <div className="admin-order-grid">
        {filteredOrders.map((order) => (
          <article className="admin-order-card" key={order.id}>
            <div className="admin-order-card-header">
              <div>
                <strong>{order.orderNumber ?? order.id}</strong>
                <span>{formatDate(order.createdAt)}</span>
              </div>

              <span className={`admin-status-badge status-${order.status}`}>
                {statusLabels[order.status]}
              </span>
            </div>

            <div className="admin-order-customer">
              <strong>{order.customer.name}</strong>

              <p>
                {order.customer.phone} · {order.customer.email}
              </p>

              <p>
                {order.customer.street}, {order.customer.number}
                {order.customer.complement
                  ? ` - ${order.customer.complement}`
                  : ""}{" "}
                · {order.customer.district} · {order.customer.city}/
                {order.customer.state}
              </p>
            </div>

            <div className="admin-order-items">
              <strong>Itens do pedido</strong>

              {order.items.map((item) => (
                <div className="admin-order-item" key={item.id}>
                  <span>
                    {item.quantity}x {item.productName}
                  </span>

                  <strong>
                    {formatPrice(Number(item.unitPrice) * item.quantity)}
                  </strong>
                </div>
              ))}
            </div>

            {order.notes && (
              <div className="admin-quote-box">
                <strong>Observações</strong>
                <p>{order.notes}</p>
              </div>
            )}

            <div className="admin-order-footer">
              <div>
                <span>Subtotal</span>
                <strong>{formatPrice(order.subtotal)}</strong>
              </div>

              <label className="admin-status-select">
                Alterar status
                <select
                  value={order.status}
                  onChange={(event) =>
                    handleStatusChange(
                      order.id,
                      event.target.value as OrderStatus,
                    )
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
