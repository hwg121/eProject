import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';
import Layout from './components/Layout/Layout';

// Pages
import Home from './pages/Home';
import Techniques from './pages/Techniques';
import Tools from './pages/Tools';
import Essentials from './pages/Essentials';
import Pots from './pages/Pots';
import Accessories from './pages/Accessories';
import Suggestions from './pages/Suggestions';
import Videos from './pages/Videos';
import Books from './pages/Books';
import About from './pages/About';
import Login from './pages/Login';

// Detail Pages
import TechniqueDetail from './pages/detail/TechniqueDetail';
import ToolDetail from './pages/detail/ToolDetail';
import VideoDetail from './pages/detail/VideoDetail';
import BookDetail from './pages/detail/BookDetail';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminTechniques from './pages/admin/AdminTechniques';
import AdminTools from './pages/admin/AdminTools';
import AdminEssentials from './pages/admin/AdminEssentials';
import AdminPots from './pages/admin/AdminPots';
import AdminAccessories from './pages/admin/AdminAccessories';
import AdminAbout from './pages/admin/AdminAbout';

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
                      {/* Main Pages */}
                      <Route path="/" element={<Home />} />
                      <Route path="/techniques" element={<Techniques />} />
                      <Route path="/tools" element={<Tools />} />
                      <Route path="/essentials" element={<Essentials />} />
                      <Route path="/pots" element={<Pots />} />
                      <Route path="/accessories" element={<Accessories />} />
                      <Route path="/suggestions" element={<Suggestions />} />
                      <Route path="/videos" element={<Videos />} />
                      <Route path="/books" element={<Books />} />
                      <Route path="/about" element={<About />} />
                      
                      {/* Detail Pages */}
                      <Route path="/techniques/:id" element={<TechniqueDetail />} />
                      <Route path="/tools/:id" element={<ToolDetail />} />
                      <Route path="/videos/:id" element={<VideoDetail />} />
                      <Route path="/books/:id" element={<BookDetail />} />
                      
                      {/* Admin Pages */}
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/techniques" element={<AdminTechniques />} />
                      <Route path="/admin/tools" element={<AdminTools />} />
                      <Route path="/admin/essentials" element={<AdminEssentials />} />
                      <Route path="/admin/pots" element={<AdminPots />} />
                      <Route path="/admin/accessories" element={<AdminAccessories />} />
                      <Route path="/admin/about" element={<AdminAbout />} />
                    </Routes>
                  </AnimatePresence>
                </Layout>
              } />
            </Routes>
          </Router>
        </AuthProvider>
      </NavigationProvider>
    </ThemeProvider>
  );
}

export default App;