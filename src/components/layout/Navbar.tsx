'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  const getDashboardLink = () => {
    const roleType = user?.role?.type;
    if (roleType === 'admin_role' || roleType === 'content_manager') {
      return '/dashboard/admin';
    }
    if (roleType === 'instructor') {
      return '/dashboard/instructor';
    }
    return '/dashboard/student';
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
              LMS<span className="text-gray-900">Platform</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link href="/courses" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Courses
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Blog
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link 
                      href={getDashboardLink()}
                      className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <div className="relative group">
                      <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-50 transition-colors border border-transparent focus:border-gray-200 outline-none">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                          {user.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2">
                        <div className="px-4 py-2 border-b border-gray-50 mb-2">
                          <p className="font-bold text-gray-900 truncate">{user.username}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          <p className="text-xs text-blue-600 font-semibold mt-1 uppercase tracking-wider">{user.role?.name}</p>
                        </div>
                        <button 
                          onClick={logout}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="text-gray-600 hover:text-blue-600 font-semibold transition-colors"
                    >
                      Log in
                    </Link>
                    <Link 
                      href="/register" 
                      className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
