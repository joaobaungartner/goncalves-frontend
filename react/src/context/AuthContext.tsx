import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

const TOKEN_KEY = 'access_token';

interface AuthContextValue {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const setToken = useCallback((value: string | null) => {
    if (value) {
      localStorage.setItem(TOKEN_KEY, value);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setTokenState(value);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const { config } = await import('../config/config');
      const res = await fetch(`${config.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({})) as { access_token?: string; detail?: string };
      if (!res.ok) {
        const msg = typeof data.detail === 'string' ? data.detail : data.detail?.[0]?.msg ?? 'Falha no login';
        throw new Error(msg);
      }
      if (!data.access_token) throw new Error('Token não retornado');
      setToken(data.access_token);
    },
    [setToken]
  );

  const logout = useCallback(() => {
    setToken(null);
  }, [setToken]);

  const value: AuthContextValue = {
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/** Token para uso em chamadas API (ex.: api.ts) */
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
