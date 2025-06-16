import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { timerService } from '@/services';

const ActiveTimersWidget = ({ tasks, onTaskUpdated }) => {
  const [activeTimers, setActiveTimers] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadActiveTimers();
    
    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Refresh active timers every 5 seconds
    const timersInterval = setInterval(loadActiveTimers, 5000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(timersInterval);
    };
  }, []);

  useEffect(() => {
    loadActiveTimers();
  }, [tasks]);

  const loadActiveTimers = async () => {
    try {
      const timers = await timerService.getActiveTimers();
      setActiveTimers(timers);
    } catch (err) {
      console.error('Failed to load active timers:', err);
    }
  };

  const handlePauseTimer = async (taskId) => {
    try {
      const updatedTask = await timerService.pauseTimer(taskId);
      onTaskUpdated(updatedTask);
      loadActiveTimers();
      toast.info('Timer paused');
    } catch (err) {
      toast.error('Failed to pause timer');
    }
  };

  const handleStopTimer = async (taskId) => {
    try {
      const updatedTask = await timerService.stopTimer(taskId);
      onTaskUpdated(updatedTask);
      loadActiveTimers();
      toast.success('Timer stopped');
    } catch (err) {
      toast.error('Failed to stop timer');
    }
  };

  const formatElapsedTime = (startTime, totalTime) => {
    const start = new Date(startTime);
    const elapsed = Math.floor((currentTime - start) / 1000) + (totalTime || 0);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (activeTimers.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg mx-6 mb-4 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="font-semibold text-gray-900">
            Active Timers ({activeTimers.length})
          </h3>
        </div>
        <div className="text-sm text-gray-600 font-mono">
          {format(currentTime, 'HH:mm:ss')}
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {activeTimers.map((timer) => (
            <motion.div
              key={timer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {timer.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-lg font-mono text-blue-600">
                      {formatElapsedTime(timer.startTime, timer.totalTime)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Started {format(new Date(timer.startTime), 'HH:mm')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePauseTimer(timer.id)}
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <ApperIcon name="Pause" size={14} />
                    Pause
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStopTimer(timer.id)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <ApperIcon name="Square" size={14} />
                    Stop
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ActiveTimersWidget;