import taskService from './taskService';

const STORAGE_KEY = 'taskflow_timers';

const timerService = {
  async getActiveTimers() {
    try {
      // Get all tasks and filter for active timers
      const tasks = await taskService.getAll();
      const activeTimers = tasks.filter(task => task.is_timer_active);
      
      return activeTimers.map(task => ({
        id: task.Id,
        title: task.title,
        startTime: task.timer_start_time,
        totalTime: task.timer_total_time || 0,
        isActive: task.is_timer_active
      }));
    } catch (error) {
      console.error("Error fetching active timers:", error);
      return [];
    }
  },

  async startTimer(taskId) {
    try {
      const now = new Date().toISOString();
      const updateData = {
        isTimerActive: true,
        timerStartTime: now,
        timerLastStartTime: now
      };
      
      const updatedTask = await taskService.update(taskId, updateData);
      this._saveTimerState(taskId, { startTime: now, isActive: true });
      
      return updatedTask;
    } catch (error) {
      console.error("Error starting timer:", error);
      throw error;
    }
  },

  async pauseTimer(taskId) {
    try {
      const task = await taskService.getById(taskId);
      if (!task || !task.is_timer_active) {
        throw new Error('Timer not active');
      }
      
      // Calculate elapsed time since last start
      const startTime = new Date(task.timer_last_start_time);
      const elapsed = Math.floor((new Date() - startTime) / 1000);
      const newTotalTime = (task.timer_total_time || 0) + elapsed;
      
      const updateData = {
        isTimerActive: false,
        timerTotalTime: newTotalTime,
        timerStartTime: null,
        timerLastStartTime: null
      };
      
      const updatedTask = await taskService.update(taskId, updateData);
      this._removeTimerState(taskId);
      
      return updatedTask;
    } catch (error) {
      console.error("Error pausing timer:", error);
      throw error;
    }
  },

  async stopTimer(taskId) {
    try {
      const task = await taskService.getById(taskId);
      if (!task || !task.is_timer_active) {
        throw new Error('Timer not active');
      }
      
      // Calculate final elapsed time
      const startTime = new Date(task.timer_last_start_time);
      const elapsed = Math.floor((new Date() - startTime) / 1000);
      const finalTotalTime = (task.timer_total_time || 0) + elapsed;
      
      const updateData = {
        isTimerActive: false,
        timerTotalTime: finalTotalTime,
        timerStartTime: null,
        timerLastStartTime: null,
        timerCompletedAt: new Date().toISOString()
      };
      
      const updatedTask = await taskService.update(taskId, updateData);
      this._removeTimerState(taskId);
      
      return updatedTask;
    } catch (error) {
      console.error("Error stopping timer:", error);
      throw error;
    }
  },

  async resumeTimer(taskId) {
    try {
      const task = await taskService.getById(taskId);
      if (!task) {
        throw new Error('Task not found');
      }
      
      const now = new Date().toISOString();
      const updateData = {
        isTimerActive: true,
        timerStartTime: task.timer_start_time || now,
        timerLastStartTime: now
      };
      
      const updatedTask = await taskService.update(taskId, updateData);
      this._saveTimerState(taskId, { startTime: now, isActive: true });
      
      return updatedTask;
    } catch (error) {
      console.error("Error resuming timer:", error);
      throw error;
    }
  },

  getTimerDisplay(task) {
    if (!task.timer_total_time && !task.is_timer_active) {
      return null;
    }
    
    let totalSeconds = task.timer_total_time || 0;
    
    if (task.is_timer_active && task.timer_last_start_time) {
      const elapsed = Math.floor((new Date() - new Date(task.timer_last_start_time)) / 1000);
      totalSeconds += elapsed;
    }
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },

  _saveTimerState(taskId, state) {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      stored[taskId] = { ...state, timestamp: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (err) {
      console.warn('Failed to save timer state:', err);
    }
  },

  _removeTimerState(taskId) {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      delete stored[taskId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (err) {
      console.warn('Failed to remove timer state:', err);
    }
  }
};

export default timerService;