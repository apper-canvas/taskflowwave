import taskService from './api/taskService';
import categoryService from './api/categoryService';
import settingsService from './api/settingsService';
import timerService from './api/timerService';

export {
  taskService,
  categoryService,
  settingsService,
  timerService
};
export { default as categoryService } from './api/categoryService.js';
export { default as settingsService } from './api/settingsService.js';