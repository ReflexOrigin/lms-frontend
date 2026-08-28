'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, BookOpen, GraduationCap, LayoutDashboard, Sparkles, TrendingUp, Users, PlayCircle, Star, BadgeCheck, BarChart3 } from 'lucide-react';
import { Button, cx, Badge, Avatar } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.role?.type === 'admin_role' || user.role?.type === 'content_manager') return '/dashboard/admin';
    if (user.role?.type === 'instructor') return '/dashboard/instructor';
    return '/dashboard/student';
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[var(--color-primary)] opacity-[0.05] blur-[100px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-instructor)] opacity-[0.05] blur-[100px] mix-blend-multiply" />
      </div>

      {/* Navigation */}
      <header className="relative z-50 flex items-center justify-between px-6 lg:px-8 h-20 max-w-[1200px] mx-auto w-full bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl accent-bg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
            <span className="font-extrabold text-sm">P</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            Praxis
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          {!mounted || loading ? (
            <div className="w-24 h-9 bg-muted rounded-full animate-pulse" />
          ) : user ? (
            <Link href={getDashboardRoute()} className="inline-flex items-center justify-center gap-2 font-medium rounded-[10px] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none accent-ring select-none h-10 px-4 text-sm accent-bg text-white hover:brightness-110 shadow-sm rounded-full hover:scale-105">
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          ) : (
            <>
              <a href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Log in
              </a>
              <a href="/register" className="inline-flex items-center justify-center gap-2 font-medium rounded-[10px] transition-all duration-150 accent-ring select-none h-10 px-4 text-sm accent-bg text-white hover:brightness-110 shadow-sm rounded-full hover:scale-105 font-medium">
                Get Started
              </a>
            </>
          )}
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full px-6 py-20 lg:py-28 flex flex-col items-center text-center max-w-[1200px] mx-auto">
          <Badge tone="accent" className="mb-8 px-4 py-1.5 shadow-sm border border-border/50">
            <Sparkles size={14} className="mr-1.5" /> Welcome to the future of learning
          </Badge>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-foreground">
            Master new skills with <br className="hidden lg:block" />
            <span className="accent-text">
              intelligent learning
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl font-light leading-relaxed">
            Praxis is a next-generation platform designed to accelerate your growth. Access premium courses, track your progress, and learn from industry experts in a distraction-free environment.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {!mounted || loading ? (
               <div className="w-48 h-12 bg-muted rounded-full animate-pulse" />
            ) : user ? (
              <Link href={getDashboardRoute()} className="inline-flex items-center justify-center gap-2 font-medium rounded-[10px] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none accent-ring select-none h-12 px-6 text-[15px] accent-bg text-white hover:brightness-110 shadow-sm rounded-full hover:scale-105 w-full sm:w-auto shadow-md">
                Go to Workspace
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <a href="/register" className="inline-flex items-center justify-center gap-2 font-medium rounded-[10px] transition-all duration-150 accent-ring select-none h-12 px-6 text-[15px] accent-bg text-white hover:brightness-110 shadow-sm rounded-full hover:scale-105 w-full sm:w-auto shadow-md">
                  Start Learning Free
                  <ArrowRight size={18} />
                </a>
                <Link href="/courses" className="inline-flex items-center justify-center gap-2 font-medium rounded-[10px] transition-all duration-150 accent-ring select-none h-12 px-6 text-[15px] border border-border bg-card text-foreground hover:bg-muted rounded-full hover:scale-105 w-full sm:w-auto">
                  <PlayCircle size={18} />
                  Browse courses
                </Link>
              </>
            )}
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Star size={16} className="fill-[var(--color-warning)] text-[var(--color-warning)]" />
              4.9 average rating
            </span>
            <span className="flex items-center gap-2">
              <Users size={16} className="text-muted-foreground" />
              10,000+ active learners
            </span>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="w-full bg-card border-y border-border">
          <div className="max-w-[1200px] mx-auto px-6 py-20">
            <h2 className="text-3xl font-semibold tracking-tight text-center mb-16">Why learners choose Praxis</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: BookOpen, title: "Premium Content", body: "Access hundreds of expertly crafted courses spanning the latest technologies and methodologies.", tone: "accent" },
                { icon: TrendingUp, title: "Track Progress", body: "Visualize your learning journey with advanced analytics and meaningful milestones.", tone: "success" },
                { icon: Users, title: "Expert Instruction", body: "Learn directly from verified industry professionals and engaging content managers.", tone: "info" },
                { icon: BadgeCheck, title: "Verifiable Skills", body: "Earn certificates that prove your real-world capabilities to employers.", tone: "warning" }
              ].map((b, i) => (
                <div key={i} className="p-6 rounded-2xl border border-border bg-background/50 hover:bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-[var(--color-${b.tone}-soft)] text-[var(--color-${b.tone})]`}>
                    <b.icon size={24} strokeWidth={2} />
                  </div>
                  <h3 className="font-semibold text-[17px] text-foreground mb-2">{b.title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 rounded-md accent-bg flex items-center justify-center text-white">
              <span className="font-bold text-[10px]">P</span>
            </div>
            <span>© 2026 Praxis Learning. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
