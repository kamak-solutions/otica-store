import { useEffect, useState } from "react";
import {
  listAdminAuditLogs,
  type AdminAuditLog,
} from "../../services/admin-audit-logs.service";

const actionLabels: Record<string, string> = {
  "quote_request.status_updated": "Status de orçamento atualizado",
  "order.status_updated": "Status de pedido atualizado",
};
function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMetadata(metadata: unknown) {
  if (!metadata) {
    return "Sem detalhes";
  }

  return JSON.stringify(metadata, null, 2);
}

export function AdminAuditLogs() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadLogs() {
    try {
      setErrorMessage("");
      const response = await listAdminAuditLogs();
      setLogs(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao carregar logs de auditoria.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>
          <h1>Auditoria</h1>
          <p>Veja ações importantes realizadas no painel administrativo.</p>
        </div>

        <button type="button" onClick={loadLogs}>
          Atualizar
        </button>
      </div>

      {isLoading && <p className="admin-state-message">Carregando logs...</p>}

      {errorMessage && (
        <p className="admin-state-message admin-error-message">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && logs.length === 0 && (
        <p className="admin-state-message">Nenhum log encontrado.</p>
      )}

      <div className="admin-audit-list">
        {logs.map((log) => (
          <article className="admin-audit-card" key={log.id}>
            <div className="admin-audit-header">
              <div>
                <strong>{actionLabels[log.action] ?? log.action}</strong>
                <span>{formatDate(log.createdAt)}</span>
              </div>

              <span className="admin-audit-entity">{log.entity}</span>
            </div>

            <div className="admin-audit-grid">
              <p>
                <strong>Admin:</strong> {log.adminEmail ?? "Não identificado"}
              </p>

              <p>
                <strong>Role:</strong> {log.adminRole ?? "-"}
              </p>

              <p>
                <strong>Entidade ID:</strong> {log.entityId ?? "-"}
              </p>
            </div>

            <pre>{formatMetadata(log.metadata)}</pre>
          </article>
        ))}
      </div>
    </section>
  );
}
