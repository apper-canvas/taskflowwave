import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { useKeyboardNavigation } from "@/components/providers/KeyboardNavigationProvider";

const CategorySidebar = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  className = '' 
}) => {
  const totalTasks = categories.reduce((sum, cat) => sum + cat.taskCount, 0);
  const { keyboardEnabled, registerFocusableElement, focusElement, getNextFocusableElement, focusedElement } = useKeyboardNavigation();
  const allTasksRef = useRef(null);
useEffect(() => {
    if (allTasksRef.current && keyboardEnabled) {
      registerFocusableElement(allTasksRef.current, 'category-all');
    }
  }, [keyboardEnabled, registerFocusableElement]);

  // Arrow key navigation for categories
  useHotkeys('up', (e) => {
    if (keyboardEnabled && focusedElement?.startsWith('category-')) {
      e.preventDefault();
      const prevElement = getNextFocusableElement(focusedElement, 'prev');
      if (prevElement?.startsWith('category-')) {
        focusElement(prevElement);
      }
    }
  });

  useHotkeys('down', (e) => {
    if (keyboardEnabled && focusedElement?.startsWith('category-')) {
      e.preventDefault();
      const nextElement = getNextFocusableElement(focusedElement, 'next');
      if (nextElement?.startsWith('category-')) {
        focusElement(nextElement);
      }
    }
  });

  const handleCategoryKeyDown = (e, categoryId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCategorySelect(categoryId);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-surface h-full overflow-y-auto ${className}`}
    >
      <div className="p-6">
        <h2 className="text-lg font-display font-semibold text-gray-900 mb-6">
          Categories
        </h2>
        
        <div className="space-y-2">
<motion.button
            ref={allTasksRef}
            onClick={() => onCategorySelect(null)}
            onKeyDown={(e) => handleCategoryKeyDown(e, null)}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            tabIndex={keyboardEnabled ? 0 : -1}
            role="button"
            aria-label="All tasks category"
            className={`
              w-full flex items-center justify-between p-3 rounded-lg text-left
              transition-all duration-150 focus:outline-none
              ${selectedCategory === null 
                ? 'bg-primary text-white shadow-sm' 
                : 'hover:bg-gray-100 text-gray-700'
              }
              ${focusedElement === 'category-all' ? 'ring-2 ring-primary/50' : ''}
            `}
          >
            <div className="flex items-center space-x-3">
              <ApperIcon name="Layers" size={16} />
              <span className="font-medium">All Tasks</span>
            </div>
            <Badge 
              color={selectedCategory === null ? 'accent' : 'gray'}
              size="xs"
            >
              {totalTasks}
            </Badge>
          </motion.button>
          
          {categories.map((category, index) => {
            const categoryRef = useRef(null);
            
            useEffect(() => {
              if (categoryRef.current && keyboardEnabled) {
                registerFocusableElement(categoryRef.current, `category-${category.id}`);
              }
            }, [keyboardEnabled, registerFocusableElement, category.id]);

            return (
              <motion.button
                key={category.id}
                ref={categoryRef}
                onClick={() => onCategorySelect(category.id)}
                onKeyDown={(e) => handleCategoryKeyDown(e, category.id)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                tabIndex={keyboardEnabled ? 0 : -1}
                role="button"
                aria-label={`${category.name} category, ${category.taskCount} tasks`}
                className={`
                  w-full flex items-center justify-between p-3 rounded-lg text-left
                  transition-all duration-150 group focus:outline-none
                  ${selectedCategory === category.id 
                    ? 'text-white shadow-sm' 
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                  ${focusedElement === `category-${category.id}` ? 'ring-2 ring-primary/50' : ''}
                `}
                style={{
                  backgroundColor: selectedCategory === category.id ? category.color : 'transparent'
                }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <ApperIcon name={category.icon} size={16} />
                  <span className="font-medium break-words">{category.name}</span>
                </div>
                <Badge 
                  color={selectedCategory === category.id ? 'accent' : 'gray'}
                  size="xs"
                >
                  {category.taskCount}
                </Badge>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default CategorySidebar;