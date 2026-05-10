type QuoteRequestToHttp = {
  id: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  requestType: string;
  prescriptionText: string | null;
  notes: string | null;
  prescriptionFileUrl: string | null;
  prescriptionPublicId: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export function mapQuoteRequestToHttp(quoteRequest: QuoteRequestToHttp) {
  return {
    id: quoteRequest.id,
    customerName: quoteRequest.customerName,
    customerEmail: quoteRequest.customerEmail,
    customerPhone: quoteRequest.customerPhone,
    requestType: quoteRequest.requestType,
    prescriptionText: quoteRequest.prescriptionText,
    notes: quoteRequest.notes,
    prescriptionFileUrl: quoteRequest.prescriptionFileUrl,
    prescriptionPublicId: quoteRequest.prescriptionPublicId,
    status: quoteRequest.status,
    createdAt: quoteRequest.createdAt.toISOString(),
    updatedAt: quoteRequest.updatedAt.toISOString(),
  };
}