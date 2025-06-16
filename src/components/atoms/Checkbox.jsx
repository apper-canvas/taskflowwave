import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onChange?.(!checked)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={checked ? 'checked' : 'unchecked'}
      className={`
        relative w-5 h-5 rounded border-2 transition-all duration-150 focus:outline-none 
        focus:ring-2 focus:ring-offset-1 focus:ring-primary/50
        ${checked ? 'bg-primary border-primary' : 'bg-white border-gray-300 hover:border-gray-400'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      variants={{
        checked: { 
          backgroundColor: '#5B21B6',
          borderColor: '#5B21B6',
          scale: [1, 1.15, 1]
        },
        unchecked: { 
          backgroundColor: '#ffffff',
          borderColor: '#d1d5db'
        }
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 500, 
        damping: 30,
        duration: 0.3
      }}
      disabled={disabled}
      {...props}
    >
      <motion.div
        initial={false}
        animate={checked ? 'visible' : 'hidden'}
        variants={{
          visible: { opacity: 1, scale: 1 },
          hidden: { opacity: 0, scale: 0.5 }
        }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <ApperIcon name="Check" size={12} className="text-white" />
      </motion.div>
    </motion.button>
  );
};

export default Checkbox;