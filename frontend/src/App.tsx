import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Techniques = lazy(() => import('./pages/Techniques'));
const Tools = lazy(() => import('./pages/Tools'));
const Essentials = lazy(() => import('./pages/Essentials'));
const Pots = lazy(() => import('./pages/Pots'));
const Accessories = lazy(() => import('./pages/Accessories'));
const Suggestions = lazy(() => import('./pages/Suggestions'));
const Videos = lazy(() => import('./pages/Videos'));
const Books = lazy(() => import('./pages/Books'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Login = lazy(() => import('./pages/Login'));

// Detail pages
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const VideoDetail = lazy(() => import('./pages/VideoDetail'));
const TechniqueDetail = lazy(() => import('./pages/TechniqueDetail'));

// Tags pages
const TagsList = lazy(() => import('./pages/TagsList'));
const TagArchive = lazy(() => import('./pages/TagArchive'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes - No Layout */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Regular Routes - With Layout */}
              <Route path="/*" element={
                <Layout>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AnimatePresence mode="wait">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/techniques" element={<Techniques />} />
                        <Route path="/tools" element={<Tools />} />
                        <Route path="/essentials" element={<Essentials />} />
                        <Route path="/pots" element={<Pots />} />
                        <Route path="/accessories" element={<Accessories />} />
                        <Route path="/suggestions" element={<Suggestions />} />
                        <Route path="/videos" element={<Videos />} />
                        <Route path="/books" element={<Books />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        
                        {/* Tags Pages */}
                        <Route path="/tags" element={<TagsList />} />
                        <Route path="/tags/:slug" element={<TagArchive />} />
                        
                        {/* Detail Pages */}
                        <Route path="/article/:slug" element={<ArticleDetail />} />
                        <Route path="/video/:slug" element={<VideoDetail />} />
                        <Route path="/technique/:slug" element={<TechniqueDetail />} />
                      </Routes>
                    </AnimatePresence>
                  </Suspense>
                </Layout>
              } />
              <Route path="*" element={<div className="text-center py-12"><h1 className="text-4xl font-bold text-emerald-800 mb-4">404 - Page Not Found</h1><p className="text-emerald-600">The page you're looking for doesn't exist.</p></div>} />
            </Routes>
          </Router>
        </AuthProvider>
      </NavigationProvider>
    </ThemeProvider>
  );
}

export default App;