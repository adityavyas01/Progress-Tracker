import React, { useState } from 'react';
import { Download } from 'lucide-react';
import Header from './components/Header';
import Timer from './components/Timer';
import TaskCard from './components/TaskCard';
import HelpModal from './components/HelpModal';
import UserProfile from './components/UserProfile';
import StudyGroup from './components/StudyGroup';
import Analytics from './components/Analytics';
import Resources from './components/Resources';
import { roadmapPhases, companyTargets } from './data/roadmap';
import { formatTime } from './utils/timer';
import { useTimer } from './hooks/useTimer';

const QuantTracker = () => {
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
  
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [favoriteTasks, setFavoriteTasks] = useState(new Set());
  const [showHelp, setShowHelp] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap', 'profile', 'study', 'analytics', 'resources'
  const [user, setUser] = useState({
    name: 'Your Name',
    bio: 'Full Stack Developer transitioning to Quant Trading',
    targetCompany: 'Graviton Research Capital',
    startDate: new Date().toISOString()
  });
  const [friends, setFriends] = useState([
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

  // Timer functionality
  const { timer, startTimer, pauseTimer, stopTimer } = useTimer((newTime) => {
    // Optional callback for time updates
  });

  // Task management
  const toggleTask = (taskId) => {
    setTaskData(prev => {
      const newCompleted = new Set(prev.completedTasks);
      if (newCompleted.has(taskId)) {
        newCompleted.delete(taskId);
      } else {
        newCompleted.add(taskId);
        // Check for achievements
        if (newCompleted.size % 10 === 0) {
          prev.achievements.add(`Completed ${newCompleted.size} tasks!`);
        }
      }
      return {
        ...prev,
        completedTasks: newCompleted
      };
    });
  };

  const updateNotes = (dayId, notes) => {
    setTaskData(prev => ({
      ...prev,
      notes: { ...prev.notes, [dayId]: notes }
    }));
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

  // Enhanced statistics
  const getStatistics = () => {
    const totalTasks = getTotalTasks();
    const completedTasks = taskData.completedTasks.size;
    const completionPercentage = getCompletionPercentage();
    const averageTaskTime = taskData.totalHours / completedTasks || 0;
    const tasksByDifficulty = {
      easy: 0,
      medium: 0,
      hard: 0
    };

    // Calculate tasks by difficulty
    roadmapPhases.forEach(phase => {
      phase.weeks.forEach(week => {
        week.days.forEach(day => {
          day.categories.forEach(category => {
            category.tasks.forEach(task => {
              tasksByDifficulty[task.difficulty]++;
            });
          });
        });
      });
    });

    return {
      totalTasks,
      completedTasks,
      completionPercentage,
      averageTaskTime,
      tasksByDifficulty
    };
  };

  // Study group functions
  const handleJoinCall = () => {
    setCallState(prev => ({ ...prev, isInCall: true }));
    setStudyGroup(prev => ({
      ...prev,
      members: prev.members.map(member => 
        member.id === 1 ? { ...member, isInCall: true } : member
      )
    }));
  };

  const handleLeaveCall = () => {
    setCallState(prev => ({ ...prev, isInCall: false }));
    setStudyGroup(prev => ({
      ...prev,
      members: prev.members.map(member => 
        member.id === 1 ? { ...member, isInCall: false } : member
      )
    }));
  };

  const handleSendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      sender: 'You',
      text,
      time: new Date().toLocaleTimeString(),
      isSelf: true
    };
    setMessages(prev => [...prev, newMessage]);
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

  // Navigation tabs
  const renderTabs = () => (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      <button
        onClick={() => setActiveTab('roadmap')}
        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
          activeTab === 'roadmap'
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        Roadmap
      </button>
      <button
        onClick={() => setActiveTab('profile')}
        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
          activeTab === 'profile'
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        Profile
      </button>
      <button
        onClick={() => setActiveTab('study')}
        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
          activeTab === 'study'
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        Study Group
      </button>
      <button
        onClick={() => setActiveTab('analytics')}
        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
          activeTab === 'analytics'
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        Analytics
      </button>
      <button
        onClick={() => setActiveTab('resources')}
        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
          activeTab === 'resources'
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        Resources
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header 
        completionPercentage={getCompletionPercentage()}
        completedTasks={taskData.completedTasks.size}
        totalHours={taskData.totalHours}
        dailyStreak={dailyStreak}
        achievements={taskData.achievements}
        onHelpClick={() => setShowHelp(true)}
        onSettingsClick={() => setShowSettings(true)}
      />

      <Timer 
        currentTime={timer.currentTime}
        isRunning={timer.isRunning}
        onPause={pauseTimer}
        onStop={stopTimer}
        formatTime={formatTime}
      />

      <div className="max-w-7xl mx-auto p-6">
        {renderTabs()}

        {activeTab === 'roadmap' && (
          <>
            {/* Company Targets */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-green-600">🎯 LFT Targets (Month 3-5)</h3>
                <div className="space-y-3">
                  {companyTargets.lft.map((company, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-semibold">{company.name}</div>
                        <div className="text-sm text-gray-600">{company.focus}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        company.difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                        company.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 
                        'bg-red-200 text-red-800'
                      }`}>
                        {company.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-purple-600">🏆 HFT Goals (Month 8+)</h3>
                <div className="space-y-3">
                  {companyTargets.hft.map((company, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <div className="font-semibold">{company.name}</div>
                        <div className="text-sm text-gray-600">{company.focus}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        company.difficulty === 'Hard' ? 'bg-orange-200 text-orange-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {company.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Phase Navigation */}
            <div className="flex flex-wrap gap-2 mb-8">
              {roadmapPhases.map((phase, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhase(idx)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activePhase === idx
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Phase {idx + 1}
                </button>
              ))}
            </div>

            {/* Active Phase Content */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className={`bg-gradient-to-r ${roadmapPhases[activePhase].color} text-white p-6`}>
                <h2 className="text-2xl font-bold">{roadmapPhases[activePhase].title}</h2>
                <p className="opacity-90 mt-2">{roadmapPhases[activePhase].description}</p>
              </div>

              <div className="p-6">
                {roadmapPhases[activePhase].weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-bold text-gray-800">{week.title}</h3>
                      <p className="text-gray-600">{week.focus}</p>
                    </div>

                    {week.days.map((day, dayIdx) => (
                      <div key={dayIdx} className="border border-gray-200 rounded-lg mb-4">
                        <div className="bg-gray-100 p-4 border-b">
                          <h4 className="font-semibold text-gray-800">{day.day}</h4>
                        </div>
                        
                        <div className="p-4">
                          <div className="grid gap-4">
                            {day.categories.map((category, catIdx) => (
                              <div key={catIdx} className={`border-l-4 ${category.color} pl-4`}>
                                <div className="flex items-center gap-2 mb-3">
                                  {category.icon}
                                  <h5 className="font-semibold">{category.name}</h5>
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
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Daily Notes */}
                          <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Daily Notes & Reflections
                            </label>
                            <textarea
                              value={taskData.notes[`${activePhase}-${weekIdx}-${dayIdx}`] || ''}
                              onChange={(e) => updateNotes(`${activePhase}-${weekIdx}-${dayIdx}`, e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
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

        {activeTab === 'profile' && (
          <UserProfile
            user={user}
            friends={friends}
            onAddFriend={() => {/* Add friend logic */}}
            onUpdateProfile={() => {/* Update profile logic */}}
            achievements={Array.from(taskData.achievements)}
            stats={{
              completedTasks: taskData.completedTasks.size,
              totalHours: taskData.totalHours,
              streak: dailyStreak
            }}
          />
        )}

        {activeTab === 'study' && (
          <StudyGroup
            group={studyGroup}
            members={studyGroup.members}
            onJoinCall={handleJoinCall}
            onLeaveCall={handleLeaveCall}
            onSendMessage={handleSendMessage}
            messages={messages}
            isInCall={callState.isInCall}
            isMuted={callState.isMuted}
            isVideoOff={callState.isVideoOff}
            onToggleMute={() => setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }))}
            onToggleVideo={() => setCallState(prev => ({ ...prev, isVideoOff: !prev.isVideoOff }))}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics
            stats={getStatistics()}
            dailyProgress={[
              { date: 'Mon', progress: 60 },
              { date: 'Tue', progress: 80 },
              { date: 'Wed', progress: 40 },
              { date: 'Thu', progress: 90 },
              { date: 'Fri', progress: 70 },
              { date: 'Sat', progress: 50 },
              { date: 'Sun', progress: 30 }
            ]}
            weeklyProgress={[]}
            categoryProgress={[
              { name: 'DSA', progress: 75 },
              { name: 'Mathematics', progress: 60 },
              { name: 'Trading', progress: 45 },
              { name: 'Projects', progress: 30 }
            ]}
            timeDistribution={[
              { category: 'DSA Practice', hours: 20 },
              { category: 'Math Study', hours: 15 },
              { category: 'Trading Concepts', hours: 10 },
              { category: 'Project Work', hours: 5 }
            ]}
            achievements={Array.from(taskData.achievements).map(achievement => ({
              title: achievement,
              description: 'Great job! Keep going!',
              date: new Date().toLocaleDateString()
            }))}
          />
        )}

        {activeTab === 'resources' && <Resources />}

        {/* Achievements */}
        {taskData.achievements.size > 0 && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-yellow-600">🏆 Achievements</h3>
            <div className="grid gap-2">
              {Array.from(taskData.achievements).map((achievement, idx) => (
                <div key={idx} className="bg-yellow-50 text-yellow-800 p-3 rounded-lg">
                  {achievement}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {/* Export Button */}
      <div className="fixed bottom-6 right-6 flex gap-3">
        <button
          onClick={exportProgress}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          <span className="hidden md:inline">Export Progress</span>
        </button>
      </div>
    </div>
  );
};

export default QuantTracker;