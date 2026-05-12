const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL não configurada.");
}

export type UploadPrescriptionResponse = {
  data: {
    url: string;
    publicId: string;
    originalFilename: string;
    mimetype: string;
  };
  message: string;
};

export async function uploadPrescriptionFile(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_URL}/uploads/prescription`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Erro ao enviar receita.");
  }

  return data as UploadPrescriptionResponse;
}
export async function uploadProductImageFile(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_URL}/uploads/product-image`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Erro ao enviar imagem do produto.");
  }

  return data as UploadPrescriptionResponse;
}