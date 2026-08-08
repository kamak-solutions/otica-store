import { apiFetch } from "./api";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";

type UploadImageResponse = {
  data: {
    url: string;
    publicId: string;
    originalFilename: string;
    mimetype: string;
  };
  message: string;
};

function getAdminAuthHeaders(): Record<string, string> {
  const token = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function uploadStorefrontImage(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  return apiFetch<UploadImageResponse>("/admin/storefront/upload-image", {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: formData,
  });
}

