import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { createCustomerPrescription } from "../../services/prescriptions.service";

export function AdminCustomerPrescriptionCreate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    examDate: "",
    expiresAt: "",

    rightSpherical: "",
    rightCylindrical: "",
    rightAxis: "",

    leftSpherical: "",
    leftCylindrical: "",
    leftAxis: "",

    addition: "",
    pupillaryDistance: "",
    height: "",

    doctorName: "",
    doctorCrm: "",

    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof typeof formData, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!id) return;

    try {
      setIsSubmitting(true);

      await createCustomerPrescription(id, {
        examDate: formData.examDate || undefined,
        expiresAt: formData.expiresAt || undefined,

        rightSpherical: formData.rightSpherical || undefined,
        rightCylindrical: formData.rightCylindrical || undefined,
        rightAxis: formData.rightAxis || undefined,

        leftSpherical: formData.leftSpherical || undefined,
        leftCylindrical: formData.leftCylindrical || undefined,
        leftAxis: formData.leftAxis || undefined,

        addition: formData.addition || undefined,
        pupillaryDistance: formData.pupillaryDistance || undefined,
        height: formData.height || undefined,

        doctorName: formData.doctorName || undefined,
        doctorCrm: formData.doctorCrm || undefined,

        notes: formData.notes || undefined,
      });

      navigate(`/admin/clientes/${id}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>CRM</span>
          <h1>Nova receita oftálmica</h1>
          <p>Cadastre os dados da receita do cliente.</p>
        </div>

        <Link to={`/admin/clientes/${id}`}>
          <button type="button">Voltar para o cliente</button>
        </Link>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <section>
          <h2>Datas</h2>

          <div className="admin-form-grid">
            <label>
              Data do exame
              <input
                type="date"
                value={formData.examDate}
                onChange={(event) =>
                  updateField("examDate", event.target.value)
                }
              />
            </label>

            <label>
              Validade
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(event) =>
                  updateField("expiresAt", event.target.value)
                }
              />
            </label>
          </div>
        </section>

        <section>
          <h2>Olho direito — OD</h2>

          <div className="admin-form-grid">
            <label>
              Esférico
              <input
                value={formData.rightSpherical}
                onChange={(event) =>
                  updateField("rightSpherical", event.target.value)
                }
                placeholder="-1.00"
              />
            </label>

            <label>
              Cilíndrico
              <input
                value={formData.rightCylindrical}
                onChange={(event) =>
                  updateField("rightCylindrical", event.target.value)
                }
                placeholder="-0.50"
              />
            </label>

            <label>
              Eixo
              <input
                value={formData.rightAxis}
                onChange={(event) =>
                  updateField("rightAxis", event.target.value)
                }
                placeholder="180"
              />
            </label>
          </div>
        </section>

        <section>
          <h2>Olho esquerdo — OE</h2>

          <div className="admin-form-grid">
            <label>
              Esférico
              <input
                value={formData.leftSpherical}
                onChange={(event) =>
                  updateField("leftSpherical", event.target.value)
                }
                placeholder="-1.00"
              />
            </label>

            <label>
              Cilíndrico
              <input
                value={formData.leftCylindrical}
                onChange={(event) =>
                  updateField("leftCylindrical", event.target.value)
                }
                placeholder="-0.50"
              />
            </label>

            <label>
              Eixo
              <input
                value={formData.leftAxis}
                onChange={(event) =>
                  updateField("leftAxis", event.target.value)
                }
                placeholder="180"
              />
            </label>
          </div>
        </section>

        <section>
          <h2>Medidas complementares</h2>

          <div className="admin-form-grid">
            <label>
              Adição
              <input
                value={formData.addition}
                onChange={(event) =>
                  updateField("addition", event.target.value)
                }
                placeholder="+2.00"
              />
            </label>

            <label>
              DP
              <input
                value={formData.pupillaryDistance}
                onChange={(event) =>
                  updateField("pupillaryDistance", event.target.value)
                }
                placeholder="62"
              />
            </label>

            <label>
              Altura
              <input
                value={formData.height}
                onChange={(event) => updateField("height", event.target.value)}
                placeholder="18"
              />
            </label>
          </div>
        </section>

        <section>
          <h2>Oftalmologista</h2>

          <div className="admin-form-grid">
            <label>
              Nome
              <input
                value={formData.doctorName}
                onChange={(event) =>
                  updateField("doctorName", event.target.value)
                }
              />
            </label>

            <label>
              CRM
              <input
                value={formData.doctorCrm}
                onChange={(event) =>
                  updateField("doctorCrm", event.target.value)
                }
              />
            </label>
          </div>
        </section>

        <section>
          <h2>Observações</h2>

          <label>
            Observações da receita
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Ex: cliente trouxe receita impressa, observações do médico..."
            />
          </label>
        </section>

        <button
          className="admin-submit-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar receita"}
        </button>
      </form>
    </section>
  );
}
