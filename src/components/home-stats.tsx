import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Search, Clock, TrendingUp } from 'lucide-react';

interface HomeStatsProps {
  searchTimestamps: number[];
}

export const HomeStats = ({ searchTimestamps }: HomeStatsProps) => {
  const [stats, setStats] = useState({
    totalSearches: 0,
    todaySearches: 0,
    avgSearchesPerDay: 0
  });

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySearches = searchTimestamps.filter(timestamp => {
      const searchDate = new Date(timestamp);
      searchDate.setHours(0, 0, 0, 0);
      return searchDate.getTime() === today.getTime();
    }).length;

    // Calculate average searches per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentSearches = searchTimestamps.filter(timestamp => 
      new Date(timestamp) >= sevenDaysAgo
    );
    const avgSearchesPerDay = Math.round(recentSearches.length / 7);

    setStats({
      totalSearches: searchTimestamps.length,
      todaySearches,
      avgSearchesPerDay
    });
  }, [searchTimestamps]);

  const statCards = [
    {
      title: "Recherches totales",
      value: stats.totalSearches,
      icon: Search,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Aujourd'hui",
      value: stats.todaySearches,
      icon: Clock,
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Moyenne/jour",
      value: stats.avgSearchesPerDay,
      icon: TrendingUp,
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="relative overflow-hidden border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                </div>
                
                {/* Decorative gradient overlay */}
                <div className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -translate-y-8 -translate-x-8 sm:-translate-y-10 sm:translate-x-10`} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};