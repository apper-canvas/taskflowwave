import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const CategorySidebar = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  className = '' 
}) => {
  const totalTasks = categories.reduce((sum, cat) => sum + cat.taskCount, 0);
  
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
            onClick={() => onCategorySelect(null)}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full flex items-center justify-between p-3 rounded-lg text-left
              transition-all duration-150
              ${selectedCategory === null 
                ? 'bg-primary text-white shadow-sm' 
                : 'hover:bg-gray-100 text-gray-700'
              }
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
          
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                w-full flex items-center justify-between p-3 rounded-lg text-left
                transition-all duration-150 group
                ${selectedCategory === category.id 
                  ? 'text-white shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'
                }
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
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <ApperIcon name="Target" size={16} className="text-primary" />
            <span className="font-medium text-gray-900">Daily Progress</span>
          </div>
          <div className="text-2xl font-display font-bold text-primary">
            {Math.round((totalTasks - categories.reduce((sum, cat) => sum + cat.taskCount, 0)) * 100 / Math.max(totalTasks, 1))}%
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Keep up the great work!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CategorySidebar;