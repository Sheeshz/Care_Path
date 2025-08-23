import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

/**
 * Reusable Card Component
 * 
 * Features:
 * - Consistent card styling with medical theme
 * - Optional hover animations
 * - Backdrop blur effects
 * - Responsive design
 */
const Card: React.FC<CardProps> = ({ 
  children, 
  className,
  hover = true 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        `
          bg-white rounded-xl shadow-lg border border-gray-200
          transition-all duration-200 ease-in-out
          p-6
        `,
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default Card;