import { useState, useEffect } from 'react';

export const useTimer = (onTimeUpdate) => {
  const [timer, setTimer] = useState({
    isRunning: false,
    currentTime: 0,
    currentTask: null
  });

  useEffect(() => {
    let interval = null;
    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTime = prev.currentTime + 1;
          if (onTimeUpdate) {
            onTimeUpdate(newTime);
          }
          return {
            ...prev,
            currentTime: newTime
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, onTimeUpdate]);

  const startTimer = (taskId) => {
    setTimer({
      isRunning: true,
      currentTime: 0,
      currentTask: taskId
    });
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const stopTimer = () => {
    setTimer({ isRunning: false, currentTime: 0, currentTask: null });
  };

  return {
    timer,
    startTimer,
    pauseTimer,
    stopTimer
  };
}; 