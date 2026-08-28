'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { Avatar } from '@/components/ui';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  if (pathname === '/' || pathname?.startsWith('/dashboard')) {
    return null;
  }

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
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg accent-bg text-white flex items-center justify-center">
                <span className="font-extrabold text-sm">P</span>
              </div>
              <span>Praxis</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link href="/courses" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Courses
              </Link>
              <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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
                      className="flex items-center justify-center gap-2 font-medium rounded-lg transition-all h-8 px-3 text-[13px] bg-muted text-foreground hover:bg-muted/80"
                    >
                      Dashboard
                    </Link>
                    <div className="relative group">
                      <button className="flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-colors border border-transparent focus:border-border outline-none">
                        <Avatar name={user.username || 'User'} size={32} tone="var(--accent, #4f46e5)" />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2">
                        <div className="px-4 py-2 border-b border-border mb-2">
                          <p className="font-semibold text-foreground truncate text-sm">{user.username}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          <p className="text-xs accent-text font-semibold mt-1 uppercase tracking-wider">{user.role?.name}</p>
                        </div>
                        <button 
                          onClick={logout}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-muted text-left transition-colors w-full"
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
                      className="flex items-center justify-center gap-2 font-medium rounded-lg transition-all h-8 px-3 text-[13px] bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      Log in
                    </Link>
                    <Link 
                      href="/register" 
                      className="flex items-center justify-center gap-2 font-medium rounded-lg transition-all h-8 px-3 text-[13px] accent-bg text-white hover:brightness-110 shadow-sm"
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
