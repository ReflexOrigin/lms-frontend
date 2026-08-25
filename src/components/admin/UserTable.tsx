'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserRole, deleteUser } from '@/lib/actions/admin';
import { Loader2, Trash2, CheckCircle } from 'lucide-react';

type UserTableProps = {
  users: any[];
  roles: any[];
};

export default function UserTable({ users: initialUsers, roles }: UserTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleRoleChange = async (userId: string, newRoleId: number) => {
    setLoadingId(userId);
    try {
      await updateUserRole(userId, newRoleId);
      setUsers(users.map(u => 
        u.documentId === userId ? { ...u, role: roles.find(r => r.id === newRoleId) } : u
      ));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
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
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-bold text-gray-700">User</th>
              <th className="p-4 font-bold text-gray-700">Email</th>
              <th className="p-4 font-bold text-gray-700">Joined</th>
              <th className="p-4 font-bold text-gray-700 w-48">Role</th>
              <th className="p-4 font-bold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.documentId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-gray-900">{user.username}</div>
                </td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4 text-gray-500 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <select
                    value={user.role?.id || ''}
                    onChange={(e) => handleRoleChange(user.documentId, parseInt(e.target.value))}
                    disabled={loadingId === user.documentId}
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(user.documentId)}
                    disabled={loadingId === user.documentId}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block disabled:opacity-50"
                    title="Delete User"
                  >
                    {loadingId === user.documentId ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="p-8 text-center text-gray-500">No users found.</div>
      )}
    </div>
  );
}
