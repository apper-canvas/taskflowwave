import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { taskService } from '@/services';

const QuickAddBar = ({ categories, onTaskAdded, defaultCategory }) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(defaultCategory || categories[0]?.id || '');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      const newTask = await taskService.create({
        title: title.trim(),
        categoryId,
        priority
      });
      
      setTitle('');
      toast.success('Task added successfully!');
      onTaskAdded?.(newTask);
    } catch (error) {
      toast.error('Failed to add task');
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 p-4"
    >
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <div className="flex-1">
          <Input
            placeholder="What needs to be done? (Press Enter to add)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            icon="Plus"
            className="border-0 ring-0 focus:ring-1 focus:ring-primary/30 bg-surface"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:ring-primary focus:border-primary"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:ring-primary focus:border-primary"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          
          <Button
            type="submit"
            loading={loading}
            disabled={!title.trim()}
            className="px-6"
          >
            Add
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default QuickAddBar;