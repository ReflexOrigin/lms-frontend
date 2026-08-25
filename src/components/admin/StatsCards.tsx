'use client';

type StatsCardsProps = {
  stats: {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    totalLessons: number;
  };
};

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { title: 'Total Users', value: stats.totalUsers, icon: '👤', color: 'bg-blue-500' },
    { title: 'Total Courses', value: stats.totalCourses, icon: '📚', color: 'bg-purple-500' },
    { title: 'Total Enrollments', value: stats.totalEnrollments, icon: '🎓', color: 'bg-green-500' },
    { title: 'Total Lessons', value: stats.totalLessons, icon: '🎥', color: 'bg-orange-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 transition-transform hover:-translate-y-1">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-white ${card.color} shadow-md`}>
            <span aria-hidden="true">{card.icon}</span>
          </div>
          <div>
            <p className="text-gray-500 font-medium">{card.title}</p>
            <h3 className="text-3xl font-extrabold text-gray-900">{card.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
