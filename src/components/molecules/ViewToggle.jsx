import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ViewToggle = ({ currentView, onViewChange, className = '' }) => {
  const views = [
    { id: 'today', label: 'Today', icon: 'Calendar' },
    { id: 'upcoming', label: 'Upcoming', icon: 'Clock' },
    { id: 'all', label: 'All Tasks', icon: 'List' }
  ];
  
  return (
    <div className={`flex bg-gray-100 rounded-lg p-1 ${className}`}>
      {views.map((view) => (
        <motion.button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`
            relative flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium
            transition-all duration-200 flex-1 justify-center
            ${currentView === view.id 
              ? 'text-primary' 
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {currentView === view.id && (
            <motion.div
              layoutId="activeViewBg"
              className="absolute inset-0 bg-white rounded-md shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <div className="relative flex items-center space-x-2">
            <ApperIcon name={view.icon} size={14} />
            <span>{view.label}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default ViewToggle;