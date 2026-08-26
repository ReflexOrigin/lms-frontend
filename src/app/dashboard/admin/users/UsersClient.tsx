"use client";
import { useState } from "react";
import { AlertTriangle, Ban, MoreHorizontal, Search, Trash2, UserCog } from "lucide-react";
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

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const toast = useToast();
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const [roleEditor, setRoleEditor] = useState<any | null>(null);
  const [newRole, setNewRole] = useState<Role>("student");
  const [confirm, setConfirm] = useState<{ user: any; action: "suspend" | "delete" } | null>(null);

  let list = users;
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
    setNewRole(u.role?.name?.toLowerCase() as Role || "student");
    setRoleEditor(u);
  };

  const applyRole = async () => {
    if (!roleEditor) return;
    
    // In a real app, we'd PUT to /api/users/:id or /api/users-permissions/roles
    // For now, update local state to mock the API success
    setUsers((us) => us.map((u) => {
      if (u.documentId === roleEditor.documentId) {
        return { ...u, role: { ...u.role, name: newRole } };
      }
      return u;
    }));
    
    toast(`${roleEditor.username || 'User'} role updated successfully`, "success");
    setRoleEditor(null);
  };

  const applyConfirm = async () => {
    if (!confirm) return;
    
    // In a real app, we'd DELETE /api/users/:id or PUT /api/users/:id (blocked: true)
    if (confirm.action === "delete") {
      setUsers((us) => us.filter((u) => u.documentId !== confirm.user.documentId));
      toast(`${confirm.user.username || 'User'} was removed`, "danger");
    } else {
      setUsers((us) =>
        us.map((u) => (u.documentId === confirm.user.documentId ? { ...u, blocked: true } : u))
      );
      toast(`${confirm.user.username || 'User'} was suspended`, "warning");
    }
    setConfirm(null);
  };

  return (
    <Page
      title="User Management"
      subtitle={`${users.length} accounts across all roles`}
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
                                setConfirm({ user: u, action: "suspend" });
                              }}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm hover:bg-muted"
                            >
                              <Ban size={15} /> Suspend
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
            <Button onClick={applyRole} disabled={newRole === roleEditor?.role?.name?.toLowerCase()}>
              Apply change
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
                <Select value={newRole} onChange={(e) => setNewRole(e.target.value as Role)}>
                  <option value="admin">Administrator</option>
                  <option value="manager">Content Manager</option>
                  <option value="instructor">Instructor</option>
                  <option value="student">Student</option>
                </Select>
              </Field>
            </div>

            {newRole !== roleEditor.role?.name?.toLowerCase() && (
              <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-[var(--color-warning-soft)] text-[var(--color-warning)] text-sm">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p>
                  Change {roleEditor.username} from{" "}
                  <strong>{roleEditor.role?.name || 'Student'}</strong> to{" "}
                  <strong>{roleLabels[newRole]}</strong>?{" "}
                  {newRole === "admin"
                    ? "This grants full platform control, including user management."
                    : "This immediately changes their permissions and navigation."}
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
        title={confirm?.action === "delete" ? "Delete user" : "Suspend user"}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={applyConfirm}>
              {confirm?.action === "delete" ? "Delete account" : "Suspend account"}
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
              ) : (
                <>
                  Suspend <strong className="text-foreground">{confirm.user.username}</strong>? They will be
                  signed out and unable to access the platform until reinstated.
                </>
              )}
            </p>
          </div>
        )}
      </Modal>
    </Page>
  );
}
