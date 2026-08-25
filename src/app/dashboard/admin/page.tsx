import { getAdminStats } from '@/lib/actions/admin';
import Link from 'next/link';
import StatsCards from '@/components/admin/StatsCards';

export default async function AdminDashboard() {
  const stats = await getAdminStats().catch(() => null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform overview and management.</p>
        </div>
      </div>

      {stats ? (
        <StatsCards stats={stats} />
      ) : (
        <div className="p-6 bg-red-50 text-red-600 border border-red-200 rounded-lg">
          Failed to load statistics. Ensure you have admin privileges.
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          href="/dashboard/admin/users"
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
            <span aria-hidden="true">👥</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Users</h3>
          <p className="text-gray-500 text-sm">View all users, change roles, or remove accounts.</p>
        </Link>
        
        {/* We can add more links to manage courses and blogs here later */}
      </div>
    </div>
  );
}
