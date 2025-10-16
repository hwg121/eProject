import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
  title?: string;
  message?: string;
  error?: Error | string;
  showRetry?: boolean;
  showGoBack?: boolean;
  onRetry?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title = 'Something Went Wrong',
  message = 'We encountered an unexpected error. Please try again.',
  error,
  showRetry = true,
  showGoBack = true,
  onRetry,
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const errorMessage = error 
    ? typeof error === 'string' 
      ? error 
      : error.message 
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="max-w-2xl w-full overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 sm:p-12 text-white">
          <motion.div
            className="flex items-center justify-center mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-5">
              <AlertCircle className="h-16 w-16 sm:h-20 sm:w-20" />
            </div>
          </motion.div>
          
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {title}
          </motion.h1>
          
          <motion.p
            className="text-center text-white/90 text-base sm:text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {message}
          </motion.p>
        </div>

        {/* Error Details */}
        <div className="p-8 sm:p-12">
          {errorMessage && (
            <motion.div
              className="mb-8 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                Error Details:
              </p>
              <p className="text-sm text-red-700 dark:text-red-400 font-mono break-all">
                {errorMessage}
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={handleGoHome}
              className="flex-1 flex items-center justify-center space-x-2 bg-emerald-500 text-white px-6 py-4 rounded-lg font-semibold hover:bg-emerald-600 transition-colors shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="h-5 w-5" />
              <span>Go to Homepage</span>
            </motion.button>

            {showGoBack && (
              <motion.button
                onClick={handleGoBack}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-4 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Go Back</span>
              </motion.button>
            )}

            {showRetry && (
              <motion.button
                onClick={handleRetry}
                className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="h-5 w-5" />
                <span>Try Again</span>
              </motion.button>
            )}
          </motion.div>

          {/* Help Text */}
          <motion.div
            className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Need help? <a href="/about-us" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Contact us</a> for assistance.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;

