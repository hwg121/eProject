import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  error: Error | string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onRetry, 
  className = '' 
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <motion.div
      className={`flex flex-col items-center justify-center space-y-4 p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center space-x-3">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <h3 className="text-lg font-semibold text-red-800">Something went wrong</h3>
      </div>
      
      <p className="text-red-600 text-center max-w-md">
        {errorMessage}
      </p>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default ErrorMessage;