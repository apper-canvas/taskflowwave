import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ completedToday = 0, totalToday = 0, className = '' }) => {
  const today = new Date();
  const progressPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-primary to-secondary text-white ${className}`}
    >
      <div className="px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">TaskFlow</h1>
            <p className="text-primary-100 mt-1">
              {format(today, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-3">
              <div>
                <div className="text-2xl font-display font-bold">
                  {completedToday}/{totalToday}
                </div>
                <div className="text-xs text-primary-100">
                  Tasks completed today
                </div>
              </div>
              
              <motion.div
                className="relative w-16 h-16"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-primary-300"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    className="text-accent"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                    animate={{ 
                      strokeDashoffset: 2 * Math.PI * 28 * (1 - progressPercent / 100)
                    }}
                    transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">{progressPercent}%</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {progressPercent === 100 && totalToday > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 flex items-center space-x-2 text-accent"
          >
            <ApperIcon name="Star" size={16} />
            <span className="text-sm font-medium">
              Congratulations! You've completed all tasks for today! 🎉
            </span>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;