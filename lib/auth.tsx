"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "./supabase/client";
import { User } from "./types";

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
  upgradeToPro: () => Promise<{ error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchProfile(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, plan, created_at")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    plan: data.plan,
    createdAt: data.created_at,
  };
}

export function useAuthProvider(): AuthContextValue {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setUser(null);
      return;
    }

    const profile = await fetchProfile(supabase, authUser.id);
    setUser(profile);
  }, [supabase]);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      refreshUser();
    });

    return () => listener.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message };
      await refreshUser();
      return {};
    },
    [supabase, refreshUser]
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) return { error: error.message };
      await refreshUser();
      return {};
    },
    [supabase, refreshUser]
  );

  const logout = useCallback(() => {
    supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  // Real plan upgrades happen server-side, only after Click/Payme confirms
  // a payment (see app/api/click and app/api/payme routes), which is
  // enforced by a database trigger that blocks client-side plan writes.
  // This calls a guarded dev-only endpoint so you can test the Pro
  // experience before payments are wired up; it does nothing in
  // production unless ALLOW_DEV_UPGRADE=true is set on the server.
  const upgradeToPro = useCallback(async () => {
    if (!user) return { error: "Not logged in" };
    const res = await fetch("/api/dev-upgrade", { method: "POST" });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Upgrade failed" };
    await refreshUser();
    return {};
  }, [user, refreshUser]);

  return { user, loading, login, signup, logout, upgradeToPro, refreshUser };
}

export { AuthContext };

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthProvider();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
