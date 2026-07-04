"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { User } from "./types";

/**
 * NOTE ON PRODUCTION AUTH
 * ------------------------
 * This is a lightweight, self-contained auth system that stores users in
 * localStorage so the app works fully out of the box with zero backend
 * setup. It is suitable for demos and prototypes.
 *
 * For a real production deployment, swap this out for a proper provider
 * such as NextAuth.js, Clerk, or Supabase Auth, and move the "users" table
 * and password hashing to a real database. The AuthContext API below
 * (login/signup/logout/user) is designed to be a drop-in interface so
 * that swap only touches this file.
 */

const USERS_KEY = "lm_users";
const SESSION_KEY = "lm_session";

interface StoredUser extends User {
  password: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ error?: string }>;
  logout: () => void;
  upgradeToPro: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function useAuthProvider(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (sessionId) {
        const found = getUsers().find((u) => u.id === sessionId);
        if (found) {
          const { password, ...safeUser } = found;
          setUser(safeUser);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users = getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!found || found.password !== password) {
      return { error: "Invalid email or password." };
    }
    localStorage.setItem(SESSION_KEY, found.id);
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    return {};
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const users = getUsers();
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { error: "An account with this email already exists." };
      }
      const newUser: StoredUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password,
        plan: "free",
        createdAt: new Date().toISOString(),
      };
      saveUsers([...users, newUser]);
      localStorage.setItem(SESSION_KEY, newUser.id);
      const { password: _pw, ...safeUser } = newUser;
      setUser(safeUser);
      return {};
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const upgradeToPro = useCallback(() => {
    if (!user) return;
    const users = getUsers().map((u) =>
      u.id === user.id ? { ...u, plan: "pro" as const } : u
    );
    saveUsers(users);
    setUser({ ...user, plan: "pro" });
  }, [user]);

  return { user, loading, login, signup, logout, upgradeToPro };
}

export { AuthContext };

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// AuthProvider component lives here to keep the auth module self-contained.
export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthProvider();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
