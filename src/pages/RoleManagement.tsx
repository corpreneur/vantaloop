import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Redirect, Link } from "wouter";
import { DashboardLayoutSkeleton } from "@/components/DashboardLayoutSkeleton";
import { Shield, ShieldCheck, ArrowLeft, UserCog } from "lucide-react";
import { toast } from "sonner";

type UserWithRole = {
  user_id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: "admin" | "viewer";
  created_at: string;
};

export default function RoleManagement() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase.rpc("list_users_with_roles");
    if (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } else {
      setUsers((data as UserWithRole[]) ?? []);
    }
    setLoadingUsers(false);
  };

  useEffect(() => {
    if (isAdmin && !roleLoading) fetchUsers();
  }, [isAdmin, roleLoading]);

  const handleRoleChange = async (targetUserId: string, newRole: "admin" | "viewer") => {
    if (targetUserId === user?.id) {
      toast.error("You cannot change your own role");
      return;
    }
    setUpdatingId(targetUserId);
    const { error } = await supabase.rpc("set_user_role", {
      _target_user_id: targetUserId,
      _new_role: newRole,
    });
    if (error) {
      toast.error("Failed to update role");
      console.error(error);
    } else {
      toast.success(`Role updated to ${newRole}`);
      await fetchUsers();
    }
    setUpdatingId(null);
  };

  if (authLoading || roleLoading) return <DashboardLayoutSkeleton />;
  if (!user) return <Redirect to="/auth" />;
  if (!isAdmin) return <Redirect to="/" />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft size={14} />
            Back to dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
              <UserCog size={20} className="text-background" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Role Management</h1>
              <p className="text-sm text-muted-foreground">Manage team member permissions</p>
            </div>
          </div>
        </div>

        {/* Users list */}
        {loadingUsers ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-secondary/50 animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground text-sm">No users found.</p>
        ) : (
          <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
            {users.map((u) => {
              const isSelf = u.user_id === user?.id;
              const isUpdating = updatingId === u.user_id;
              const displayName = u.full_name || u.email.split("@")[0];
              const initials = displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={u.user_id}
                  className="flex items-center gap-4 px-4 py-3 bg-card hover:bg-secondary/30 transition-colors"
                >
                  {/* Avatar */}
                  {u.avatar_url ? (
                    <img
                      src={u.avatar_url}
                      alt={displayName}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                      {initials}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                      {isSelf && (
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">you</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  </div>

                  {/* Role toggle */}
                  <div className="flex items-center gap-2 shrink-0">
                    {u.role === "admin" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-foreground text-background text-xs font-semibold">
                        <ShieldCheck size={12} />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-muted-foreground text-xs font-medium">
                        <Shield size={12} />
                        Viewer
                      </span>
                    )}

                    {!isSelf && (
                      <button
                        onClick={() => handleRoleChange(u.user_id, u.role === "admin" ? "viewer" : "admin")}
                        disabled={isUpdating}
                        className="text-xs px-2.5 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                      >
                        {isUpdating ? "..." : u.role === "admin" ? "Demote" : "Promote"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
