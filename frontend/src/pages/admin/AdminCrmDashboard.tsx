import { useEffect, useState } from "react";

import {
  getCrmDashboard,
  type CrmDashboard,
} from "../../services/admin-crm-dashboard.service";

export function AdminCrmDashboard() {
  const [dashboard, setDashboard] = useState<CrmDashboard | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getCrmDashboard();

        setDashboard(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Erro ao carregar dashboard CRM.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>CRM</span>
          <h1>Dashboard CRM</h1>
          <p>Resumo dos relacionamentos com clientes.</p>
        </div>
      </div>

      {isLoading && (
        <p className="admin-state-message">Carregando dashboard...</p>
      )}

      {errorMessage && (
        <p className="admin-state-message admin-error-message">
          {errorMessage}
        </p>
      )}

      {!isLoading && dashboard && (
        <div className="admin-dashboard-grid">
       <article className="admin-dashboard-card">
            <strong>{dashboard.totalCustomers}</strong>
            <span>Clientes</span>
          </article>

      <article className="admin-dashboard-card">
            <strong>{dashboard.interactionsLast30Days}</strong>
            <span>Interações (30 dias)</span>
          </article>

        <article className="admin-dashboard-card">
            <strong>{dashboard.remindersPending}</strong>
            <span>Lembretes pendentes</span>
          </article>

         <article className="admin-dashboard-card">
            <strong>{dashboard.remindersOverdue}</strong>
            <span>Lembretes atrasados</span>
          </article>
        </div>
      )}
    </section>
  );
}
