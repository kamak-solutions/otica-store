import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { updateCustomerCrmStatus } from "../../services/admin-customer-crm.service";
import {
  getAdminCustomer,
  type AdminCustomerDetail,
} from "../../services/admin-customer-detail.service";
import {
  getCustomerNotes,
  createCustomerNote,
  type CustomerNote,
} from "../../services/admin-customer-notes.service";

import {
  listCustomerAttendances,
  type Attendance,
} from "../../services/attendances.service";

import {
  getCustomerReminders,
  createCustomerReminder,
  completeCustomerReminder,
  type CustomerReminder,
} from "../../services/admin-customer-reminders.service";

import {
  getCustomerInteractions,
  createCustomerInteraction,
  type CustomerInteraction,
} from "../../services/admin-customer-interactions.service";

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

export function AdminCustomerDetail() {
  const { id } = useParams();

  const [customer, setCustomer] = useState<AdminCustomerDetail | null>(null);

  const [crmStatus, setCrmStatus] = useState("");

  const [isSavingCrmStatus, setIsSavingCrmStatus] = useState(false);

  const [notes, setNotes] = useState<CustomerNote[]>([]);

  const [newNote, setNewNote] = useState("");

  const [isSavingNote, setIsSavingNote] = useState(false);

  const [reminders, setReminders] = useState<CustomerReminder[]>([]);

  const [newReminderTitle, setNewReminderTitle] = useState("");

  const [newReminderDate, setNewReminderDate] = useState("");

  const [isSavingReminder, setIsSavingReminder] = useState(false);
  const [interactions, setInteractions] = useState<CustomerInteraction[]>([]);
  const [newInteractionType, setNewInteractionType] = useState("whatsapp");

  const [newInteractionDescription, setNewInteractionDescription] =
    useState("");

  const [isSavingInteraction, setIsSavingInteraction] = useState(false);

  const [attendances, setAttendances] = useState<Attendance[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadCustomer() {
      if (!id) {
        return;
      }

      try {
        setErrorMessage("");
        const [
          customerResponse,
          notesResponse,
          remindersResponse,
          interactionsResponse,
          attendancesResponse,
        ] = await Promise.all([
          getAdminCustomer(id),
          getCustomerNotes(id),
          getCustomerReminders(id),
          getCustomerInteractions(id),
          listCustomerAttendances(id),
        ]);

        setCustomer(customerResponse.data);
        setCrmStatus(customerResponse.data.crmStatus);

        setNotes(notesResponse.data);

        setReminders(remindersResponse.data);

        setInteractions(interactionsResponse.data);
        setAttendances(attendancesResponse.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Erro ao carregar cliente.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadCustomer();
  }, [id]);
  async function handleCreateNote() {
    if (!id || !newNote.trim()) {
      return;
    }

    try {
      setIsSavingNote(true);

      await createCustomerNote(id, {
        note: newNote,
      });

      const response = await getCustomerNotes(id);

      setNotes(response.data);

      setNewNote("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingNote(false);
    }
  }
  async function handleCreateReminder() {
    if (!id || !newReminderTitle.trim() || !newReminderDate) {
      return;
    }

    try {
      setIsSavingReminder(true);

      await createCustomerReminder(id, {
        type: "follow_up",
        title: newReminderTitle,
        dueDate: new Date(newReminderDate).toISOString(),
      });

      const response = await getCustomerReminders(id);

      setReminders(response.data);

      setNewReminderTitle("");
      setNewReminderDate("");
    } finally {
      setIsSavingReminder(false);
    }
  }
  async function handleCompleteReminder(reminderId: string) {
    await completeCustomerReminder(reminderId);

    if (!id) {
      return;
    }

    const response = await getCustomerReminders(id);

    setReminders(response.data);
  }
  async function handleCreateInteraction() {
    if (!id || !newInteractionDescription.trim()) {
      return;
    }

    try {
      setIsSavingInteraction(true);

      await createCustomerInteraction(id, {
        type: newInteractionType,
        description: newInteractionDescription,
      });

      const response = await getCustomerInteractions(id);

      setInteractions(response.data);

      setNewInteractionDescription("");
      setNewInteractionType("whatsapp");
    } finally {
      setIsSavingInteraction(false);
    }
  }
  async function handleUpdateCrmStatus(status: string) {
    if (!id) {
      return;
    }

    try {
      setIsSavingCrmStatus(true);

      await updateCustomerCrmStatus(id, status);

      setCrmStatus(status);

      setCustomer((current) =>
        current
          ? {
              ...current,
              crmStatus: status,
            }
          : null,
      );
    } finally {
      setIsSavingCrmStatus(false);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>CRM</span>
          <h1>Ficha do Cliente</h1>
        </div>
      </div>

      {isLoading && (
        <p className="admin-state-message">Carregando cliente...</p>
      )}

      {errorMessage && (
        <p className="admin-state-message admin-error-message">
          {errorMessage}
        </p>
      )}

      {!isLoading && customer && (
        <>
          <div className="crm-card">
            <div className="crm-customer-header">
              <div>
                <h2>{customer.name}</h2>

                <span className={`crm-status crm-status-${crmStatus}`}>
                  {crmStatus}
                </span>
              </div>

              <div className="crm-customer-stats">
                <div>
                  <strong>{customer.orders.length}</strong>
                  <span>Pedidos</span>
                </div>
                <div>
                  <strong>{attendances.length}</strong>
                  <span>Atendimentos</span>
                </div>

                <div>
                  <strong>{notes.length}</strong>
                  <span>Notas</span>
                </div>

                <div>
                  <strong>{reminders.length}</strong>
                  <span>Lembretes</span>
                </div>

                <div>
                  <strong>{interactions.length}</strong>
                  <span>Interações</span>
                </div>
              </div>
            </div>

            <div className="crm-customer-grid">
              <div>
                <strong>Email</strong>
                <span>{customer.email}</span>
              </div>

              <div>
                <strong>Telefone</strong>
                <span>{customer.phone}</span>
              </div>

              <div>
                <strong>CPF</strong>
                <span>{customer.cpf ?? "-"}</span>
              </div>

              <div>
                <strong>Nascimento</strong>
                <span>{formatBirthDate(customer.birthDate)}</span>
              </div>

              <div>
                <strong>Cidade</strong>
                <span>
                  {customer.address.city}/{customer.address.state}
                </span>
              </div>

              <div>
                <strong>Cadastrado em</strong>
                <span>{formatDate(customer.createdAt)}</span>
              </div>

              <div>
                <strong>Status CRM</strong>
                <Link
                  to={`/admin/clientes/${customer.id}/atendimento/novo`}
                  className="button-primary"
                >
                  Novo atendimento
                </Link>

                <select
                  value={crmStatus}
                  disabled={isSavingCrmStatus}
                  onChange={(event) =>
                    handleUpdateCrmStatus(event.target.value)
                  }
                >
                  <option value="lead">Lead</option>
                  <option value="prospect">Prospect</option>
                  <option value="customer">Cliente</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>
            <h3>Atendimentos</h3>

            {attendances.length === 0 ? (
              <p>Nenhum atendimento.</p>
            ) : (
              <div className="crm-list">
                {attendances.map((attendance) => (
                  <div key={attendance.id} className="crm-item">
                    <strong>{attendance.type}</strong>

                    <p>Status: {attendance.status}</p>

                    {attendance.collaborator && (
                      <p>Colaborador: {attendance.collaborator.name}</p>
                    )}

                    <small>{formatDate(attendance.createdAt)}</small>
                  </div>
                ))}
              </div>
            )}
            <h3>Pedidos</h3>

            {customer.orders.length === 0 ? (
              <p>Nenhum pedido.</p>
            ) : (
              <div className="crm-list">
                {customer.orders.map((order) => (
                  <div key={order.id} className="crm-item">
                    <strong>{order.orderNumber ?? order.id}</strong>

                    <p>Status: {order.status}</p>

                    <small>{formatDate(order.createdAt)}</small>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="crm-grid">
            <div className="crm-card">
              <h3>Notas CRM</h3>

              <div className="crm-form">
                <textarea
                  value={newNote}
                  onChange={(event) => setNewNote(event.target.value)}
                  placeholder="Digite uma observação sobre o cliente..."
                  rows={4}
                />

                <button
                  className="crm-button"
                  type="button"
                  onClick={handleCreateNote}
                  disabled={isSavingNote}
                >
                  {isSavingNote ? "Salvando..." : "Adicionar nota"}
                </button>
              </div>

              <div className="crm-list">
                {notes.length === 0 ? (
                  <p>Nenhuma nota cadastrada.</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="crm-item">
                      <p>{note.note}</p>

                      <small>{formatDate(note.createdAt)}</small>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="crm-card">
              <h3>Lembretes</h3>

              <div className="crm-form">
                <input
                  type="text"
                  placeholder="Título do lembrete"
                  value={newReminderTitle}
                  onChange={(event) => setNewReminderTitle(event.target.value)}
                />

                <input
                  type="datetime-local"
                  value={newReminderDate}
                  onChange={(event) => setNewReminderDate(event.target.value)}
                />

                <button
                  className="crm-button"
                  type="button"
                  onClick={handleCreateReminder}
                  disabled={isSavingReminder}
                >
                  {isSavingReminder ? "Salvando..." : "Adicionar lembrete"}
                </button>
              </div>

              <div className="crm-list">
                {reminders.length === 0 ? (
                  <p>Nenhum lembrete.</p>
                ) : (
                  reminders.map((reminder) => (
                    <div key={reminder.id} className="crm-item">
                      <strong>{reminder.title}</strong>

                      <p>Vencimento: {formatDate(reminder.dueDate)}</p>

                      <p>
                        Status: {reminder.completed ? "Concluído" : "Pendente"}
                      </p>

                      {!reminder.completed && (
                        <button
                          className="crm-button"
                          type="button"
                          onClick={() => handleCompleteReminder(reminder.id)}
                        >
                          Concluir
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="crm-card crm-full-width">
            <h3>Interações</h3>

            <div className="crm-form">
              <select
                value={newInteractionType}
                onChange={(event) => setNewInteractionType(event.target.value)}
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="phone_call">Ligação</option>
                <option value="email">E-mail</option>
                <option value="visit">Visita</option>
                <option value="sale">Venda</option>
                <option value="support">Suporte</option>
              </select>

              <textarea
                rows={3}
                placeholder="Descrição da interação..."
                value={newInteractionDescription}
                onChange={(event) =>
                  setNewInteractionDescription(event.target.value)
                }
              />

              <button
                className="crm-button"
                type="button"
                onClick={handleCreateInteraction}
                disabled={isSavingInteraction}
              >
                {isSavingInteraction ? "Salvando..." : "Adicionar interação"}
              </button>
            </div>

            <div className="crm-list">
              {interactions.length === 0 ? (
                <p>Nenhuma interação registrada.</p>
              ) : (
                interactions.map((interaction) => (
                  <div key={interaction.id} className="crm-item">
                    <strong>{interaction.type}</strong>

                    <p>{interaction.description}</p>

                    <small>{formatDate(interaction.createdAt)}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
