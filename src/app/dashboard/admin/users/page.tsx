import { getAdminUsers, getAllRoles } from '@/lib/actions/admin';
import Link from 'next/link';
import UserTable from '@/components/admin/UserTable';

export default async function AdminUsersPage() {
  const [users, roles] = await Promise.all([
    getAdminUsers().catch(() => []),
    getAllRoles().catch(() => [])
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/dashboard/admin" className="text-blue-600 hover:underline mb-8 inline-block font-medium">
        ← Back to Dashboard
      </Link>
      
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-2">View all registered users and manage their roles across the platform.</p>
        </div>
        <div className="text-sm font-semibold text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
          Total Users: {users?.length || 0}
        </div>
      </div>

      <UserTable users={users || []} roles={roles || []} />
    </div>
  );
}
