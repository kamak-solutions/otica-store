import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createAdminCustomer,
  type CreateAdminCustomerInput,
} from "../../services/admin-customers.service";

import {
  CustomerForm,
  type CustomerFormData,
} from "../../components/forms/CustomerForm";

import { searchZipcode } from "../../services/zipcode.service";

const initialFormData: CustomerFormData = {
  name: "",
  email: "",
  phone: "",
  cpf: "",
  birthDate: "",
  zipcode: "",
  state: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  notes: "",
  crmStatus: "lead",
  lgpdAccepted: false,
  lgpdConsentSource: "admin",
};

export function AdminCustomerCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [isSearchingZipcode, setIsSearchingZipcode] = useState(false);
  const [zipcodeMessage, setZipcodeMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof CustomerFormData, value: string | boolean) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  async function handleSearchZipcode() {
    if (formData.zipcode.replace(/\D/g, "").length !== 8) {
      return;
    }

    setIsSearchingZipcode(true);
    setZipcodeMessage("");

    try {
      const address = await searchZipcode(formData.zipcode);

      if (!address) {
        return;
      }

      setFormData((currentData) => ({
        ...currentData,
        zipcode: address.zipcode,
        street: address.street || currentData.street,
        complement: currentData.complement || address.complement,
        district: address.district || currentData.district,
        city: address.city || currentData.city,
        state: address.state || currentData.state,
      }));

      setZipcodeMessage("Endereço preenchido automaticamente pelo CEP.");
    } catch (error) {
      setZipcodeMessage(
        error instanceof Error ? error.message : "Erro ao buscar CEP.",
      );
    } finally {
      setIsSearchingZipcode(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      const payload: CreateAdminCustomerInput = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,

        cpf: formData.cpf || undefined,
        birthDate: formData.birthDate || undefined,

        zipcode: formData.zipcode,
        state: formData.state,
        street: formData.street,
        number: formData.number,
        complement: formData.complement || undefined,
        district: formData.district,
        city: formData.city,

        crmStatus: formData.crmStatus,

        lgpdAccepted: formData.lgpdAccepted,
        lgpdConsentSource: formData.lgpdConsentSource || "admin",
      };

      const response = await createAdminCustomer(payload);

      navigate(`/admin/clientes/${response.data.id}`);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Erro ao cadastrar cliente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>
          <h1>Novo cliente</h1>
          <p>Cadastre um cliente manualmente e envie para o CRM.</p>
        </div>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <CustomerForm
          value={formData}
          onChange={updateField}
          onSearchZipcode={handleSearchZipcode}
          isSearchingZipcode={isSearchingZipcode}
          zipcodeMessage={zipcodeMessage}
          showCrmFields
          showNotes
        />

        <button className="admin-submit-button" type="submit">
          {isSubmitting ? "Salvando..." : "Cadastrar cliente"}
        </button>
      </form>
    </section>
  );
}
