import React from 'react';
import { CheckCircle, Clock, Zap, Trophy, Settings, Share2, HelpCircle } from 'lucide-react';

const Header = ({ 
  completionPercentage, 
  completedTasks, 
  totalHours, 
  dailyStreak, 
  achievements, 
  onHelpClick, 
  onSettingsClick 
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white p-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
              🚀 Tier 3 → HFT Journey Tracker
              <button 
                onClick={onHelpClick}
                className="text-white/80 hover:text-white transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </h1>
            <p className="text-xl opacity-90">Your 8-month roadmap from Full Stack Dev to Quantitative Trading</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onSettingsClick}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {/* Share functionality */}}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Progress</span>
            </div>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <div className="text-sm opacity-80">{completedTasks} tasks completed</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Time Invested</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(totalHours)}h</div>
            <div className="text-sm opacity-80">Total learning hours</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">Streak</span>
            </div>
            <div className="text-2xl font-bold">{dailyStreak} days</div>
            <div className="text-sm opacity-80">Current streak</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">Achievements</span>
            </div>
            <div className="text-2xl font-bold">{achievements.size}</div>
            <div className="text-sm opacity-80">Milestones unlocked</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 