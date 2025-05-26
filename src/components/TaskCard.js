import React from 'react';
import { CheckCircle, Circle, Play, Bookmark } from 'lucide-react';

const TaskCard = ({ 
  task, 
  taskId, 
  category, 
  isCompleted, 
  isCurrentTask, 
  isFavorite, 
  onToggleTask, 
  onStartTimer, 
  onToggleFavorite 
}) => {
  return (
    <div 
      className={`group relative flex items-center gap-3 p-4 rounded-lg transition-all ${
        isCompleted ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
      } ${isCurrentTask ? 'ring-2 ring-orange-400' : ''}`}
    >
      <button
        onClick={onToggleTask}
        className="flex-shrink-0"
      >
        {isCompleted ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
        )}
      </button>
      
      <div className="flex-1">
        <div className={`flex items-center gap-2 ${isCompleted ? 'line-through text-gray-500' : ''}`}>
          {task.text}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(taskId);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {task.time} min
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            task.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            task.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {task.difficulty}
          </span>
          {category.icon}
        </div>
      </div>
      
      {!isCompleted && !isCurrentTask && (
        <button
          onClick={() => onStartTimer(taskId)}
          className="flex-shrink-0 bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Play className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default TaskCard; 