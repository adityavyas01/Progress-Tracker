import React, { useState, useEffect } from 'react';
import { Download, Plus } from 'lucide-react';
import Header from './components/Header';
import Timer from './components/Timer';
import TaskCard from './components/TaskCard';
import HelpModal from './components/HelpModal';
import UserProfile from './components/UserProfile';
import StudyGroup from './components/StudyGroup';
import Analytics from './components/Analytics';
import Resources from './components/Resources';
import CustomTaskModal from './components/CustomTaskModal';
import NotificationCenter from './components/NotificationCenter';
import Leaderboard from './components/Leaderboard';
import BookmarkList from './components/BookmarkList';
import Login from './components/Login';
import { roadmapPhases, companyTargets } from './data/roadmap';
import { formatTime } from './utils/timer';
import { useTimer } from './hooks/useTimer';
import { useFirebase } from './hooks/useFirebase';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { taskService } from './services/taskService';
import { notificationService } from './services/notificationService';
import { leaderboardService } from './services/leaderboardService';
import { authService } from './services/authService';
import { userService } from './services/userService';

const QuantTracker = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // State management for all tracker data
  const [activePhase, setActivePhase] = useState(0);
  const [taskData, setTaskData] = useState({
    completedTasks: new Set(),
    dailyProgress: {},
    weeklyGoals: {},
    totalHours: 0,
    currentStreak: 0,
    startDate: new Date().toISOString().split('T')[0],
    notes: {},
    achievements: new Set()
  });
  const [favoriteTasks, setFavoriteTasks] = useState(new Set());
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [user] = useState({
    name: 'Your Name',
    bio: 'Full Stack Developer transitioning to Quant Trading',
    targetCompany: 'Graviton Research Capital',
    startDate: new Date().toISOString()
  });
  const [friends] = useState([
    { id: 1, name: 'Friend 1', progress: 45 },
    { id: 2, name: 'Friend 2', progress: 30 },
    { id: 3, name: 'Friend 3', progress: 60 }
  ]);
  const [studyGroup, setStudyGroup] = useState({
    name: 'Quant Study Group',
    description: 'Daily study sessions for quant preparation',
    schedule: 'Daily 6-8 PM IST',
    members: [
      { id: 1, name: 'You', isInCall: false, progress: 40 },
      { id: 2, name: 'Friend 1', isInCall: false, progress: 45 },
      { id: 3, name: 'Friend 2', isInCall: false, progress: 30 },
      { id: 4, name: 'Friend 3', isInCall: false, progress: 60 }
    ]
  });
  const [callState, setCallState] = useState({
    isInCall: false,
    isMuted: false,
    isVideoOff: false
  });
  const [messages, setMessages] = useState([]);
  const [showCustomTaskModal, setShowCustomTaskModal] = useState(false);
  const [customTasks, setCustomTasks] = useState([]);
  const [selectedTaskLocation, setSelectedTaskLocation] = useState(null);
  const [userId] = useState('user123'); // Replace with actual user ID from auth

  // Timer functionality
  const { timer, startTimer, pauseTimer, stopTimer } = useTimer((newTime) => {
    // Optional callback for time updates
  });

  // Initialize Firebase
  const { 
    updateProgress, 
    getProgress, 
    subscribeToProgress 
  } = useFirebase(authUser?.uid || 'guest');

  // Move all useEffect hooks to the top level
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      if (user) {
        const userData = await authService.getCurrentUser();
        setAuthUser(userData);
        // Load user preferences
        const preferences = await authService.getUserPreferences(user.uid);
        if (preferences) {
          toggleDarkMode(preferences.darkMode);
        }
      } else {
        setAuthUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (authUser) {
        const data = await getProgress();
        if (data) {
          setTaskData({
            ...taskData,
            completedTasks: new Set(data.completedTasks || []),
            dailyProgress: data.dailyProgress || {},
            weeklyGoals: data.weeklyGoals || {},
            totalHours: data.totalHours || 0,
            currentStreak: data.currentStreak || 0,
            startDate: data.startDate || new Date().toISOString().split('T')[0],
            notes: data.notes || {},
            achievements: new Set(data.achievements || [])
          });
        }
      }
    };
    loadData();
  }, [authUser]);

  useEffect(() => {
    const unsubscribe = subscribeToProgress((data) => {
      if (data) {
        setTaskData(prev => ({
          ...prev,
          completedTasks: new Set(data.completedTasks || []),
          dailyProgress: data.dailyProgress || {},
          weeklyGoals: data.weeklyGoals || {},
          totalHours: data.totalHours || 0,
          currentStreak: data.currentStreak || 0,
          notes: data.notes || {},
          achievements: new Set(data.achievements || [])
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadCustomTasks = async () => {
      if (authUser) {
        try {
          const tasks = await taskService.getAllCustomTasks();
          setCustomTasks(tasks);
        } catch (error) {
          console.error('Error loading custom tasks:', error);
        }
      }
    };
    loadCustomTasks();
  }, [authUser]);

  useEffect(() => {
    const checkStreak = () => {
      if (authUser) {
        const today = new Date().toISOString().split('T')[0];
        const lastActive = taskData.lastActiveDate || today;
        
        if (lastActive === today) return;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastActive === yesterdayStr) {
          setTaskData(prev => {
            const newStreak = prev.currentStreak + 1;
            handleStreakUpdate(newStreak);
            return {
              ...prev,
              currentStreak: newStreak,
              lastActiveDate: today
            };
          });
        } else {
          setTaskData(prev => ({
            ...prev,
            currentStreak: 0,
            lastActiveDate: today
          }));
        }
      }
    };
    
    checkStreak();
  }, [taskData.lastActiveDate, authUser]);

  useEffect(() => {
    const scheduleDailyReminder = () => {
      if (authUser) {
        const now = new Date();
        const reminderTime = new Date();
        reminderTime.setHours(9, 0, 0, 0); // 9 AM
        
        if (now > reminderTime) {
          reminderTime.setDate(reminderTime.getDate() + 1);
        }
        
        const timeUntilReminder = reminderTime - now;
        
        setTimeout(async () => {
          await notificationService.createDailyReminderNotification(authUser.uid);
          scheduleDailyReminder();
        }, timeUntilReminder);
      }
    };
    
    scheduleDailyReminder();
  }, [authUser]);

  useEffect(() => {
    const updateLeaderboard = async () => {
      if (authUser) {
        try {
          await leaderboardService.updateScore(authUser.uid, {
            name: user.name,
            completedTasks: taskData.completedTasks,
            totalHours: taskData.totalHours,
            currentStreak: taskData.currentStreak,
            achievements: taskData.achievements
          });
        } catch (error) {
          console.error('Error updating leaderboard:', error);
        }
      }
    };

    updateLeaderboard();
  }, [taskData.completedTasks, taskData.totalHours, taskData.currentStreak, taskData.achievements, authUser]);

  const handleLogin = async (user) => {
    setAuthUser(user);
    // Initialize user data
    await authService.createOrUpdateUser(user);
  };

  const handleLogout = async () => {
    await authService.signOut();
    setAuthUser(null);
  };

  // Add notification handlers
  const handleTaskCompletion = async (taskId, task) => {
    try {
      await notificationService.createTaskCompletionNotification(authUser.uid, task);
    } catch (error) {
      console.error('Error creating task completion notification:', error);
    }
  };

  const handleStreakUpdate = async (streak) => {
    try {
      await notificationService.createStreakNotification(authUser.uid, streak);
    } catch (error) {
      console.error('Error creating streak notification:', error);
    }
  };

  const handleAchievementUnlock = async (achievement) => {
    try {
      await notificationService.createAchievementNotification(authUser.uid, achievement);
    } catch (error) {
      console.error('Error creating achievement notification:', error);
    }
  };

  // Task management
  const toggleTask = async (taskId) => {
    setTaskData(prev => {
      const newCompleted = new Set(prev.completedTasks);
      const wasCompleted = newCompleted.has(taskId);
      
      if (wasCompleted) {
        newCompleted.delete(taskId);
      } else {
        newCompleted.add(taskId);
        // Find the task details
        const task = findTaskById(taskId);
        if (task) {
          handleTaskCompletion(taskId, task);
        }
        
        // Check for achievements
        if (newCompleted.size % 10 === 0) {
          const achievement = `Completed ${newCompleted.size} tasks!`;
          prev.achievements.add(achievement);
          handleAchievementUnlock(achievement);
        }
      }
      
      return {
        ...prev,
        completedTasks: newCompleted
      };
    });

    // Save to Firebase
    await updateProgress({
      completedTasks: Array.from(taskData.completedTasks),
      achievements: Array.from(taskData.achievements)
    });
  };

  const updateNotes = async (dayId, notes) => {
    setTaskData(prev => ({
      ...prev,
      notes: { ...prev.notes, [dayId]: notes }
    }));

    // Save to Firebase
    await updateProgress({
      notes: { ...taskData.notes, [dayId]: notes }
    });
  };

  // Statistics calculation
  const getTotalTasks = () => {
    return roadmapPhases.reduce((total, phase) => 
      total + phase.weeks.reduce((weekTotal, week) =>
        weekTotal + week.days.reduce((dayTotal, day) =>
          dayTotal + day.categories.reduce((catTotal, category) =>
            catTotal + category.tasks.length, 0), 0), 0), 0);
  };

  const getCompletionPercentage = () => {
    const total = getTotalTasks();
    return total > 0 ? Math.round((taskData.completedTasks.size / total) * 100) : 0;
  };

  // Export functionality
  const exportProgress = () => {
    const data = {
      ...taskData,
      completedTasks: Array.from(taskData.completedTasks),
      achievements: Array.from(taskData.achievements),
      exportDate: new Date().toISOString(),
      completionPercentage: getCompletionPercentage()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quant-journey-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle custom task creation
  const handleCreateCustomTask = async (task) => {
    try {
      const newTask = await taskService.createTask(task);
      setCustomTasks(prev => [...prev, newTask]);
    } catch (error) {
      console.error('Error creating custom task:', error);
    }
  };

  // Handle custom task deletion
  const handleDeleteCustomTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setCustomTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting custom task:', error);
    }
  };

  // Helper function to find task by ID
  const findTaskById = (taskId) => {
    const [phaseId, weekId, dayId, catId, taskIdx] = taskId.split('-').map(Number);
    const phase = roadmapPhases[phaseId];
    if (!phase) return null;

    const week = phase.weeks[weekId];
    if (!week) return null;

    const day = week.days[dayId];
    if (!day) return null;

    const category = day.categories[catId];
    if (!category) return null;

    return category.tasks[taskIdx];
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!authUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Navigation tabs
  const renderTabs = () => (
    <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
      <button
        onClick={() => setActiveTab('tasks')}
        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
          activeTab === 'tasks'
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        Tasks
      </button>
      <button
        onClick={() => setActiveTab('bookmarks')}
        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
          activeTab === 'bookmarks'
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        Bookmarks
      </button>
      <button
        onClick={() => setActiveTab('leaderboard')}
        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
          activeTab === 'leaderboard'
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        Leaderboard
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
        user={authUser}
        completionPercentage={getCompletionPercentage()}
        completedTasks={taskData.completedTasks.size}
        totalHours={taskData.totalHours}
        dailyStreak={taskData.currentStreak}
        achievements={taskData.achievements}
        onHelpClick={() => setShowHelp(true)}
      >
        <NotificationCenter userId={userId} />
      </Header>

      <Timer 
        currentTime={timer.currentTime}
        isRunning={timer.isRunning}
        onPause={pauseTimer}
        onStop={stopTimer}
        formatTime={formatTime}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderTabs()}

        {activeTab === 'tasks' && (
          <>
            {/* Company Targets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">🎯 LFT Targets (Month 3-5)</h3>
                <div className="space-y-3">
                  {companyTargets.lft.map((company, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg gap-2">
                      <div>
                        <div className="font-semibold dark:text-white">{company.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{company.focus}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded self-start sm:self-auto ${
                        company.difficulty === 'Easy' ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' :
                        company.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' : 
                        'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                      }`}>
                        {company.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400">🏆 HFT Goals (Month 8+)</h3>
                <div className="space-y-3">
                  {companyTargets.hft.map((company, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg gap-2">
                      <div>
                        <div className="font-semibold dark:text-white">{company.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{company.focus}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded self-start sm:self-auto ${
                        company.difficulty === 'Hard' ? 'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200' :
                        'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                      }`}>
                        {company.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Phase Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
              {roadmapPhases.map((phase, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhase(idx)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activePhase === idx
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Phase {idx + 1}
                </button>
              ))}
            </div>

            {/* Active Phase Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className={`bg-gradient-to-r ${roadmapPhases[activePhase].color} text-white p-4 sm:p-6`}>
                <h2 className="text-xl sm:text-2xl font-bold">{roadmapPhases[activePhase].title}</h2>
                <p className="opacity-90 mt-2 text-sm sm:text-base">{roadmapPhases[activePhase].description}</p>
              </div>

              <div className="p-4 sm:p-6">
                {roadmapPhases[activePhase].weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="mb-8">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">{week.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{week.focus}</p>
                    </div>

                    {week.days.map((day, dayIdx) => (
                      <div key={dayIdx} className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 border-b dark:border-gray-600">
                          <h4 className="font-semibold text-gray-800 dark:text-white">{day.day}</h4>
                        </div>
                        
                        <div className="p-4">
                          <div className="grid gap-4">
                            {day.categories.map((category, catIdx) => (
                              <div key={catIdx} className={`border-l-4 ${category.color} pl-4`}>
                                <div className="flex items-center gap-2 mb-3">
                                  {category.icon}
                                  <h5 className="font-semibold dark:text-white">{category.name}</h5>
                                </div>
                                
                                <div className="space-y-2">
                                  {category.tasks.map((task, taskIdx) => {
                                    const taskId = `${activePhase}-${weekIdx}-${dayIdx}-${catIdx}-${taskIdx}`;
                                    return (
                                      <TaskCard
                                        key={taskIdx}
                                        task={task}
                                        taskId={taskId}
                                        category={category}
                                        isCompleted={taskData.completedTasks.has(taskId)}
                                        isCurrentTask={timer.currentTask === taskId}
                                        isFavorite={favoriteTasks.has(taskId)}
                                        onToggleTask={() => toggleTask(taskId)}
                                        onStartTimer={() => startTimer(taskId)}
                                        onToggleFavorite={(id) => {
                                          const newFavorites = new Set(favoriteTasks);
                                          if (newFavorites.has(id)) {
                                            newFavorites.delete(id);
                                          } else {
                                            newFavorites.add(id);
                                          }
                                          setFavoriteTasks(newFavorites);
                                        }}
                                      />
                                    );
                                  })}

                                  {/* Render custom tasks for this category */}
                                  {customTasks
                                    .filter(task => 
                                      task.phaseId === activePhase &&
                                      task.weekId === weekIdx &&
                                      task.dayId === dayIdx &&
                                      task.category === category.name
                                    )
                                    .map(task => (
                                      <TaskCard
                                        key={task.id}
                                        task={task}
                                        taskId={task.id}
                                        category={category}
                                        isCompleted={taskData.completedTasks.has(task.id)}
                                        isCurrentTask={timer.currentTask === task.id}
                                        isFavorite={favoriteTasks.has(task.id)}
                                        onToggleTask={() => toggleTask(task.id)}
                                        onStartTimer={() => startTimer(task.id)}
                                        onToggleFavorite={(id) => {
                                          const newFavorites = new Set(favoriteTasks);
                                          if (newFavorites.has(id)) {
                                            newFavorites.delete(id);
                                          } else {
                                            newFavorites.add(id);
                                          }
                                          setFavoriteTasks(newFavorites);
                                        }}
                                        onDelete={() => handleDeleteCustomTask(task.id)}
                                        isCustom
                                      />
                                    ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Daily Notes */}
                          <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Daily Notes & Reflections
                            </label>
                            <textarea
                              value={taskData.notes[`${activePhase}-${weekIdx}-${dayIdx}`] || ''}
                              onChange={(e) => updateNotes(`${activePhase}-${weekIdx}-${dayIdx}`, e.target.value)}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              rows="3"
                              placeholder="Key learnings, challenges faced, breakthrough moments..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'bookmarks' && (
          <BookmarkList userId={userId} />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard userId={userId} />
        )}
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {/* Export Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex gap-3">
        <button
          onClick={exportProgress}
          className="bg-green-500 hover:bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          <span className="hidden sm:inline">Export Progress</span>
        </button>
      </div>

      {/* Custom Task Modal */}
      {showCustomTaskModal && (
        <CustomTaskModal
          isOpen={showCustomTaskModal}
          onClose={() => setShowCustomTaskModal(false)}
          onSave={handleCreateCustomTask}
          phaseId={selectedTaskLocation?.phaseId}
          weekId={selectedTaskLocation?.weekId}
          dayId={selectedTaskLocation?.dayId}
        />
      )}
    </div>
  );
};

// Wrap the app with ThemeProvider
const App = () => (
  <ThemeProvider>
    <QuantTracker />
  </ThemeProvider>
);

export default App;