import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import TaskItem from '@/components/molecules/TaskItem';
import SearchBar from '@/components/molecules/SearchBar';
import ViewToggle from '@/components/molecules/ViewToggle';
import ApperIcon from '@/components/ApperIcon';
import { useKeyboardNavigation } from '@/components/providers/KeyboardNavigationProvider';

const TaskList = ({ 
  tasks, 
  categories, 
  currentView, 
  onViewChange, 
  onTaskUpdated, 
  onTaskDeleted,
  selectedCategory,
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const { keyboardEnabled, focusElement, getNextFocusableElement, focusedElement } = useKeyboardNavigation();
  
  useEffect(() => {
    let filtered = [...tasks];
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(task => task.categoryId === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }
    
    // Sort by priority and due date
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      
      // Completed tasks go to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Sort by priority
      const priorityDiff = (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
      if (priorityDiff !== 0) return priorityDiff;
      
      // Sort by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      return 0;
    });
    
    setFilteredTasks(filtered);
}, [tasks, selectedCategory, searchQuery]);

  // Arrow key navigation for tasks
  useHotkeys('up', (e) => {
    if (keyboardEnabled && focusedElement?.startsWith('task-')) {
      e.preventDefault();
      const prevElement = getNextFocusableElement(focusedElement, 'prev');
      if (prevElement?.startsWith('task-')) {
        focusElement(prevElement);
      }
    }
  });

  useHotkeys('down', (e) => {
    if (keyboardEnabled && focusedElement?.startsWith('task-')) {
      e.preventDefault();
      const nextElement = getNextFocusableElement(focusedElement, 'next');
      if (nextElement?.startsWith('task-')) {
        focusElement(nextElement);
      }
    }
  });
  
  const completedCount = filteredTasks.filter(task => task.completed).length;
  const totalCount = filteredTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId);
  };
  
  if (filteredTasks.length === 0 && !searchQuery) {
    return (
      <div className={`flex-1 flex flex-col ${className}`}>
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-display font-bold text-gray-900">
              Tasks
            </h1>
            <ViewToggle 
              currentView={currentView}
              onViewChange={onViewChange}
            />
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks yet</h3>
            <p className="mt-2 text-gray-500">
              Start being productive by adding your first task above
            </p>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex-1 flex flex-col max-w-full overflow-hidden ${className}`}>
      <div className="bg-white border-b border-gray-200 p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-display font-bold text-gray-900">
              Tasks
            </h1>
            {totalCount > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent`} />
                <span>{completedCount}/{totalCount} completed ({progressPercent}%)</span>
              </div>
            )}
          </div>
          <ViewToggle 
            currentView={currentView}
            onViewChange={onViewChange}
          />
        </div>
        
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search tasks..."
          className="max-w-md"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ApperIcon name="Search" className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-3 max-w-full"
            layout
          >
            <AnimatePresence mode="popLayout">
{filteredTasks.map((task, index) => (
                <motion.div
                  key={`${task.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.2
                  }}
                  layout
                >
                  <TaskItem
                    task={task}
                    category={getCategoryById(task.categoryId)}
                    onTaskUpdated={onTaskUpdated}
                    onTaskDeleted={onTaskDeleted}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TaskList;