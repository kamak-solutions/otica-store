import { useState } from "react";
import { Link } from "react-router-dom";
import { createQuoteRequest } from "../../services/quote-requests.service";
import { uploadPrescriptionFile } from "../../services/uploads.service";
import { Seo } from "../../components/seo/Seo";

type QuoteFormData = {
  name: string;
  phone: string;
  email: string;
  requestType: string;
  prescriptionText: string;
  notes: string;
};

const initialFormData: QuoteFormData = {
  name: "",
  phone: "",
  email: "",
  requestType: "oculos-completo",
  prescriptionText: "",
  notes: "",
};

export function QuoteRequest() {
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdQuoteId, setCreatedQuoteId] = useState("");

  function updateField(field: keyof QuoteFormData, value: string) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let prescriptionFileUrl: string | undefined;
      let prescriptionPublicId: string | undefined;

      if (selectedFile) {
        const uploadResponse = await uploadPrescriptionFile(selectedFile);

        prescriptionFileUrl = uploadResponse.data.url;
        prescriptionPublicId = uploadResponse.data.publicId;
      }

      const response = await createQuoteRequest({
        customerName: formData.name,
        customerEmail: formData.email || undefined,
        customerPhone: formData.phone,
        requestType: formData.requestType,
        prescriptionText: formData.prescriptionText || undefined,
        notes: formData.notes || undefined,
        prescriptionFileUrl,
        prescriptionPublicId,
      });

      setCreatedQuoteId(response.data.id);
      setIsSubmitted(true);
      setFormData(initialFormData);
      setSelectedFile(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao enviar solicitação de orçamento.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <main className="page-shell">
        <Seo
          title="Orçamento com Receita | Ótica ShowRoom"
          description="Envie sua receita para solicitar orçamento de lentes, armações e óculos completos com atendimento personalizado."
        />
        <section className="quote-success-card">
          <div className="order-success-icon">✓</div>

          <span>Orçamento enviado</span>

          <h1>Recebemos sua solicitação</h1>

          <p>
            Nossa equipe poderá analisar as informações da sua receita e entrar
            em contato para orientar sobre lentes, armação, valores e próximos
            passos.
          </p>
          {createdQuoteId && (
            <div className="order-success-number">
              <small>Código da solicitação</small>
              <strong>{createdQuoteId}</strong>
            </div>
          )}

          <div className="order-success-actions">
            <Link className="button-primary" to="/">
              Voltar para a vitrine
            </Link>

            <button
              className="button-secondary"
              type="button"
              onClick={() => setIsSubmitted(false)}
            >
              Enviar outro orçamento
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="page-hero">
        <span>Orçamento</span>
        <h1>Envie sua receita para fazermos seu orçamento</h1>
        <p>
          Informe seus dados, descreva sua necessidade e envie sua receita para
          receber uma orientação mais personalizada sobre lentes, armação ou
          óculos completo.
        </p>
      </section>
      {errorMessage && <div className="checkout-error">{errorMessage}</div>}

      <section className="quote-request-layout">
        <form className="quote-request-form" onSubmit={handleSubmit}>
          <section className="checkout-card">
            <h2>Seus dados</h2>

            <label>
              Nome completo *
              <input
                type="text"
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </label>

            <div className="checkout-form-grid">
              <label>
                Telefone / WhatsApp *
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  required
                />
              </label>

              <label>
                E-mail
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="checkout-card">
            <h2>Sobre o orçamento</h2>

            <label>
              Tipo de solicitação *
              <select
                value={formData.requestType}
                onChange={(event) =>
                  updateField("requestType", event.target.value)
                }
                required
              >
                <option value="oculos-completo">Óculos completo</option>
                <option value="lentes">Somente lentes</option>
                <option value="armacao">Somente armação</option>
                <option value="multifocal">Lentes multifocais</option>
                <option value="conserto">Conserto / ajuste</option>
                <option value="outro">Outro atendimento</option>
              </select>
            </label>

            <label>
              Dados da receita
              <textarea
                value={formData.prescriptionText}
                onChange={(event) =>
                  updateField("prescriptionText", event.target.value)
                }
                rows={5}
                placeholder="Você pode digitar os dados da receita aqui, se preferir. Ex: OD, OE, grau, cilindro, eixo, adição..."
              />
            </label>

            <label>
              Observações
              <textarea
                value={formData.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                rows={4}
                placeholder="Ex: quero lente antirreflexo, blue cut, multifocal, tenho preferência por armação, desejo retirada na loja..."
              />
            </label>

            <label className="quote-file-upload">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;

                  setSelectedFile(file);
                  setSelectedFileName(file?.name ?? "");
                }}
              />

              <span>Enviar imagem ou PDF da receita</span>

              <strong>{selectedFileName || "Selecionar arquivo"}</strong>

              <small>
                Aceitamos imagem da receita ou PDF. O envio real será conectado
                ao backend na próxima etapa.
              </small>
            </label>
          </section>
          <button
            className="button-primary quote-submit-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? selectedFile
                ? "Enviando receita e orçamento..."
                : "Enviando orçamento..."
              : "Solicitar orçamento"}
          </button>
        </form>

        <aside className="quote-request-sidebar">
          <span>Como funciona</span>

          <div className="quote-steps">
            <article>
              <strong>1</strong>
              <p>Você envia sua receita ou descreve sua necessidade.</p>
            </article>

            <article>
              <strong>2</strong>
              <p>Nossa equipe avalia opções de lente, armação e atendimento.</p>
            </article>

            <article>
              <strong>3</strong>
              <p>Você recebe orientação para seguir com o orçamento.</p>
            </article>
          </div>

          <div className="quote-help-card">
            <strong>Não tem todos os dados?</strong>
            <p>
              Tudo bem. Envie o que tiver e nossa equipe poderá orientar você no
              atendimento.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
