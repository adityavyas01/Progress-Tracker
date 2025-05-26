import React from 'react';
import { Users, Calendar, Clock, MessageSquare, Video, Mic, MicOff, VideoOff } from 'lucide-react';

const StudyGroup = ({
  group,
  members,
  onJoinCall,
  onLeaveCall,
  onSendMessage,
  messages,
  isInCall,
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6" />
              {group.name}
            </h2>
            <p className="text-gray-600 mt-1">{group.description}</p>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{group.schedule}</span>
          </div>
        </div>
      </div>

      {/* Video Call Section */}
      <div className="p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Study Session</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className={`p-2 rounded-full ${
                isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={onToggleVideo}
              className={`p-2 rounded-full ${
                isVideoOff ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
            <button
              onClick={isInCall ? onLeaveCall : onJoinCall}
              className={`px-4 py-2 rounded-lg ${
                isInCall 
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isInCall ? 'Leave Call' : 'Join Call'}
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {members.map(member => (
            <div key={member.id} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              {member.isInCall ? (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mx-auto mb-2">
                    {member.name.charAt(0)}
                  </div>
                  <div className="text-sm font-medium">{member.name}</div>
                </div>
              ) : (
                <div className="text-gray-400">Offline</div>
              )}
            </div>
          ))}
        </div>

        {/* Chat Section */}
        <div className="border rounded-lg overflow-hidden">
          <div className="h-64 overflow-y-auto p-4 space-y-4">
            {messages.map((message, idx) => (
              <div key={idx} className={`flex ${message.isSelf ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg p-3 ${
                  message.isSelf 
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="text-sm font-medium mb-1">{message.sender}</div>
                  <div>{message.text}</div>
                  <div className="text-xs opacity-70 mt-1">{message.time}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t p-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.elements.message;
              onSendMessage(input.value);
              input.value = '';
            }} className="flex gap-2">
              <input
                type="text"
                name="message"
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Group Progress */}
      <div className="p-6">
        <h3 className="font-semibold mb-4">Group Progress</h3>
        <div className="space-y-4">
          {members.map(member => (
            <div key={member.id} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                {member.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-sm text-gray-600">{member.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                    style={{ width: `${member.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyGroup; 