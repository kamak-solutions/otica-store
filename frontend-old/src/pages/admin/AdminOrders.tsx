import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAdminOrders,
  updateOrderStatus,
} from "../../services/orders.service";
import type { Order, OrderStatus } from "../../types/order";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Em preparo",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const statusOptions: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "delivered",
  "cancelled",
];

function formatCurrency(value: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await getAdminOrders();
        setOrders(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Erro ao carregar pedidos.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    try {
      setUpdatingOrderId(orderId);
      setErrorMessage("");

      const response = await updateOrderStatus(orderId, status);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? response.data : order,
        ),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar status do pedido.",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  }

  if (isLoading) {
    return <p className="state-message">Carregando pedidos...</p>;
  }

  if (errorMessage && orders.length === 0) {
    return <p className="state-message error-message">{errorMessage}</p>;
  }

  return (
    <section>
      <div className="section-heading">
        <div>
          <span className="admin-kicker">Admin</span>
          <h1>Pedidos</h1>
          <p>{orders.length} pedido(s) encontrado(s)</p>
        </div>
      </div>

      {errorMessage && <div className="error-alert">{errorMessage}</div>}

      <div className="admin-orders-list">
        {orders.map((order) => (
          <article className="admin-order-card" key={order.id}>
            <header className="admin-order-header">
              <div>
                <strong>{order.orderNumber ?? order.id}</strong>
                <span>{formatDate(order.createdAt)}</span>
              </div>

              <span className={`order-status order-status-${order.status}`}>
                {statusLabels[order.status]}
              </span>
            </header>

            <div className="admin-order-status-control">
              <label>
                Status do pedido
                <select
                  value={order.status}
                  disabled={updatingOrderId === order.id}
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

              {updatingOrderId === order.id && (
                <span className="status-updating">Atualizando...</span>
              )}
            </div>

            <div className="admin-order-body">
              <div>
                <h2>{order.customer.name}</h2>
                <p>{order.customer.email}</p>
                <p>{order.customer.phone}</p>
              </div>

              <div>
                <span>Total</span>
                <strong>{formatCurrency(order.subtotal)}</strong>
              </div>
            </div>

            <div className="admin-order-items">
              {order.items.map((item) => (
                <div key={item.id}>
                  <span>
                    {item.quantity}x {item.productName}
                  </span>
                  <strong>{formatCurrency(item.unitPrice)}</strong>
                </div>
              ))}
            </div>

            {order.notes && (
              <p className="admin-order-notes">
                <strong>Observações:</strong> {order.notes}
              </p>
            )}
            <Link
              className="product-link admin-detail-link"
              to={`/admin/pedidos/${order.id}`}
            >
              Ver detalhes
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
