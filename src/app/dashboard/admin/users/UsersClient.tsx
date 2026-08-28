"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Ban, CheckCircle, MoreHorizontal, Search, Trash2, UserCog } from "lucide-react";
import { Page, NewButton } from "@/components/Page";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Field,
  Input,
  Modal,
  Select,
  StatusPill,
  useToast,
} from "@/components/ui";

type Role = "admin" | "manager" | "instructor" | "student";

const roleTone: Record<Role, "accent" | "info" | "success" | "warning"> = {
  admin: "accent",
  manager: "warning",
  instructor: "success",
  student: "info",
};

const roleLabels: Record<Role, string> = {
  admin: "Administrator",
  manager: "Content Manager",
  instructor: "Instructor",
  student: "Student",
};

export default function UsersClient({ initialUsers, roles }: { initialUsers: any[]; roles: any[] }) {
  const router = useRouter();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const [roleEditor, setRoleEditor] = useState<any | null>(null);
  const [newRoleId, setNewRoleId] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<{ user: any; action: "suspend" | "unsuspend" | "delete" } | null>(null);
  const [loading, setLoading] = useState(false);

  let list = initialUsers;
  if (roleFilter !== "all") {
    list = list.filter((u) => {
      const normalizedRole = u.role?.name?.toLowerCase() || 'student';
      let mappedRole = "student";
      if (normalizedRole.includes("admin")) mappedRole = "admin";
      else if (normalizedRole.includes("manager")) mappedRole = "manager";
      else if (normalizedRole.includes("instructor")) mappedRole = "instructor";
      
      return mappedRole === roleFilter;
    });
  }
  if (query) {
    list = list.filter(
      (u) => 
        (u.username || '').toLowerCase().includes(query.toLowerCase()) || 
        (u.email || '').toLowerCase().includes(query.toLowerCase())
    );
  }

  const openRoleEditor = (u: any) => {
    setMenuFor(null);
    setNewRoleId(u.role?.id || null);
    setRoleEditor(u);
  };

  const applyRole = async () => {
    if (!roleEditor || !newRoleId) return;
    setLoading(true);
    try {
      const { updateUserRole } = await import('@/lib/actions/admin');
      await updateUserRole(roleEditor.documentId, newRoleId);
      toast(`${roleEditor.username || 'User'} role updated successfully`, "success");
      setRoleEditor(null);
      router.refresh();
    } catch (err: any) {
      toast(err.message || 'Failed to update role', "danger");
    } finally {
      setLoading(false);
    }
  };

  const applyConfirm = async () => {
    if (!confirm) return;
    setLoading(true);
    try {
      if (confirm.action === "delete") {
        const { deleteUser } = await import('@/lib/actions/admin');
        await deleteUser(confirm.user.documentId);
        toast(`${confirm.user.username || 'User'} was removed`, "danger");
      } else {
        const blocked = confirm.action === "suspend";
        const { suspendUser } = await import('@/lib/actions/admin');
        await suspendUser(confirm.user.documentId, blocked);
        toast(
          `${confirm.user.username || 'User'} was ${blocked ? 'suspended' : 'unsuspended'}`,
          blocked ? "warning" : "success"
        );
      }
      setConfirm(null);
      router.refresh();
    } catch (err: any) {
      toast(err.message || 'Action failed', "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page
      title="User Management"
      subtitle={`${initialUsers.length} accounts across all roles`}
      actions={<NewButton label="Invite user" />}
    >
      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-border">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search name or email" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="sm:w-48">
            <option value="all">All roles</option>
            <option value="admin">Administrator</option>
            <option value="manager">Content Manager</option>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-muted/40">
                <th className="font-medium px-5 py-3">User</th>
                <th className="font-medium px-3 py-3">Role</th>
                <th className="font-medium px-3 py-3">Status</th>
                <th className="font-medium px-3 py-3">Created</th>
                <th className="font-medium px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.length > 0 ? list.map((u) => {
                const normalizedRole = (u.role?.name?.toLowerCase() as Role) || "student";
                // Map complex strapi roles down to our 4 simple ones for the UI if necessary
                let displayRole: Role = "student";
                if (normalizedRole.includes("admin")) displayRole = "admin";
                else if (normalizedRole.includes("manager")) displayRole = "manager";
                else if (normalizedRole.includes("instructor")) displayRole = "instructor";
                
                return (
                  <tr key={u.documentId || u.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.username} size={34} />
                        <div>
                          <div className="font-medium">{u.username}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={roleTone[displayRole]}>{roleLabels[displayRole]}</Badge>
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill status={u.blocked ? "suspended" : u.confirmed ? "active" : "offline"} />
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-right relative">
                      <button
                        onClick={() => setMenuFor(menuFor === u.documentId ? null : u.documentId)}
                        className="w-8 h-8 rounded-lg hover:bg-muted inline-flex items-center justify-center text-muted-foreground"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      {menuFor === u.documentId && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setMenuFor(null)} />
                          <div className="absolute right-5 mt-1 w-44 bg-card border border-border rounded-xl shadow-xl z-40 p-1.5 text-left animate-in">
                            <button onClick={() => openRoleEditor(u)} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm hover:bg-muted">
                              <UserCog size={15} /> Change role
                            </button>
                            <button
                              onClick={() => {
                                setMenuFor(null);
                                setConfirm({ user: u, action: u.blocked ? "unsuspend" : "suspend" });
                              }}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm hover:bg-muted"
                            >
                              {u.blocked ? <CheckCircle size={15} /> : <Ban size={15} />}
                              {u.blocked ? 'Unsuspend' : 'Suspend'}
                            </button>
                            <button
                              onClick={() => {
                                setMenuFor(null);
                                setConfirm({ user: u, action: "delete" });
                              }}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]"
                            >
                              <Trash2 size={15} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                )
              }) : (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Change Role modal */}
      <Modal
        open={!!roleEditor}
        onClose={() => setRoleEditor(null)}
        title="Change role"
        footer={
          <>
            <Button variant="outline" onClick={() => setRoleEditor(null)}>
              Cancel
            </Button>
            <Button onClick={applyRole} disabled={loading || newRoleId === roleEditor?.role?.id}>
              {loading ? 'Applying…' : 'Apply change'}
            </Button>
          </>
        }
      >
        {roleEditor && (
          <div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
              <Avatar name={roleEditor.username} size={40} />
              <div>
                <div className="font-medium">{roleEditor.username}</div>
                <div className="text-xs text-muted-foreground">{roleEditor.email}</div>
              </div>
            </div>

            <div className="mt-4">
              <Field label="Assign role">
                <Select value={newRoleId ?? ''} onChange={(e) => setNewRoleId(Number(e.target.value))}>
                  {roles.map((r: any) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </Select>
              </Field>
            </div>

            {newRoleId !== roleEditor?.role?.id && (
              <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-[var(--color-warning-soft)] text-[var(--color-warning)] text-sm">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p>
                  Change {roleEditor.username} from{" "}
                  <strong>{roleEditor.role?.name || 'Student'}</strong> to{" "}
                  <strong>{roles.find((r: any) => r.id === newRoleId)?.name || 'Unknown'}</strong>?{" "}
                  This immediately changes their permissions and navigation.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Destructive confirmation */}
      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.action === "delete" ? "Delete user" : confirm?.action === "suspend" ? "Suspend user" : "Unsuspend user"}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button variant={confirm?.action === "unsuspend" ? "primary" : "danger"} onClick={applyConfirm} disabled={loading}>
              {loading ? 'Processing…' : confirm?.action === "delete" ? "Delete account" : confirm?.action === "suspend" ? "Suspend account" : "Unsuspend account"}
            </Button>
          </>
        }
      >
        {confirm && (
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-xl bg-[var(--color-danger-soft)] text-[var(--color-danger)] flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </span>
            <p className="text-sm text-muted-foreground">
              {confirm.action === "delete" ? (
                <>
                  Permanently delete <strong className="text-foreground">{confirm.user.username}</strong>? This
                  revokes all access and cannot be undone.
                </>
              ) : confirm.action === "suspend" ? (
                <>
                  Suspend <strong className="text-foreground">{confirm.user.username}</strong>? They will be
                  signed out and unable to access the platform until reinstated.
                </>
              ) : (
                <>
                  Unsuspend <strong className="text-foreground">{confirm.user.username}</strong>? They will
                  regain access to the platform immediately.
                </>
              )}
            </p>
          </div>
        )}
      </Modal>
    </Page>
  );
}
