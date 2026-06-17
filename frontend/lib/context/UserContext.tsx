"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FreshCartUser } from "../api/auth";
import { whoAmIApi } from "../api/auth";
import { getTokenCookie, storeUserData } from "../cookies";

type UserContextType = {
  user: FreshCartUser | null;
  setUser: (user: FreshCartUser | null) => void;
  loading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FreshCartUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const token = await getTokenCookie();

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const response = await whoAmIApi();
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        await storeUserData(response.data);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated,
        checkAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
