import { apiFetch } from "./api";

export type Widget = {
  id: string;

  name: string;

  type: "IMAGE" | "VIDEO" | "EMBED" | "HTML";

  position: string;

  title?: string | null;

  description?: string | null;

  mediaUrl?: string | null;

  embedCode?: string | null;

  imageUrl?: string | null;

  buttonHref?: string | null;

  redirectUrl: string;

  buttonLabel?: string | null;

  aspectRatio: string;

  active: boolean;

  order: number;
};

export function listWidgets(position?: string) {
  const url = position ? `/widgets/${position}` : "/admin/widgets";

  return apiFetch<{ data: Widget[] }>(url);
}

export function createWidget(data: Partial<Widget>) {
  return apiFetch<Widget>("/admin/widgets", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteWidget(id: string) {
  return apiFetch<void>(`/admin/widgets/${id}`, {
    method: "DELETE",
  });
}
