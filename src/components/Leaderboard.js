import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, CheckCircle, Clock, Flame, Star, Medal, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { leaderboardService } from '../services/leaderboardService';

const Leaderboard = ({ userId }) => {
  const { darkMode } = useTheme();
  const [activeCategory, setActiveCategory] = useState('overall');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousRanks, setPreviousRanks] = useState({});

  const loadLeaderboardData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const [categoryData, userRankData] = await Promise.all([
        leaderboardService.getCategoryLeaderboard(activeCategory),
        leaderboardService.getUserRank(userId)
      ]);
      
      // Store previous ranks for trend calculation
      setPreviousRanks(prev => {
        const newRanks = { ...prev };
        categoryData.forEach(user => {
          newRanks[user.id] = user.rank;
        });
        return newRanks;
      });
      
      setLeaderboardData(categoryData);
      setUserRank(userRankData);
      
      if (categories.length === 0) {
        const cats = await leaderboardService.getLeaderboardCategories();
        setCategories(cats);
      }
    } catch (err) {
      console.error('Error loading leaderboard data:', err);
      setError('Failed to load leaderboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, userId, categories]);

  useEffect(() => {
    loadLeaderboardData();
  }, [loadLeaderboardData]);

  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case 'overall':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'tasks':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'hours':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'streak':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'achievements':
        return <Star className="w-5 h-5 text-purple-500" />;
      default:
        return <Trophy className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryValue = (user, category) => {
    switch (category) {
      case 'tasks':
        return user.completedTasks;
      case 'hours':
        return Math.round(user.totalHours);
      case 'streak':
        return user.streak;
      case 'achievements':
        return user.achievements.length;
      default:
        return user.score;
    }
  };

  const getMedalIcon = (index) => {
    switch (index) {
      case 0:
        return <Medal className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getTrendIndicator = (userId) => {
    const currentRank = leaderboardData.find(user => user.id === userId)?.rank;
    const previousRank = previousRanks[userId];
    
    if (!previousRank || !currentRank) return null;
    
    const difference = previousRank - currentRank;
    if (difference > 0) {
      return (
        <div className="flex items-center text-green-500">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs ml-1">+{difference}</span>
        </div>
      );
    } else if (difference < 0) {
      return (
        <div className="flex items-center text-red-500">
          <TrendingUp className="w-4 h-4 transform rotate-180" />
          <span className="text-xs ml-1">{difference}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${darkMode ? 'border border-gray-700' : ''}`}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Leaderboard</h2>
        
        {error && (
          <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-50 text-red-700'}`}>
            {error}
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {getCategoryIcon(category.id)}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* User's Rank */}
            {userRank && (
              <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Your Rank</h3>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>#{userRank}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            )}

            {/* Leaderboard List */}
            <div className="space-y-4">
              {leaderboardData.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                    user.id === userId
                      ? darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                      : darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0 w-8">
                    {index < 3 ? (
                      getMedalIcon(index)
                    ) : (
                      <span className={`text-lg font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        #{index + 1}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {getCategoryValue(user, activeCategory)} {activeCategory === 'hours' ? 'hours' : 'points'}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {user.completedTasks} tasks
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {user.streak} day streak
                      </span>
                      {getTrendIndicator(user.id)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard; 