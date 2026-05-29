import { apiFetch } from "./api";
import type { Campaign } from "../types/campaign";

export function listCampaigns() {
  return apiFetch<Campaign[]>("/admin/campaigns");
}
export function listPublicCampaigns(location?: string) {
  const query = location ? `?location=${location}` : "";

  return apiFetch<Campaign[]>(`/campaigns${query}`);
}

export function createCampaign(data: Omit<Campaign, "id">) {
  return apiFetch<Campaign>("/admin/campaigns", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCampaign(id: string, data: Partial<Campaign>) {
  return apiFetch<Campaign>(`/admin/campaigns/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteCampaign(id: string) {
  return apiFetch<void>(`/admin/campaigns/${id}`, {
    method: "DELETE",
  });
}
export async function toggleCampaign(id: string) {
  return apiFetch(`/admin/campaigns/${id}/toggle`, {
    method: "PATCH",
  });
}
