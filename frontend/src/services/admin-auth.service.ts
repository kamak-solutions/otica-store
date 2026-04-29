import { apiFetch } from "./api";
import type { AdminLoginResponse } from "../types/auth";

type AdminLoginPayload = {
  email: string;
  password: string;
};

export function adminLogin(payload: AdminLoginPayload) {
  return apiFetch<AdminLoginResponse>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
