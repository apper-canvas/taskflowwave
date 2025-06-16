import { motion } from 'framer-motion';

const PriorityIndicator = ({ priority, className = '' }) => {
  const priorities = {
    low: { color: '#10B981', label: 'Low' },
    medium: { color: '#F59E0B', label: 'Medium' },
    high: { color: '#EF4444', label: 'High' },
    urgent: { color: '#EC4899', label: 'Urgent' }
  };
  
  const config = priorities[priority] || priorities.medium;
  
  return (
    <motion.div
      className={`flex items-center space-x-1 ${className}`}
      animate={priority === 'urgent' ? { scale: [1, 1.05, 1] } : {}}
      transition={{ 
        repeat: priority === 'urgent' ? Infinity : 0,
        duration: 2,
        ease: 'easeInOut'
      }}
    >
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      <span className="text-xs text-gray-600">{config.label}</span>
    </motion.div>
  );
};

export default PriorityIndicator;