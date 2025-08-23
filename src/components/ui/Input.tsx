import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: string;
}

/**
 * Reusable Input Component
 * 
 * Features:
 * - Icon support (left and right)
 * - Error state handling
 * - Consistent styling with medical theme
 * - Full accessibility support
 */
const Input: React.FC<InputProps> = ({
  icon: Icon,
  rightIcon,
  error,
  label,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <input
          className={cn(
            `
              w-full px-4 py-3 rounded-lg border
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            `,
            Icon ? 'pl-11' : '',
            rightIcon ? 'pr-11' : '',
            error 
              ? 'border-red-300 bg-red-50 focus:ring-red-500' 
              : 'border-gray-300 bg-white',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;