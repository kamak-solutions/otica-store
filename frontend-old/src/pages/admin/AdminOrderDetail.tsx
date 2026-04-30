import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getAdminOrderById,
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

export function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!id) {
        setErrorMessage("Pedido inválido.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getAdminOrderById(id);
        setOrder(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Erro ao carregar pedido.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  async function handleStatusChange(status: OrderStatus) {
    if (!order) {
      return;
    }

    try {
      setIsUpdatingStatus(true);
      setErrorMessage("");

      const response = await updateOrderStatus(order.id, status);

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

  if (isLoading) {
    return <p className="state-message">Carregando pedido...</p>;
  }

  if (errorMessage && !order) {
    return (
      <section className="state-message error-message">
        <p>{errorMessage}</p>
        <Link to="/admin/pedidos">Voltar para pedidos</Link>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="state-message">
        <p>Pedido não encontrado.</p>
        <Link to="/admin/pedidos">Voltar para pedidos</Link>
      </section>
    );
  }

  return (
    <section>
      <Link className="back-link" to="/admin/pedidos">
        ← Voltar para pedidos
      </Link>

      <div className="admin-detail-header">
        <div>
          <span className="admin-kicker">Admin</span>
          <h1>Pedido {order.orderNumber ?? order.id}</h1>
          <p>Criado em {formatDate(order.createdAt)}</p>
        </div>

        <span className={`order-status order-status-${order.status}`}>
          {statusLabels[order.status]}
        </span>
      </div>

      {errorMessage && <div className="error-alert">{errorMessage}</div>}

      <div className="admin-detail-grid">
        <section className="admin-detail-card">
          <h2>Status do pedido</h2>

          <div className="admin-order-status-control">
            <label>
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

            {isUpdatingStatus && (
              <span className="status-updating">Atualizando...</span>
            )}
          </div>
        </section>

        <section className="admin-detail-card">
          <h2>Resumo</h2>

          <div className="admin-detail-summary-row">
            <span>Total</span>
            <strong>{formatCurrency(order.subtotal)}</strong>
          </div>

          <div className="admin-detail-summary-row">
            <span>Itens</span>
            <strong>{order.items.length}</strong>
          </div>
        </section>
      </div>

      <div className="admin-detail-grid">
        <section className="admin-detail-card">
          <h2>Cliente</h2>

          <div className="admin-detail-info-list">
            <p>
              <span>Nome</span>
              <strong>{order.customer.name}</strong>
            </p>

            <p>
              <span>E-mail</span>
              <strong>{order.customer.email}</strong>
            </p>

            <p>
              <span>Telefone</span>
              <strong>{order.customer.phone}</strong>
            </p>
          </div>
        </section>

        <section className="admin-detail-card">
          <h2>Endereço</h2>

          <div className="admin-detail-info-list">
            <p>
              <span>CEP</span>
              <strong>{order.customer.zipcode}</strong>
            </p>

            <p>
              <span>Endereço</span>
              <strong>
                {order.customer.street}, {order.customer.number}
              </strong>
            </p>

            {order.customer.complement && (
              <p>
                <span>Complemento</span>
                <strong>{order.customer.complement}</strong>
              </p>
            )}

            <p>
              <span>Bairro</span>
              <strong>{order.customer.district}</strong>
            </p>

            <p>
              <span>Cidade/Estado</span>
              <strong>
                {order.customer.city} - {order.customer.state}
              </strong>
            </p>
          </div>
        </section>
      </div>

      <section className="admin-detail-card">
        <h2>Itens do pedido</h2>

        <div className="admin-detail-items">
          {order.items.map((item) => (
            <div key={item.id}>
              <span>
                {item.quantity}x {item.productName}
              </span>

              <strong>{formatCurrency(item.unitPrice)}</strong>
            </div>
          ))}
        </div>
      </section>

      {order.notes && (
        <section className="admin-detail-card">
          <h2>Observações</h2>
          <p className="admin-order-notes">{order.notes}</p>
        </section>
      )}
    </section>
  );
}
