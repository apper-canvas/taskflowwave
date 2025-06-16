import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useHotkeys } from 'react-hotkeys-hook';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { taskService } from '@/services';
import { useKeyboardNavigation } from '@/components/providers/KeyboardNavigationProvider';

const QuickAddBar = ({ categories, onTaskAdded, defaultCategory }) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(defaultCategory || categories[0]?.id || '');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const { keyboardEnabled, registerFocusableElement } = useKeyboardNavigation();
  
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

  useEffect(() => {
    if (inputRef.current && keyboardEnabled) {
      registerFocusableElement(inputRef.current, 'quick-add-input');
    }
  }, [keyboardEnabled, registerFocusableElement]);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setTitle('');
      inputRef.current?.blur();
    }
  };

  // Global shortcuts
  useHotkeys('ctrl+enter, cmd+enter', (e) => {
    e.preventDefault();
    if (title.trim()) {
      handleSubmit(e);
    }
  }, { enableOnFormTags: true });

  useHotkeys('n', () => {
    if (!document.activeElement || document.activeElement.tagName !== 'INPUT') {
      inputRef.current?.focus();
    }
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 p-4"
    >
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
<div className="flex-1">
          <Input
            ref={inputRef}
            placeholder="What needs to be done? (Ctrl+Enter to add, N to focus, Esc to clear)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            icon="Plus"
            className="border-0 ring-0 focus:ring-1 focus:ring-primary/30 bg-surface"
            aria-label="Quick add task input"
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