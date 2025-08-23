import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * Reusable Button Component
 * 
 * Features:
 * - Multiple variants with medical theme colors
 * - Size variations for different use cases  
 * - Hover and click animations
 * - Full accessibility support
 * - Consistent styling across the app
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-semibold rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-emerald-500 to-emerald-600 
      hover:from-emerald-600 hover:to-emerald-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-emerald-500
    `,
    secondary: `
      bg-gradient-to-r from-blue-500 to-blue-600
      hover:from-blue-600 hover:to-blue-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-blue-500
    `,
    ghost: `
      bg-transparent hover:bg-white hover:bg-opacity-10
      text-current border border-current border-opacity-30
      hover:border-opacity-50 focus:ring-white
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      hover:from-red-600 hover:to-red-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-red-500
    `
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;