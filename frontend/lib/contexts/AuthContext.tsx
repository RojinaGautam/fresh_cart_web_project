"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FreshCartUser, whoAmIApi } from "../api/auth";
import {
  clearStoredAuth,
  getAuthToken,
  getStoredUser,
  setAuthToken,
  setStoredUser,
} from "../auth-storage";

type AuthContextValue = {
  user: FreshCartUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<FreshCartUser | null>;
  login: (token: string, user: FreshCartUser) => void;
  setUser: (user: FreshCartUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<FreshCartUser | null>(() =>
    getStoredUser(),
  );
  const [loading, setLoading] = useState(true);

  const setUser = useCallback((nextUser: FreshCartUser) => {
    setUserState(nextUser);
    setStoredUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setUserState(null);
  }, []);

  const checkAuth = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      logout();
      setLoading(false);
      return null;
    }

    setLoading(true);

    try {
      const response = await whoAmIApi();
      const freshUser = response.data as FreshCartUser;
      setUser(freshUser);
      return freshUser;
    } catch {
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  }, [logout, setUser]);

  const login = useCallback((token: string, nextUser: FreshCartUser) => {
    setAuthToken(token);
    setStoredUser(nextUser);
    setUserState(nextUser);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void checkAuth();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [checkAuth]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      checkAuth,
      login,
      setUser,
      logout,
    }),
    [checkAuth, loading, login, logout, setUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
