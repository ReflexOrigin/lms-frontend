'use client';

import { StatCard } from '@/components/ui';
import { Users, BookOpen, GraduationCap, Video } from 'lucide-react';

type StatsCardsProps = {
  stats: {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    totalLessons: number;
  };
};

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        label="Total Users" 
        value={stats.totalUsers} 
        icon={<Users size={16} />} 
        accentIcon 
      />
      <StatCard 
        label="Total Courses" 
        value={stats.totalCourses} 
        icon={<BookOpen size={16} />} 
      />
      <StatCard 
        label="Total Enrollments" 
        value={stats.totalEnrollments} 
        icon={<GraduationCap size={16} />} 
      />
      <StatCard 
        label="Total Lessons" 
        value={stats.totalLessons} 
        icon={<Video size={16} />} 
      />
    </div>
  );
}
