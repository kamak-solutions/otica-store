import { useEffect, useState } from "react";
import { getAdminOrders } from "../../services/orders.service";
import type { Order, OrderStatus } from "../../types/order";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  preparing: "Em preparo",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

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

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await getAdminOrders();
        setOrders(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Erro ao carregar pedidos.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (isLoading) {
    return <p className="state-message">Carregando pedidos...</p>;
  }

  if (errorMessage) {
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
          </article>
        ))}
      </div>
    </section>
  );
}
