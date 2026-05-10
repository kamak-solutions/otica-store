import { apiFetch } from "./api";

export type AdminLoginPayload = {
  email: string;
  password: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AdminLoginResponse = {
  data: {
    token: string;
    user: AdminUser;
  };
  message: string;
};

export function adminLogin(payload: AdminLoginPayload) {
  return apiFetch<AdminLoginResponse>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
