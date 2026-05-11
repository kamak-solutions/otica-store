import { useEffect, useState } from "react";
import {
  listAdminQuoteRequests,
  updateAdminQuoteRequestStatus,
  type AdminQuoteRequest,
  type QuoteRequestStatus,
} from "../../services/admin-quote-requests.service";

const statusLabels: Record<QuoteRequestStatus, string> = {
  pending: "Pendente",
  in_analysis: "Em análise",
  quoted: "Orçamento enviado",
  converted: "Convertido",
  cancelled: "Cancelado",
};

const requestTypeLabels: Record<string, string> = {
  "oculos-completo": "Óculos completo",
  lentes: "Somente lentes",
  armacao: "Somente armação",
  multifocal: "Lentes multifocais",
  conserto: "Conserto / ajuste",
  outro: "Outro atendimento",
};

const statusOptions: QuoteRequestStatus[] = [
  "pending",
  "in_analysis",
  "quoted",
  "converted",
  "cancelled",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminQuoteRequests() {
  const [quoteRequests, setQuoteRequests] = useState<AdminQuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadQuoteRequests() {
    try {
      setErrorMessage("");
      const response = await listAdminQuoteRequests();
      setQuoteRequests(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao carregar solicitações de orçamento.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(
    quoteRequestId: string,
    status: QuoteRequestStatus,
  ) {
    try {
      const response = await updateAdminQuoteRequestStatus(
        quoteRequestId,
        status,
      );

      setQuoteRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === quoteRequestId ? response.data : request,
        ),
      );
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Erro ao atualizar status.",
      );
    }
  }

  useEffect(() => {
    loadQuoteRequests();
  }, []);

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>
          <h1>Solicitações de orçamento</h1>
          <p>
            Acompanhe os pedidos de orçamento enviados pela página de receita.
          </p>
        </div>

        <button type="button" onClick={loadQuoteRequests}>
          Atualizar
        </button>
      </div>

      {isLoading && (
        <p className="admin-state-message">Carregando solicitações...</p>
      )}

      {errorMessage && (
        <p className="admin-state-message admin-error-message">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && quoteRequests.length === 0 && (
        <p className="admin-state-message">
          Nenhuma solicitação de orçamento encontrada.
        </p>
      )}

      <div className="admin-quote-grid">
        {quoteRequests.map((quoteRequest) => (
          <article className="admin-quote-card" key={quoteRequest.id}>
            <div className="admin-quote-card-header">
              <div>
                <strong>{quoteRequest.customerName}</strong>
                <span>{formatDate(quoteRequest.createdAt)}</span>
              </div>

              <span
                className={`admin-status-badge status-${quoteRequest.status}`}
              >
                {statusLabels[quoteRequest.status]}
              </span>
            </div>

            <div className="admin-quote-info">
              <p>
                <strong>Tipo:</strong>{" "}
                {requestTypeLabels[quoteRequest.requestType] ??
                  quoteRequest.requestType}
              </p>

              <p>
                <strong>Telefone:</strong> {quoteRequest.customerPhone}
              </p>

              {quoteRequest.customerEmail && (
                <p>
                  <strong>E-mail:</strong> {quoteRequest.customerEmail}
                </p>
              )}
            </div>

            {quoteRequest.prescriptionText && (
              <div className="admin-quote-box">
                <strong>Receita</strong>
                <p>{quoteRequest.prescriptionText}</p>
              </div>
            )}
            {quoteRequest.prescriptionFileUrl && (
              <div className="admin-quote-box">
                <strong>Arquivo da receita</strong>

                <p>O cliente enviou um arquivo de receita para análise.</p>

                <a
                  className="admin-quote-file-link"
                  href={quoteRequest.prescriptionFileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver receita
                </a>
              </div>
            )}

            {quoteRequest.notes && (
              <div className="admin-quote-box">
                <strong>Observações</strong>
                <p>{quoteRequest.notes}</p>
              </div>
            )}

            <label className="admin-status-select">
              Alterar status
              <select
                value={quoteRequest.status}
                onChange={(event) =>
                  handleStatusChange(
                    quoteRequest.id,
                    event.target.value as QuoteRequestStatus,
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
          </article>
        ))}
      </div>
    </section>
  );
}
