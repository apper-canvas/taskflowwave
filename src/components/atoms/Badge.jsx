import ApperIcon from '@/components/ApperIcon';

const Badge = ({ 
  children, 
  color = 'gray', 
  icon, 
  size = 'sm',
  className = '' 
}) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error'
  };
  
  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };
  
  const iconSizes = {
    xs: 10,
    sm: 12,
    md: 14
  };
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colors[color]} ${sizes[size]} ${className}`}>
      {icon && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className="mr-1" 
        />
      )}
      {children}
    </span>
  );
};

export default Badge;