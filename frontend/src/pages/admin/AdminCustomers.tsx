import { useEffect, useMemo, useState } from "react";
import {
  listAdminCustomers,
  type AdminCustomer,
} from "../../services/admin-customers.service";

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatBirthDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(value));
}

function formatPrice(value: string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadCustomers() {
    try {
      setErrorMessage("");

      const response = await listAdminCustomers();

      setCustomers(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao carregar clientes.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return customers;
    }

    return customers.filter((customer) => {
      return [
        customer.name,
        customer.email,
        customer.phone,
        customer.cpf ?? "",
        customer.address.city,
        customer.address.state,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [customers, searchTerm]);

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>
          <h1>Clientes</h1>
          <p>
            Consulte clientes criados pelo checkout, com CPF mascarado e
            consentimento LGPD.
          </p>
        </div>

        <button type="button" onClick={loadCustomers}>
          Atualizar
        </button>
      </div>

      <div className="admin-toolbar">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar por nome, e-mail, telefone, CPF ou cidade..."
        />
      </div>

      {isLoading && (
        <p className="admin-state-message">Carregando clientes...</p>
      )}

      {errorMessage && (
        <p className="admin-state-message admin-error-message">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && filteredCustomers.length === 0 && (
        <p className="admin-state-message">Nenhum cliente encontrado.</p>
      )}

      <div className="admin-customers-list">
        {filteredCustomers.map((customer) => (
          <article className="admin-customer-card" key={customer.id}>
            <div className="admin-customer-header">
              <div>
                <strong>{customer.name}</strong>
                <span>{customer.email}</span>
              </div>

              <span className="admin-customer-orders-count">
                {customer.orders.length} pedido(s)
              </span>
            </div>

            <div className="admin-customer-grid">
              <p>
                <strong>Telefone:</strong> {customer.phone}
              </p>

              <p>
                <strong>CPF:</strong> {customer.cpf ?? "Não informado"}
              </p>

              <p>
                <strong>Nascimento:</strong>{" "}
                {formatBirthDate(customer.birthDate)}
              </p>

              <p>
                <strong>Cidade/UF:</strong> {customer.address.city}/
                {customer.address.state}
              </p>

              <p>
                <strong>Endereço:</strong> {customer.address.street},{" "}
                {customer.address.number} - {customer.address.district}
              </p>

              <p>
                <strong>Cadastrado em:</strong> {formatDate(customer.createdAt)}
              </p>
            </div>

            <div className="admin-customer-lgpd">
              <strong>LGPD</strong>
              <span>
                {customer.lgpd.acceptedAt
                  ? `Aceito em ${formatDate(customer.lgpd.acceptedAt)} via ${
                      customer.lgpd.consentSource ?? "-"
                    }`
                  : "Consentimento não registrado"}
              </span>
            </div>

            {customer.orders.length > 0 && (
              <div className="admin-customer-orders">
                <strong>Últimos pedidos</strong>

                {customer.orders.slice(0, 3).map((order) => (
                  <div key={order.id}>
                    <span>{order.orderNumber ?? order.id}</span>
                    <span>{order.status}</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
