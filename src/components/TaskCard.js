import React from 'react';
import { Clock, Star, Trash2, ExternalLink } from 'lucide-react';

const TaskCard = ({
  task,
  taskId,
  category,
  isCompleted,
  isCurrentTask,
  isFavorite,
  onToggleTask,
  onStartTimer,
  onToggleFavorite,
  onDelete,
  isCustom
}) => {
  return (
    <div className={`p-4 rounded-lg border ${
      isCompleted
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        : isCurrentTask
        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    } transition-all`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={onToggleTask}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <h3 className={`font-medium ${
              isCompleted
                ? 'text-green-700 dark:text-green-300 line-through'
                : 'text-gray-900 dark:text-white'
            }`}>
              {task.title}
            </h3>
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {task.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{task.estimatedTime} min</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${
              task.difficulty === 'Easy'
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : task.difficulty === 'Medium'
                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}>
              {task.difficulty}
            </span>
          </div>

          {task.resources?.length > 0 && (
            <div className="mt-3 space-y-2">
              {task.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="truncate">Resource {index + 1}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => onToggleFavorite(taskId)}
            className={`p-2 rounded-full transition-colors ${
              isFavorite
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
            }`}
          >
            <Star className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          {isCustom && (
            <button
              onClick={() => onDelete(taskId)}
              className="p-2 text-red-500 hover:text-red-600 rounded-full transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          {!isCompleted && (
            <button
              onClick={() => onStartTimer(taskId)}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                isCurrentTask
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              } transition-colors`}
            >
              {isCurrentTask ? 'Stop' : 'Start'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 