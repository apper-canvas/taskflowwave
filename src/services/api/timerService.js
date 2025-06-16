import taskService from './taskService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'taskflow_timers';

const timerService = {
  async getActiveTimers() {
    await delay(200);
    
    // Get all tasks and filter for active timers
    const tasks = await taskService.getAll();
    const activeTimers = tasks.filter(task => task.isTimerActive);
    
    return activeTimers.map(task => ({
      id: task.id,
      title: task.title,
      startTime: task.timerStartTime,
      totalTime: task.timerTotalTime || 0,
      isActive: task.isTimerActive
    }));
  },

  async startTimer(taskId) {
    await delay(200);
    
    const now = new Date().toISOString();
    const updateData = {
      isTimerActive: true,
      timerStartTime: now,
      timerLastStartTime: now
    };
    
    const updatedTask = await taskService.update(taskId, updateData);
    this._saveTimerState(taskId, { startTime: now, isActive: true });
    
    return updatedTask;
  },

  async pauseTimer(taskId) {
    await delay(200);
    
    const task = await taskService.getById(taskId);
    if (!task || !task.isTimerActive) {
      throw new Error('Timer not active');
    }
    
    // Calculate elapsed time since last start
    const startTime = new Date(task.timerLastStartTime);
    const elapsed = Math.floor((new Date() - startTime) / 1000);
    const newTotalTime = (task.timerTotalTime || 0) + elapsed;
    
    const updateData = {
      isTimerActive: false,
      timerTotalTime: newTotalTime,
      timerStartTime: null,
      timerLastStartTime: null
    };
    
    const updatedTask = await taskService.update(taskId, updateData);
    this._removeTimerState(taskId);
    
    return updatedTask;
  },

  async stopTimer(taskId) {
    await delay(200);
    
    const task = await taskService.getById(taskId);
    if (!task || !task.isTimerActive) {
      throw new Error('Timer not active');
    }
    
    // Calculate final elapsed time
    const startTime = new Date(task.timerLastStartTime);
    const elapsed = Math.floor((new Date() - startTime) / 1000);
    const finalTotalTime = (task.timerTotalTime || 0) + elapsed;
    
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
  },

  async resumeTimer(taskId) {
    await delay(200);
    
    const task = await taskService.getById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    
    const now = new Date().toISOString();
    const updateData = {
      isTimerActive: true,
      timerStartTime: task.timerStartTime || now,
      timerLastStartTime: now
    };
    
    const updatedTask = await taskService.update(taskId, updateData);
    this._saveTimerState(taskId, { startTime: now, isActive: true });
    
    return updatedTask;
  },

  getTimerDisplay(task) {
    if (!task.timerTotalTime && !task.isTimerActive) {
      return null;
    }
    
    let totalSeconds = task.timerTotalTime || 0;
    
    if (task.isTimerActive && task.timerLastStartTime) {
      const elapsed = Math.floor((new Date() - new Date(task.timerLastStartTime)) / 1000);
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