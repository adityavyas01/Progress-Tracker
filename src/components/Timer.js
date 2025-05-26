import React from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

const Timer = ({ currentTime, isRunning, onPause, onStop, formatTime }) => {
  if (!currentTime) return null;

  return (
    <div className="bg-orange-500 text-white p-4 text-center sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
        <Clock className="w-5 h-5" />
        <span className="text-xl font-mono">{formatTime(currentTime)}</span>
        <button 
          onClick={onPause} 
          className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-colors"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button 
          onClick={onStop} 
          className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Timer; 