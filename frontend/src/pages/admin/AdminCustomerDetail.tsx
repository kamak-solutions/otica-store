import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
        ] = await Promise.all([
          getAdminCustomer(id),
          getCustomerNotes(id),
          getCustomerReminders(id),
          getCustomerInteractions(id),
        ]);

        setCustomer(customerResponse.data);

        setNotes(notesResponse.data);

        setReminders(remindersResponse.data);

        setInteractions(interactionsResponse.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Erro ao carregar cliente.",
        );
      } finally {
        setIsLoading(false);
      }
      const remindersResponse = await getCustomerReminders(id);

      setReminders(remindersResponse.data);
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
            <h2>{customer.name}</h2>

            <p>
              <strong>Email:</strong> {customer.email}
            </p>

            <p>
              <strong>Telefone:</strong> {customer.phone}
            </p>

            <p>
              <strong>CPF:</strong> {customer.cpf}
            </p>

            <p>
              <strong>Nascimento:</strong> {formatBirthDate(customer.birthDate)}
            </p>

            <p>
              <strong>Cidade:</strong> {customer.address.city}/
              {customer.address.state}
            </p>

            <p>
              <strong>Cadastrado em:</strong> {formatDate(customer.createdAt)}
            </p>

            <h3>Pedidos</h3>

            {customer.orders.length === 0 ? (
              <p>Nenhum pedido.</p>
            ) : (
              <div className="crm-list">
                {customer.orders.map((order) => (
                  <div key={order.id} className="crm-item">
                    <strong>{order.orderNumber ?? order.id}</strong>

                    <p>Status: {order.status}</p>
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
