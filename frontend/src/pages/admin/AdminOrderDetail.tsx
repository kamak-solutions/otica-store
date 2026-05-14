import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getAdminOrderById,
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

export function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadOrder() {
    if (!id) {
      setErrorMessage("Pedido inválido.");
      setIsLoading(false);
      return;
    }

    try {
      setErrorMessage("");

      const response = await getAdminOrderById(id);

      setOrder(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao carregar pedido.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(status: OrderStatus) {
    if (!order) {
      return;
    }

    try {
      setIsUpdatingStatus(true);
      setErrorMessage("");

      const response = await updateAdminOrderStatus(order.id, status);

      setOrder(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar status do pedido.",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (isLoading) {
    return (
      <section className="admin-page">
        <p className="admin-state-message">Carregando pedido...</p>
      </section>
    );
  }

  if (errorMessage || !order) {
    return (
      <section className="admin-page">
        <div className="admin-page-heading">
          <div>
            <span>Admin</span>
            <h1>Pedido não encontrado</h1>
            <p>{errorMessage || "Não foi possível encontrar este pedido."}</p>
          </div>
        </div>

        <Link className="button-secondary" to="/admin/pedidos">
          Voltar para pedidos
        </Link>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Pedido</span>
          <h1>{order.orderNumber ?? order.id}</h1>
          <p>Criado em {formatDate(order.createdAt)}</p>
        </div>

        <Link className="button-secondary" to="/admin/pedidos">
          Voltar para pedidos
        </Link>
      </div>

      {errorMessage && (
        <p className="admin-state-message admin-error-message">
          {errorMessage}
        </p>
      )}

      <div className="admin-order-detail-grid">
        <article className="admin-order-detail-card">
          <h2>Status do pedido</h2>

          <span className={`admin-status-badge status-${order.status}`}>
            {statusLabels[order.status]}
          </span>

          <label className="admin-status-select">
            Alterar status
            <select
              value={order.status}
              disabled={isUpdatingStatus}
              onChange={(event) =>
                handleStatusChange(event.target.value as OrderStatus)
              }
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </label>

          <div className="admin-order-detail-total">
            <span>Subtotal</span>
            <strong>{formatPrice(order.subtotal)}</strong>
          </div>
          <div className="admin-order-detail-payment">
            <h3>Pagamento</h3>

            <p>
              <strong>Status:</strong> {order.paymentStatus}
            </p>

            <p>
              <strong>Método:</strong>{" "}
              {order.paymentMethod ?? "Ainda não definido"}
            </p>

            <p>
              <strong>Provedor:</strong>{" "}
              {order.paymentProvider ?? "Ainda não definido"}
            </p>

            {order.paymentUrl && (
              <p>
                <strong>Link:</strong>{" "}
                <a href={order.paymentUrl} target="_blank" rel="noreferrer">
                  Abrir pagamento
                </a>
              </p>
            )}

            <p>
              <strong>Pago em:</strong>{" "}
              {order.paidAt ? formatDate(order.paidAt) : "Ainda não pago"}
            </p>
          </div>

          <div className="admin-order-detail-payment">
            <h3>Entrega/Frete</h3>

            <p>
              <strong>Status:</strong> {order.shippingStatus ?? "not_required"}
            </p>

            <p>
              <strong>Método:</strong>{" "}
              {order.shippingMethod ?? "Ainda não definido"}
            </p>

            <p>
              <strong>Valor:</strong>{" "}
              {order.shippingPrice
                ? formatPrice(order.shippingPrice)
                : "Ainda não definido"}
            </p>
          </div>
        </article>

        <article className="admin-order-detail-card">
          <h2>Cliente</h2>

          <p>
            <strong>Nome:</strong> {order.customer.name}
          </p>
          <p>
            <strong>E-mail:</strong> {order.customer.email}
          </p>
          <p>
            <strong>Telefone:</strong> {order.customer.phone}
          </p>
        </article>

        <article className="admin-order-detail-card">
          <h2>Endereço</h2>

          <p>
            {order.customer.street}, {order.customer.number}
            {order.customer.complement ? ` - ${order.customer.complement}` : ""}
          </p>
          <p>
            {order.customer.district} · {order.customer.city}/
            {order.customer.state}
          </p>
          <p>CEP: {order.customer.zipcode}</p>
        </article>

        <article className="admin-order-detail-card admin-order-detail-items">
          <h2>Itens</h2>

          {order.items.map((item) => (
            <div className="admin-order-detail-item" key={item.id}>
              <div>
                <strong>{item.productName}</strong>
                <span>
                  {item.quantity} x {formatPrice(item.unitPrice)}
                </span>
              </div>

              <strong>
                {formatPrice(Number(item.unitPrice) * item.quantity)}
              </strong>
            </div>
          ))}
        </article>

        {order.notes && (
          <article className="admin-order-detail-card admin-order-detail-notes">
            <h2>Observações</h2>
            <p>{order.notes}</p>
          </article>
        )}
      </div>
    </section>
  );
}
