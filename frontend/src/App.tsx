import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import './styles/responsive-perfect.css';

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

// Admin pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminAboutUs = lazy(() => import('./pages/AdminAboutUs'));
// TODO: Create these admin pages when needed
// const AdminTools = lazy(() => import('./pages/admin/AdminTools'));
// const AdminEssentials = lazy(() => import('./pages/admin/AdminEssentials'));
// const AdminPots = lazy(() => import('./pages/admin/AdminPots'));
// const AdminAccessories = lazy(() => import('./pages/admin/AdminAccessories'));
// const AdminAbout = lazy(() => import('./pages/admin/AdminAbout'));
// const AdminArticles = lazy(() => import('./pages/admin/AdminArticles'));
// const AdminVideos = lazy(() => import('./pages/admin/AdminVideos'));
// const AdminBooks = lazy(() => import('./pages/admin/AdminBooks'));
// const AdminSuggestions = lazy(() => import('./pages/admin/AdminSuggestions'));

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
              <Route path="/admin/about-us" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminAboutUs />
                </ProtectedRoute>
              } />
              {/* TODO: Uncomment these routes when admin pages are created */}
              {/* <Route path="/admin/tools" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminTools />
                </ProtectedRoute>
              } />
              <Route path="/admin/essentials" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminEssentials />
                </ProtectedRoute>
              } />
              <Route path="/admin/pots" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPots />
                </ProtectedRoute>
              } />
              <Route path="/admin/accessories" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminAccessories />
                </ProtectedRoute>
              } />
              <Route path="/admin/about" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminAbout />
                </ProtectedRoute>
              } />
              <Route path="/admin/articles" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminArticles />
                </ProtectedRoute>
              } />
              <Route path="/admin/videos" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminVideos />
                </ProtectedRoute>
              } />
              <Route path="/admin/books" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminBooks />
                </ProtectedRoute>
              } />
              <Route path="/admin/suggestions" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminSuggestions />
                </ProtectedRoute>
              } /> */}
              
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