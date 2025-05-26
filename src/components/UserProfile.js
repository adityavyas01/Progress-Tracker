import React from 'react';
import { User, Users, Trophy, Target, Calendar } from 'lucide-react';

const UserProfile = ({ 
  user,
  friends,
  onAddFriend,
  onUpdateProfile,
  achievements,
  stats
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
          {user.name.charAt(0)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <button 
              onClick={() => onUpdateProfile()}
              className="text-blue-500 hover:text-blue-600"
            >
              Edit Profile
            </button>
          </div>
          
          <p className="text-gray-600 mt-1">{user.bio || "No bio yet"}</p>
          
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Target className="w-4 h-4" />
              <span>Target: {user.targetCompany}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Started: {new Date(user.startDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Tasks Completed</div>
          <div className="text-2xl font-bold">{stats.completedTasks}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Hours Invested</div>
          <div className="text-2xl font-bold">{Math.round(stats.totalHours)}h</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Current Streak</div>
          <div className="text-2xl font-bold">{stats.streak} days</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Achievements</div>
          <div className="text-2xl font-bold">{achievements.length}</div>
        </div>
      </div>

      {/* Friends Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Study Buddies
          </h3>
          <button 
            onClick={onAddFriend}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            Add Friend
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {friends.map(friend => (
            <div key={friend.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {friend.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{friend.name}</div>
                  <div className="text-sm text-gray-600">{friend.progress}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5" />
          Recent Achievements
        </h3>
        <div className="space-y-2">
          {achievements.slice(0, 3).map((achievement, idx) => (
            <div key={idx} className="bg-yellow-50 text-yellow-800 p-3 rounded-lg">
              {achievement}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 