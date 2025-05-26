import React from 'react';
import { BarChart2, TrendingUp, Clock, Calendar, Award } from 'lucide-react';

const Analytics = ({
  stats,
  dailyProgress,
  weeklyProgress,
  categoryProgress,
  timeDistribution,
  achievements
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BarChart2 className="w-6 h-6" />
        Progress Analytics
      </h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Overall Progress</span>
          </div>
          <div className="text-2xl font-bold">{stats.completionPercentage}%</div>
          <div className="text-sm text-gray-600">{stats.completedTasks} tasks done</div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Time Invested</span>
          </div>
          <div className="text-2xl font-bold">{Math.round(stats.totalHours)}h</div>
          <div className="text-sm text-gray-600">Total learning time</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Current Streak</span>
          </div>
          <div className="text-2xl font-bold">{stats.streak} days</div>
          <div className="text-sm text-gray-600">Consistent learning</div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <Award className="w-5 h-5" />
            <span className="font-medium">Achievements</span>
          </div>
          <div className="text-2xl font-bold">{achievements.length}</div>
          <div className="text-sm text-gray-600">Milestones unlocked</div>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily Progress */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Daily Progress</h3>
          <div className="h-48 flex items-end gap-1">
            {dailyProgress.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${day.progress}%` }}
                />
                <div className="text-xs text-gray-600 mt-1">{day.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Progress */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Category Progress</h3>
          <div className="space-y-4">
            {categoryProgress.map((category, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-sm text-gray-600">{category.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${category.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Distribution */}
      <div className="mt-8">
        <h3 className="font-semibold mb-4">Time Distribution</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {timeDistribution.map((item, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{item.category}</span>
                <span className="text-sm text-gray-600">{item.hours}h</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                  style={{ width: `${(item.hours / stats.totalHours) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="mt-8">
        <h3 className="font-semibold mb-4">Recent Achievements</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.slice(0, 4).map((achievement, idx) => (
            <div key={idx} className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-600 mb-2">
                <Award className="w-5 h-5" />
                <span className="font-medium">{achievement.title}</span>
              </div>
              <p className="text-sm text-gray-600">{achievement.description}</p>
              <div className="text-xs text-gray-500 mt-2">{achievement.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics; 