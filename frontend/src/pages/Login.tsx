import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/ui/Card';

const Login: React.FC = () => {
  const [email, setEmail] = useState(''); // Empty for production
  const [password, setPassword] = useState(''); // Empty for production
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Email validation helper
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || 'Invalid credentials. Please use: admin@greengroves.com / password123');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
        : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'
    }`}>
      {/* Dark Mode Background */}
      {isDarkMode && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, 
                rgba(34, 197, 94, 0.25) 0%, 
                rgba(34, 197, 94, 0.15) 25%, 
                rgba(34, 197, 94, 0.08) 35%, 
                transparent 50%
              )
            `,
            backgroundSize: "100% 100%",
          }}
        />
      )}

      {/* Background decorations for light mode */}
      {!isDarkMode && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-32 -right-32 w-80 h-80 bg-green-200/20 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{ duration: 25, repeat: Infinity }}
          />
        </div>
      )}

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-8" gradient={true} glow={true}>
          {/* Logo */}
          <motion.div
            className="text-center mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-2xl shadow-lg">
                <Leaf className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-emerald-700 to-green-600">
              Green Groves
            </h1>
            <p className={`font-medium ${
              isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
            }`}>Admin Dashboard</p>
          </motion.div>

          {/* Demo credentials info */}
          <motion.div
            className={`border rounded-lg p-4 mb-6 ${
              isDarkMode 
                ? 'bg-emerald-900/20 border-emerald-700/30 text-emerald-300' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className={`font-semibold mb-2 ${
              isDarkMode ? 'text-emerald-200' : 'text-emerald-800'
            }`}>Demo Login Credentials:</h3>
            <p className="text-sm">
              <strong>Email:</strong> admin@greengroves.com<br />
              <strong>Password:</strong> admin123
            </p>
            <p className={`text-xs mt-2 ${
              isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
            }`}>
              Fields are pre-filled for testing
            </p>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                className={`border rounded-lg p-4 flex items-center space-x-2 ${
                  isDarkMode 
                    ? 'bg-red-900/20 border-red-700/30 text-red-300' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <label className={`block font-semibold mb-2 ${
                isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  isDarkMode ? 'text-emerald-400' : 'text-emerald-500'
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-800 border-emerald-700/30 text-emerald-100' 
                      : 'bg-white border-emerald-200 text-gray-900'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className={`block font-semibold mb-2 ${
                isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  isDarkMode ? 'text-emerald-400' : 'text-emerald-500'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-800 border-emerald-700/30 text-emerald-100' 
                      : 'bg-white border-emerald-200 text-gray-900'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                    isDarkMode 
                      ? 'text-emerald-400 hover:text-emerald-300' 
                      : 'text-emerald-500 hover:text-emerald-700'
                  }`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                'Login'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className={isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}>
              Need help?{' '}
              <a href="#" className={`font-semibold transition-colors ${
                isDarkMode ? 'hover:text-emerald-200' : 'hover:text-emerald-800'
              }`}>
                Contact Administrator
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;