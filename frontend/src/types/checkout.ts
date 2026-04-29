export type CheckoutFormData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  zipcode: string;
  state: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  notes: string;
};

export const initialCheckoutFormData: CheckoutFormData = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  zipcode: "",
  state: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  notes: "",
};
