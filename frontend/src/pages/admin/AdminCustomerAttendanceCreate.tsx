import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { createAttendance } from "../../services/attendances.service";

import {
  listCustomerPrescriptions,
  type OpticalPrescription,
} from "../../services/prescriptions.service";

function formatDate(value: string | null) {
  if (!value) {
    return "Sem data";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(value));
}

export function AdminCustomerAttendanceCreate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);

  const [type, setType] = useState("ORDER");
  const [notes, setNotes] = useState("");

  const [prescriptions, setPrescriptions] = useState<OpticalPrescription[]>([]);
  const [prescriptionId, setPrescriptionId] = useState("");

  const [isLoadingPrescriptions, setIsLoadingPrescriptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const requiresPrescription = type === "ORDER" || type === "QUOTE";

  useEffect(() => {
    async function loadPrescriptions() {
      if (!id) {
        setIsLoadingPrescriptions(false);
        return;
      }

      try {
        const response = await listCustomerPrescriptions(id);

        setPrescriptions(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Erro ao carregar receitas.",
        );
      } finally {
        setIsLoadingPrescriptions(false);
      }
    }

    loadPrescriptions();
  }, [id]);

  function handleNextStep(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (requiresPrescription) {
      setStep(2);
      return;
    }

    void handleCreateAttendance();
  }

  async function handleCreateAttendance() {
    if (!id) {
      setErrorMessage("Cliente inválido.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await createAttendance({
        customerId: id,
        prescriptionId: prescriptionId || undefined,
        type,
        notes: notes.trim() || undefined,
      });

      if (type === "ORDER") {
        navigate(
          `/admin/clientes/${id}/pedidos/novo?attendance=${response.data.id}`,
        );
        return;
      }

      navigate(`/admin/clientes/${id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao criar atendimento.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>CRM</span>
          <h1>Novo atendimento</h1>

          <p>
            {step === 1
              ? "Defina o tipo de atendimento."
              : "Selecione a receita usada neste atendimento."}
          </p>
        </div>

        <Link to={`/admin/clientes/${id}`}>
          <button type="button">Voltar ao CRM</button>
        </Link>
      </div>

      {errorMessage && (
        <p className="admin-state-message admin-error-message">
          {errorMessage}
        </p>
      )}

      <div className="admin-attendance-steps">
        <span className={step === 1 ? "is-active" : "is-completed"}>
          1. Atendimento
        </span>

        <span className={step === 2 ? "is-active" : ""}>2. Receita</span>
      </div>

      {step === 1 && (
        <form className="admin-form-card" onSubmit={handleNextStep}>
          <section>
            <h2>Tipo de atendimento</h2>

            <label>
              Tipo
              <select
                value={type}
                onChange={(event) => {
                  setType(event.target.value);
                  setPrescriptionId("");
                }}
              >
                <option value="ORDER">Pedido</option>
                <option value="QUOTE">Orçamento</option>
                <option value="ADJUSTMENT">Ajuste</option>
                <option value="WARRANTY">Garantia</option>
                <option value="SUPPORT">Assistência</option>
              </select>
            </label>
          </section>

          <section>
            <h2>Observações iniciais</h2>

            <label>
              Observações
              <textarea
                rows={5}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Descreva a necessidade do cliente..."
              />
            </label>
          </section>

          <button
            className="admin-submit-button"
            type="submit"
            disabled={isSubmitting}
          >
            {requiresPrescription
              ? "Continuar para receita"
              : "Criar atendimento"}
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="admin-form-card">
          <section>
            <h2>Receita oftálmica</h2>

            {isLoadingPrescriptions ? (
              <p>Carregando receitas...</p>
            ) : prescriptions.length === 0 ? (
              <div className="admin-state-message">
                <p>Este cliente ainda não possui receita cadastrada.</p>

                <Link
                  className="button-primary"
                  to={`/admin/clientes/${id}/receitas/nova`}
                >
                  Cadastrar nova receita
                </Link>
              </div>
            ) : (
              <div className="admin-prescription-options">
                {prescriptions.map((prescription) => (
                  <label
                    className={`admin-prescription-option ${
                      prescriptionId === prescription.id ? "is-selected" : ""
                    }`}
                    key={prescription.id}
                  >
                    <input
                      type="radio"
                      name="prescription"
                      value={prescription.id}
                      checked={prescriptionId === prescription.id}
                      onChange={() => setPrescriptionId(prescription.id)}
                    />

                    <div>
                      <strong>
                        Receita de {formatDate(prescription.examDate)}
                      </strong>

                      <span>
                        OD: {prescription.rightSpherical ?? "-"} / OE:{" "}
                        {prescription.leftSpherical ?? "-"}
                      </span>

                      {prescription.doctorName && (
                        <small>Oftalmologista: {prescription.doctorName}</small>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </section>

          <div className="admin-attendance-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => setStep(1)}
            >
              Voltar
            </button>

            <button
              type="button"
              className="admin-submit-button"
              disabled={
                isSubmitting ||
                isLoadingPrescriptions ||
                prescriptions.length === 0 ||
                !prescriptionId
              }
              onClick={handleCreateAttendance}
            >
              {isSubmitting
                ? "Criando atendimento..."
                : "Continuar para pedido"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
