import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Techniques from './pages/Techniques';
import Tools from './pages/Tools';
import Essentials from './pages/Essentials';
import Pots from './pages/Pots';
import Accessories from './pages/Accessories';
import Suggestions from './pages/Suggestions';
import Videos from './pages/Videos';
import Books from './pages/Books';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminTools from './pages/admin/AdminTools';
import AdminEssentials from './pages/admin/AdminEssentials';
import AdminPots from './pages/admin/AdminPots';
import AdminAccessories from './pages/admin/AdminAccessories';
import AdminAbout from './pages/admin/AdminAbout';
import AdminAboutUs from './pages/AdminAboutUs';
import AdminArticles from './pages/admin/AdminArticles';
import AdminVideos from './pages/admin/AdminVideos';
import AdminBooks from './pages/admin/AdminBooks';
import AdminSuggestions from './pages/admin/AdminSuggestions';

function App() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={
                <Layout>
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
                      <Route path="/admin" element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/tools" element={
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
                      <Route path="/admin/about-us" element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminAboutUs />
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
                      } />
                    </Routes>
                  </AnimatePresence>
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