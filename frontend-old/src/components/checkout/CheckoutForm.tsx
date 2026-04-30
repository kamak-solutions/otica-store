import type { CheckoutFormData } from "../../types/checkout";

type CheckoutFormProps = {
  formData: CheckoutFormData;
  isSubmitting: boolean;
  onChangeField: (field: keyof CheckoutFormData, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function CheckoutForm({
  formData,
  isSubmitting,
  onChangeField,
  onSubmit,
}: CheckoutFormProps) {
  return (
    <form className="checkout-form" onSubmit={onSubmit}>
      <h2>Dados do cliente</h2>

      <label>
        Nome completo
        <input
          type="text"
          name="customerName"
          placeholder="Seu nome"
          value={formData.customerName}
          onChange={(event) =>
            onChangeField("customerName", event.target.value)
          }
        />
      </label>

      <label>
        E-mail
        <input
          type="email"
          name="customerEmail"
          placeholder="seu@email.com"
          value={formData.customerEmail}
          onChange={(event) =>
            onChangeField("customerEmail", event.target.value)
          }
        />
      </label>

      <label>
        Telefone / WhatsApp
        <input
          type="tel"
          name="customerPhone"
          placeholder="(11) 99999-9999"
          value={formData.customerPhone}
          onChange={(event) =>
            onChangeField("customerPhone", event.target.value)
          }
        />
      </label>

      <h2>Endereço de entrega</h2>

      <div className="form-grid">
        <label>
          CEP
          <input
            type="text"
            name="zipcode"
            placeholder="00000-000"
            value={formData.zipcode}
            onChange={(event) => onChangeField("zipcode", event.target.value)}
          />
        </label>

        <label>
          Estado
          <input
            type="text"
            name="state"
            placeholder="SP"
            value={formData.state}
            onChange={(event) => onChangeField("state", event.target.value)}
          />
        </label>
      </div>

      <label>
        Endereço
        <input
          type="text"
          name="street"
          placeholder="Rua, avenida..."
          value={formData.street}
          onChange={(event) => onChangeField("street", event.target.value)}
        />
      </label>

      <div className="form-grid">
        <label>
          Número
          <input
            type="text"
            name="number"
            placeholder="123"
            value={formData.number}
            onChange={(event) => onChangeField("number", event.target.value)}
          />
        </label>

        <label>
          Complemento
          <input
            type="text"
            name="complement"
            placeholder="Apto, bloco..."
            value={formData.complement}
            onChange={(event) =>
              onChangeField("complement", event.target.value)
            }
          />
        </label>
      </div>

      <div className="form-grid">
        <label>
          Bairro
          <input
            type="text"
            name="district"
            placeholder="Bairro"
            value={formData.district}
            onChange={(event) => onChangeField("district", event.target.value)}
          />
        </label>

        <label>
          Cidade
          <input
            type="text"
            name="city"
            placeholder="Cidade"
            value={formData.city}
            onChange={(event) => onChangeField("city", event.target.value)}
          />
        </label>
      </div>

      <label>
        Observações
        <textarea
          name="notes"
          placeholder="Alguma observação sobre o pedido?"
          rows={4}
          value={formData.notes}
          onChange={(event) => onChangeField("notes", event.target.value)}
        />
      </label>

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando pedido..." : "Enviar pedido"}
      </button>
    </form>
  );
}
