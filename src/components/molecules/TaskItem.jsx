import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useHotkeys } from "react-hotkeys-hook";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import PriorityIndicator from "@/components/atoms/PriorityIndicator";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services";
import { useKeyboardNavigation } from "@/components/providers/KeyboardNavigationProvider";

const TaskItem = ({ task, category, onTaskUpdated, onTaskDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(task.completed);
  const taskRef = useRef(null);
  const { keyboardEnabled, registerFocusableElement, focusedElement } = useKeyboardNavigation();
const handleToggleComplete = async () => {
    setLoading(true);
    const newCompleted = !completed;
    
    // Optimistic update
    setCompleted(newCompleted);
    
    try {
      const updatedTask = await taskService.update(task.Id, {
        completed: newCompleted
      });
      
      if (newCompleted) {
        toast.success('Task completed! 🎉');
      }
      
      onTaskUpdated?.(updatedTask);
    } catch (error) {
      // Revert on error
      setCompleted(!newCompleted);
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };
const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.delete(task.Id);
      toast.success('Task deleted');
      onTaskDeleted?.(task.Id);
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };
useEffect(() => {
    if (taskRef.current && keyboardEnabled) {
      registerFocusableElement(taskRef.current, `task-${task.Id}`);
    }
  }, [keyboardEnabled, registerFocusableElement, task.Id]);

const handleKeyDown = (e) => {
    if (focusedElement === `task-${task.Id}`) {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleToggleComplete();
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          handleDelete();
          break;
        case 'c':
        case 'C':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            handleToggleComplete();
          }
          break;
      }
    }
  };
useEffect(() => {
    if (keyboardEnabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [keyboardEnabled, focusedElement]);

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !completed;
  const isFocused = focusedElement === `task-${task.Id}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        x: completed ? 20 : 0,
        scale: completed ? 0.98 : 1
      }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ 
        layout: { duration: 0.2 },
        hover: { duration: 0.15 }
      }}
      ref={taskRef}
      tabIndex={keyboardEnabled ? 0 : -1}
      role="button"
      aria-label={`Task: ${task.title}. ${completed ? 'Completed' : 'Not completed'}. Press Enter or Space to toggle completion, Delete to remove.`}
      className={`
        bg-white rounded-lg p-4 shadow-sm border border-gray-100 cursor-pointer
        hover:shadow-md transition-all duration-200 group
        ${completed ? 'opacity-70' : ''}
        ${isOverdue ? 'ring-1 ring-error/20 bg-error/5' : ''}
        ${isFocused ? 'ring-2 ring-primary/50' : ''}
        focus:outline-none
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={completed}
            onChange={handleToggleComplete}
            disabled={loading}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`
                text-sm font-medium text-gray-900 break-words
                ${completed ? 'line-through text-gray-500' : ''}
              `}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`
                  mt-1 text-xs text-gray-600 break-words
                  ${completed ? 'line-through' : ''}
                `}>
                  {task.description}
                </p>
              )}
              
              <div className="mt-2 flex items-center space-x-2">
                {category && (
                  <Badge 
                    color="primary"
                    icon={category.icon}
                    size="xs"
                  >
                    {category.name}
                  </Badge>
                )}
                
                <PriorityIndicator priority={task.priority} />
                
                {task.dueDate && (
                  <div className={`
                    flex items-center space-x-1 text-xs
                    ${isOverdue ? 'text-error' : 'text-gray-500'}
                  `}>
                    <ApperIcon name="Calendar" size={10} />
                    <span>
                      {format(new Date(task.dueDate), 'MMM d')}
                    </span>
                    {isOverdue && (
                      <span className="text-error font-medium">Overdue</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0 ml-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-error/10 rounded"
              >
                <ApperIcon name="Trash2" size={14} className="text-gray-400 hover:text-error" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;