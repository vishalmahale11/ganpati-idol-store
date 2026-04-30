import {
  clearAdminSession,
  credentialsMatch,
  readAdminSession,
  writeAdminSession,
} from "@/lib/adminAuth";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type AdminAuthContextValue = {
  isAuthenticated: boolean;
  login: (loginId: string, password: string) => boolean;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(readAdminSession);

  const login = useCallback((loginId: string, password: string) => {
    if (credentialsMatch(loginId, password)) {
      writeAdminSession();
      setAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    clearAdminSession();
    setAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
