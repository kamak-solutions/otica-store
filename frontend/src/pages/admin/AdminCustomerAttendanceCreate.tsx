import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export function AdminCustomerAttendanceCreate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [type, setType] = useState("ORDER");
  const [notes, setNotes] = useState("");

  function handleContinue(event: React.FormEvent) {
    event.preventDefault();

    if (type === "ORDER") {
      navigate(`/admin/clientes/${id}/pedidos/novo`);
      return;
    }

    alert("Esse tipo de atendimento será implementado depois.");
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>CRM</span>
          <h1>Novo atendimento</h1>
          <p>Crie um atendimento vinculado ao cliente.</p>
        </div>

        <Link to={`/admin/clientes/${id}`}>
          <button type="button">Voltar ao CRM</button>
        </Link>
      </div>

      <form className="admin-form-card" onSubmit={handleContinue}>
        <label>
          Tipo de atendimento
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="ORDER">Pedido</option>
            <option value="QUOTE">Orçamento</option>
            <option value="ADJUSTMENT">Ajuste</option>
            <option value="WARRANTY">Garantia</option>
            <option value="SUPPORT">Assistência</option>
          </select>
        </label>

        <label>
          Observações
          <textarea
            rows={5}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Descreva o atendimento..."
          />
        </label>

        <button className="admin-submit-button" type="submit">
          Continuar
        </button>
      </form>
    </section>
  );
}
