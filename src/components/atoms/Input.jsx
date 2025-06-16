import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label, 
  error, 
  icon, 
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const hasError = !!error;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            block w-full rounded-lg border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 
            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary 
            sm:text-sm sm:leading-6 transition-all duration-150
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${hasError ? 'ring-error focus:ring-error' : ''}
            ${className}
          `}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-gray-400" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;