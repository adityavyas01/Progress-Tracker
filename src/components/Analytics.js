import React, { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, Clock, Calendar, Award, Target, Brain } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = ({
  stats,
  dailyProgress,
  weeklyProgress,
  categoryProgress,
  timeDistribution,
  achievements,
  taskData,
  dailyStreak
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Chart configurations
  const dailyProgressData = {
    labels: dailyProgress.map(day => day.date),
    datasets: [
      {
        label: 'Daily Progress',
        data: dailyProgress.map(day => day.progress),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4,
      },
    ],
  };

  const categoryProgressData = {
    labels: categoryProgress.map(cat => cat.name),
    datasets: [
      {
        data: categoryProgress.map(cat => cat.progress),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const timeDistributionData = {
    labels: timeDistribution.map(item => item.category),
    datasets: [
      {
        label: 'Hours Spent',
        data: timeDistribution.map(item => item.hours),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
          <BarChart2 className="w-6 h-6" />
          Progress Analytics
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTimeframe('week')}
            className={`px-3 py-1 rounded-lg text-sm ${
              selectedTimeframe === 'week'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedTimeframe('month')}
            className={`px-3 py-1 rounded-lg text-sm ${
              selectedTimeframe === 'month'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Overall Progress</span>
          </div>
          <div className="text-2xl font-bold dark:text-white">{stats.completionPercentage}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{stats.completedTasks} tasks done</div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Time Invested</span>
          </div>
          <div className="text-2xl font-bold dark:text-white">{Math.round(stats.totalHours)}h</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total learning time</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Current Streak</span>
          </div>
          <div className="text-2xl font-bold dark:text-white">{stats.streak} days</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Consistent learning</div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-2">
            <Award className="w-5 h-5" />
            <span className="font-medium">Achievements</span>
          </div>
          <div className="text-2xl font-bold dark:text-white">{achievements.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Milestones unlocked</div>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily Progress */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold mb-4 dark:text-white">Daily Progress</h3>
          <div className="h-64">
            <Line data={dailyProgressData} options={chartOptions} />
          </div>
        </div>

        {/* Category Progress */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold mb-4 dark:text-white">Category Progress</h3>
          <div className="h-64">
            <Doughnut data={categoryProgressData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Time Distribution */}
      <div className="mt-8">
        <h3 className="font-semibold mb-4 dark:text-white">Time Distribution</h3>
        <div className="h-64">
          <Bar data={timeDistributionData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="mt-8">
        <h3 className="font-semibold mb-4 dark:text-white">Recent Achievements</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.slice(0, 4).map((achievement, idx) => (
            <div key={idx} className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-2">
                <Award className="w-5 h-5" />
                <span className="font-medium">{achievement.title}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">{achievement.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold mb-4 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Focus Areas
          </h3>
          <div className="space-y-3">
            {categoryProgress.map((category, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm dark:text-gray-300">{category.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${category.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{category.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold mb-4 dark:text-white flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Learning Insights
          </h3>
          <div className="space-y-3">
            <div className="text-sm dark:text-gray-300">
              <p>• Most productive time: {stats.mostProductiveTime || 'Morning'}</p>
              <p>• Average daily study: {Math.round(stats.averageDailyHours || 2)} hours</p>
              <p>• Best performing category: {stats.bestCategory || 'DSA'}</p>
              <p>• Completion rate: {stats.completionRate || '75'}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 