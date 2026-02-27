import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export type AppRole = "admin" | "viewer";

export function useRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole>("viewer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole("viewer");
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setRole((data?.role as AppRole) ?? "viewer");
      setLoading(false);
    };

    fetchRole();
  }, [user?.id]);

  return {
    role,
    isAdmin: role === "admin",
    isViewer: role === "viewer",
    loading,
  };
}
