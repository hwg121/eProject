import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import Card from './UI/Card';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-emerald-700 mb-2">
              Đang kiểm tra quyền truy cập...
            </h2>
            <p className="text-emerald-600">
              Vui lòng chờ trong giây lát
            </p>
          </motion.div>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check admin role if required (admin or moderator can access admin routes)
  if (requireAdmin && user?.role !== 'admin' && user?.role !== 'moderator') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Shield className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-700 mb-4">
              Truy cập bị từ chối
            </h2>
            <p className="text-red-600 mb-6">
              Bạn không có quyền truy cập vào trang này. Chỉ quản trị viên và điều hành viên mới có thể truy cập.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.history.back()}
                className="w-full bg-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
