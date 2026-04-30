import { createContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { adminLogin } from "../../services/admin-auth.service";
import type { AdminUser } from "../../types/auth";

type AuthContextValue = {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const ADMIN_TOKEN_KEY = "@otica-showroom:admin-token";
const ADMIN_USER_KEY = "@otica-showroom:admin-user";

export const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredAdmin() {
  const storedAdmin = localStorage.getItem(ADMIN_USER_KEY);

  if (!storedAdmin) {
    return null;
  }

  try {
    return JSON.parse(storedAdmin) as AdminUser;
  } catch {
    localStorage.removeItem(ADMIN_USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(ADMIN_TOKEN_KEY),
  );
  const [admin, setAdmin] = useState<AdminUser | null>(() => loadStoredAdmin());

  async function login(email: string, password: string) {
    const response = await adminLogin({ email, password });

    localStorage.setItem(ADMIN_TOKEN_KEY, response.data.token);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(response.data.admin));

    setToken(response.data.token);
    setAdmin(response.data.admin);
  }

  function logout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);

    setToken(null);
    setAdmin(null);
  }

  const value = useMemo(
    () => ({
      admin,
      token,
      isAuthenticated: Boolean(token && admin),
      login,
      logout,
    }),
    [admin, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
