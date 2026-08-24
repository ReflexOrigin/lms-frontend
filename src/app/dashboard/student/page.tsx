'use client';
import { useAuth } from '@/contexts/AuthContext';
export default function StudentDashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">Logout</button>
    </div>
  );
}
