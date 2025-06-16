import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { isToday } from 'date-fns';
import { useHotkeys } from 'react-hotkeys-hook';
import Header from '@/components/organisms/Header';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import TaskList from '@/components/organisms/TaskList';
import QuickAddBar from '@/components/molecules/QuickAddBar';
import ActiveTimersWidget from '@/components/molecules/ActiveTimersWidget';
import { taskService, categoryService } from '@/services';
import { useKeyboardNavigation } from '@/components/providers/KeyboardNavigationProvider';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('today');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { focusElement } = useKeyboardNavigation();
  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    loadTasks();
  }, [currentView]);
  
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  
  const loadTasks = async () => {
    try {
      const tasksData = await taskService.getByView(currentView);
      setTasks(tasksData);
    } catch (err) {
      toast.error('Failed to load tasks');
    }
  };
  
  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    updateCategoryTaskCount(newTask.categoryId, 1);
  };
  
  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };
  
  const handleTaskDeleted = (taskId) => {
    const deletedTask = tasks.find(task => task.id === taskId);
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (deletedTask) {
      updateCategoryTaskCount(deletedTask.categoryId, -1);
    }
  };
  
  const updateCategoryTaskCount = (categoryId, change) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, taskCount: Math.max(0, cat.taskCount + change) }
        : cat
    ));
  };
  
  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view !== 'today') {
      setSelectedCategory(null);
    }
};

  // Global keyboard shortcuts
  useHotkeys('/', (e) => {
    e.preventDefault();
    focusElement('search-bar');
  });

  useHotkeys('escape', () => {
    document.activeElement?.blur();
  });
  
  const todayTasks = tasks.filter(task => 
    isToday(new Date(task.createdAt)) || 
    (task.dueDate && isToday(new Date(task.dueDate)))
  );
  const completedToday = todayTasks.filter(task => task.completed).length;
  if (loading) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-white/20 rounded mb-2"></div>
            <div className="h-4 w-32 bg-white/20 rounded"></div>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 bg-surface p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-error text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header 
        completedToday={completedToday}
        totalToday={todayTasks.length}
/>
      
      <ActiveTimersWidget
        tasks={tasks}
        onTaskUpdated={handleTaskUpdated}
      />
      
      <QuickAddBar
        categories={categories}
        onTaskAdded={handleTaskAdded}
        defaultCategory={selectedCategory}
      />
      <div className="flex-1 flex overflow-hidden">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          className="w-80 flex-shrink-0 border-r border-gray-200"
        />
        
        <TaskList
          tasks={tasks}
          categories={categories}
          currentView={currentView}
          onViewChange={handleViewChange}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
          selectedCategory={selectedCategory}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default Dashboard;