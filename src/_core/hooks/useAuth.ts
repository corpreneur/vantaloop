// Stub: Legacy Manus auth replaced by Supabase
import { useMemo } from "react";

type User = { name: string; email: string } | null;

export function useAuth(_options?: any) {
  return useMemo(() => ({
    user: null as User,
    loading: false,
    error: null as Error | null,
    isAuthenticated: false,
    refresh: () => {},
    logout: async () => {},
  }), []);
}
