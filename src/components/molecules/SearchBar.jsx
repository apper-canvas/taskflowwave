import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ onSearch, placeholder = "Search tasks...", className = '' }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch?.(query);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);
  
  const handleClear = () => {
    setQuery('');
    onSearch?.('');
  };
  
  return (
    <motion.div
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ duration: 0.15 }}
      className={`relative ${className}`}
    >
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        icon="Search"
        className="pr-10"
      />
      
      {query && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors"
        >
          <ApperIcon name="X" size={16} className="text-gray-400 hover:text-gray-600" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default SearchBar;