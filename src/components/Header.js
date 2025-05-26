import React, { useState } from 'react';
import { CheckCircle, Clock, Zap, Trophy, Settings, Share2, HelpCircle, Sun, Moon, LogOut, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import NotificationCenter from './NotificationCenter';

const Header = ({ 
  completionPercentage, 
  completedTasks, 
  totalHours, 
  dailyStreak, 
  achievements,
  onHelpClick,
  children,
  darkMode,
  toggleDarkMode,
  onLogout,
  user
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'My Quant Journey Progress',
        text: `I've completed ${completedTasks} tasks and invested ${Math.round(totalHours)} hours in my quant journey!`,
        url: window.location.href
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        setShowShare(true);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-lg border-b ${darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section - Logo and Stats */}
          <div className="flex items-center space-x-8">
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Quant Tracker
            </h1>
            <div className="hidden md:flex items-center space-x-6">
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">{completionPercentage}%</span> Complete
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {completedTasks} tasks completed
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {totalHours} hours tracked
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {dailyStreak} day streak
              </div>
            </div>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center space-x-4">
            <NotificationCenter />
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              className={`p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              className={`p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              className={`p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center space-x-2 p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline-block">{user?.displayName || 'User'}</span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                <div className="py-1">
                  <button
                    onClick={onLogout}
                    className={`flex items-center w-full px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daily Goal (hours)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter daily goal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notification Preferences
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <input type="checkbox" className="rounded" />
                    <span>Daily Reminders</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <input type="checkbox" className="rounded" />
                    <span>Progress Updates</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Share Progress</h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Share your progress with friends and on social media!
              </p>
              <div className="flex gap-2">
                <button className="flex-1 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Twitter
                </button>
                <button className="flex-1 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                  WhatsApp
                </button>
                <button className="flex-1 p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                  Copy Link
                </button>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowShare(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 