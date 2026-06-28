import { Link } from "react-router-dom";
import { maskCpf, maskPhone, maskZipcode } from "../../utils/input-masks";

export type CustomerFormData = {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  zipcode: string;
  state: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  notes: string;
  crmStatus: string;
  lgpdAccepted: boolean;
  lgpdConsentSource: string;
};

type Props = {
  value: CustomerFormData;
  onChange: (field: keyof CustomerFormData, value: string | boolean) => void;
  onSearchZipcode?: () => void;
  isSearchingZipcode?: boolean;
  zipcodeMessage?: string;
  showCrmFields?: boolean;
  showNotes?: boolean;
};

export function CustomerForm({
  value,
  onChange,
  onSearchZipcode,
  isSearchingZipcode = false,
  zipcodeMessage = "",
  showCrmFields = false,
  showNotes = true,
}: Props) {
  return (
    <>
      <section className="checkout-card">
        <h2>Dados do cliente</h2>

        <label>
          Nome completo *
          <input
            type="text"
            value={value.name}
            onChange={(event) => onChange("name", event.target.value)}
            required
          />
        </label>

        <div className="checkout-form-grid">
          <label>
            E-mail *
            <input
              type="email"
              value={value.email}
              onChange={(event) => onChange("email", event.target.value)}
              required
            />
          </label>

          <label>
            Telefone / WhatsApp *
            <input
              type="text"
              value={value.phone}
              onChange={(event) =>
                onChange("phone", maskPhone(event.target.value))
              }
              required
            />
          </label>
        </div>

        <div className="checkout-form-grid">
          <label>
            CPF *
            <input
              type="text"
              value={value.cpf}
              onChange={(event) => onChange("cpf", maskCpf(event.target.value))}
              placeholder="000.000.000-00"
              required
            />
          </label>

          <label>
            Data de nascimento *
            <input
              type="date"
              value={value.birthDate}
              onChange={(event) => onChange("birthDate", event.target.value)}
              required
            />
          </label>
        </div>

        <label className="checkout-lgpd-checkbox">
          <input
            type="checkbox"
            checked={value.lgpdAccepted}
            onChange={(event) => onChange("lgpdAccepted", event.target.checked)}
            required
          />

          <span>
            Confirmo que sou maior de 18 anos e autorizo o uso dos meus dados,
            conforme a{" "}
            <Link to="/politica-de-privacidade" target="_blank">
              Política de Privacidade
            </Link>
            .
          </span>
        </label>
      </section>

      <section className="checkout-card">
        <h2>Endereço</h2>

        <div className="checkout-form-grid">
          <label>
            CEP *
            <input
              type="text"
              value={value.zipcode}
              onChange={(event) =>
                onChange("zipcode", maskZipcode(event.target.value))
              }
              onBlur={onSearchZipcode}
              placeholder="00000-000"
              required
            />

            {isSearchingZipcode && (
              <p className="checkout-field-message">
                Buscando endereço pelo CEP...
              </p>
            )}

            {zipcodeMessage && !isSearchingZipcode && (
              <p className="checkout-field-message">{zipcodeMessage}</p>
            )}
          </label>

          <label>
            Estado / UF *
            <input
              type="text"
              value={value.state}
              onChange={(event) =>
                onChange("state", event.target.value.toUpperCase().slice(0, 2))
              }
              placeholder="SP"
              maxLength={2}
              required
            />
          </label>
        </div>

        <label>
          Rua *
          <input
            type="text"
            value={value.street}
            onChange={(event) => onChange("street", event.target.value)}
            required
          />
        </label>

        <div className="checkout-form-grid">
          <label>
            Número *
            <input
              type="text"
              value={value.number}
              onChange={(event) => onChange("number", event.target.value)}
              required
            />
          </label>

          <label>
            Complemento
            <input
              type="text"
              value={value.complement}
              onChange={(event) => onChange("complement", event.target.value)}
            />
          </label>
        </div>

        <div className="checkout-form-grid">
          <label>
            Bairro *
            <input
              type="text"
              value={value.district}
              onChange={(event) => onChange("district", event.target.value)}
              required
            />
          </label>

          <label>
            Cidade *
            <input
              type="text"
              value={value.city}
              onChange={(event) => onChange("city", event.target.value)}
              required
            />
          </label>
        </div>

        {showNotes && (
          <label>
            Observações
            <textarea
              value={value.notes}
              onChange={(event) => onChange("notes", event.target.value)}
              rows={4}
              placeholder="Ex: preferência de atendimento, orçamento, retirada..."
            />
          </label>
        )}
      </section>

      {showCrmFields && (
        <section className="checkout-card">
          <h2>CRM</h2>

          <label>
            Status CRM
            <select
              value={value.crmStatus}
              onChange={(event) => onChange("crmStatus", event.target.value)}
            >
              <option value="lead">Lead</option>
              <option value="new">Novo</option>
              <option value="contacted">Contato realizado</option>
              <option value="quote_sent">Orçamento enviado</option>
              <option value="negotiation">Negociação</option>
              <option value="customer">Cliente</option>
              <option value="lost">Perdido</option>
            </select>
          </label>

          <label>
            Origem do consentimento LGPD
            <select
              value={value.lgpdConsentSource}
              onChange={(event) =>
                onChange("lgpdConsentSource", event.target.value)
              }
            >
              <option value="admin">Admin</option>
              <option value="loja_fisica">Loja física</option>
              <option value="telefone">Telefone</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="checkout">Checkout</option>
            </select>
          </label>
        </section>
      )}
    </>
  );
}