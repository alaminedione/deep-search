import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Search, Clock, TrendingUp, Star, Activity } from 'lucide-react';

interface HomeStatsProps {
  searchHistory: any[];
}

export const HomeStats = ({ searchHistory }: HomeStatsProps) => {
  const [stats, setStats] = useState({
    totalSearches: 0,
    todaySearches: 0,
    favoriteSearches: 0,
    avgSearchesPerDay: 0,
    mostUsedEngine: 'google.com',
    topCategories: [] as string[]
  });

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySearches = searchHistory.filter(search => {
      const searchDate = new Date(search.timestamp);
      searchDate.setHours(0, 0, 0, 0);
      return searchDate.getTime() === today.getTime();
    }).length;

    const favoriteSearches = searchHistory.filter(search => search.isFavorite).length;

    // Calculate average searches per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSearches = searchHistory.filter(search => 
      new Date(search.timestamp) >= sevenDaysAgo
    );
    const avgSearchesPerDay = Math.round(recentSearches.length / 7);

    // Find most used search engine
    const engineCounts = searchHistory.reduce((acc, search) => {
      acc[search.searchEngine] = (acc[search.searchEngine] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostUsedEngine = Object.keys(engineCounts).reduce((a, b) => 
      (engineCounts[a] || 0) > (engineCounts[b] || 0) ? a : b, 'google.com'
    );

    // Get top categories
    const categoryCounts = searchHistory.reduce((acc, search) => {
      if (search.category) {
        acc[search.category] = (acc[search.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    const topCategories = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([category]) => category);

    setStats({
      totalSearches: searchHistory.length,
      todaySearches,
      favoriteSearches,
      avgSearchesPerDay,
      mostUsedEngine,
      topCategories
    });
  }, [searchHistory]);

  const statCards = [
    {
      title: "Recherches totales",
      value: stats.totalSearches,
      icon: Search,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Aujourd'hui",
      value: stats.todaySearches,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Favoris",
      value: stats.favoriteSearches,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Moyenne/jour",
      value: stats.avgSearchesPerDay,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center hover:shadow-md transition-shadow h-full">
              <CardContent className="pt-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold break-words">{stat.value}</div>
                <p className="text-sm text-muted-foreground break-words">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Activity Summary */}
      {searchHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Résumé d'activité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Moteur préféré:</span>
                <Badge variant="secondary">
                  {stats.mostUsedEngine === 'google.com' ? 'Google' : 'DuckDuckGo'}
                </Badge>
              </div>
              
              {stats.topCategories.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground mb-2 block">Catégories populaires:</span>
                  <div className="flex flex-wrap gap-2">
                    {stats.topCategories.map((category) => (
                      <Badge key={category} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};