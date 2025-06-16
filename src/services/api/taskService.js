import tasksData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...tasksData];

const taskService = {
  async getAll() {
    await delay(200);
    return [...tasks];
  },

  async getById(id) {
    await delay(150);
    const task = tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay(300);
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || "",
      categoryId: taskData.categoryId,
      priority: taskData.priority || "medium",
      dueDate: taskData.dueDate || null,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updateData) {
    await delay(250);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    const updatedTask = {
      ...tasks[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    if (updateData.completed !== undefined) {
      updatedTask.completedAt = updateData.completed ? new Date().toISOString() : null;
    }
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks.splice(index, 1);
    return true;
  },

  async getByView(view) {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    let filteredTasks = [...tasks];
    
    switch (view) {
      case 'today':
        filteredTasks = tasks.filter(task => 
          task.dueDate === today || (!task.dueDate && !task.completed)
        );
        break;
      case 'upcoming':
        filteredTasks = tasks.filter(task => 
          task.dueDate && task.dueDate >= tomorrowStr && !task.completed
        );
        break;
      case 'all':
      default:
        // Return all tasks
        break;
    }
    
    return filteredTasks;
  }
};

export default taskService;