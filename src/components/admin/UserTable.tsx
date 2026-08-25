'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserRole, deleteUser } from '@/lib/actions/admin';
import { Loader2, Trash2 } from 'lucide-react';
import { Card, Avatar, Select, Button, useToast, Badge } from '@/components/ui';

type UserTableProps = {
  users: any[];
  roles: any[];
};

export default function UserTable({ users: initialUsers, roles }: UserTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  const handleRoleChange = async (userId: string, newRoleId: number) => {
    setLoadingId(userId);
    try {
      await updateUserRole(userId, newRoleId);
      setUsers(users.map(u => 
        u.documentId === userId ? { ...u, role: roles.find(r => r.id === newRoleId) } : u
      ));
      router.refresh();
      toast("Role updated successfully", "success");
    } catch (err: any) {
      toast(err.message || 'Failed to update role', "danger");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    setLoadingId(userId);
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.documentId !== userId));
      router.refresh();
      toast("User deleted successfully", "success");
    } catch (err: any) {
      toast(err.message || 'Failed to delete user', "danger");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="table-container">
        <table>
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="font-semibold text-muted-foreground text-sm">User</th>
              <th className="font-semibold text-muted-foreground text-sm">Email</th>
              <th className="font-semibold text-muted-foreground text-sm">Joined</th>
              <th className="font-semibold text-muted-foreground text-sm w-48">Role</th>
              <th className="font-semibold text-muted-foreground text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.documentId} className="border-b border-border hover:bg-muted transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.username || 'User'} size={32} />
                    <div className="font-medium text-foreground">{user.username}</div>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground text-sm">{user.email}</td>
                <td className="p-4 text-muted-foreground text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <Select
                    value={user.role?.id || ''}
                    onChange={(e) => handleRoleChange(user.documentId, parseInt(e.target.value))}
                    disabled={loadingId === user.documentId}
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </Select>
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(user.documentId)}
                    disabled={loadingId === user.documentId}
                    title="Delete User"
                    className="text-danger hover:bg-danger-soft hover:text-danger"
                  >
                    {loadingId === user.documentId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="p-8 text-center text-muted-foreground text-sm">No users found.</div>
      )}
    </Card>
  );
}
