import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AdminUser } from "../../services/admin-auth.service";

const ADMIN_TOKEN_STORAGE_KEY = "@otica-showroom:admin-token";
const ADMIN_USER_STORAGE_KEY = "@otica-showroom:admin-user";

type AdminAuthContextValue = {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  signIn: (token: string, user: AdminUser) => void;
  signOut: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

type AdminAuthProviderProps = {
  children: ReactNode;
};

function loadToken() {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function loadUser() {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const storedUser = window.localStorage.getItem(ADMIN_USER_STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as AdminUser;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => loadToken());
  const [user, setUser] = useState<AdminUser | null>(() => loadUser());

  function signIn(newToken: string, newUser: AdminUser) {
    setToken(newToken);
    setUser(newUser);

    window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, newToken);
    window.localStorage.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify(newUser));
  }

  function signOut() {
    setToken(null);
    setUser(null);

    window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(ADMIN_USER_STORAGE_KEY);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      signIn,
      signOut,
    }),
    [token, user],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth deve ser usado dentro de AdminAuthProvider.");
  }

  return context;
}
