import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useResponsiveDesign } from '../../utils/responsiveDesign';
import Header from './Header';
import Footer from './Footer';
import FloatingNav from './FloatingNav';
import { animationConfig, getAnimationConfig, performanceUtils } from '../../utils/animations';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode } = useTheme();
  const { isMobile } = useResponsiveDesign();

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
        : 'bg-gradient-to-br from-green-50 via-emerald-50 via-teal-50 to-green-50'
    }`}>
      {/* Dark Mode Forest Emerald Background */}
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
      
      {/* Enhanced animated background elements - Beautiful on mobile too! */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className={`absolute -top-64 -right-64 w-96 h-96 rounded-full blur-3xl ${
            isDarkMode 
              ? 'bg-gradient-to-br from-emerald-500/10 via-green-600/8 to-teal-500/5' 
              : 'bg-gradient-to-br from-emerald-200/20 via-green-300/15 to-teal-200/10'
          }`}
          animate={!isMobile ? {
            x: [0, 80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          } : {
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: isMobile ? 20 : 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={`absolute -bottom-64 -left-64 w-[500px] h-[500px] rounded-full blur-3xl ${
            isDarkMode 
              ? 'bg-gradient-to-tr from-teal-500/10 via-emerald-600/8 to-green-500/5' 
              : 'bg-gradient-to-tr from-teal-200/20 via-emerald-300/15 to-green-200/10'
          }`}
          animate={!isMobile ? {
            x: [0, -60, 0],
            y: [0, 80, 0],
            scale: [1, 0.8, 1],
            rotate: [0, -180, -360],
          } : {
            x: [0, -30, 0],
            y: [0, 40, 0],
            scale: [1, 0.9, 1],
            rotate: [0, -90, -180],
          }}
          transition={{
            duration: isMobile ? 25 : 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={`absolute top-1/3 left-1/3 w-80 h-80 rounded-full blur-3xl ${
            isDarkMode 
              ? 'bg-gradient-to-r from-green-500/8 via-emerald-500/6 to-teal-500/8' 
              : 'bg-gradient-to-r from-green-200/15 via-emerald-200/10 to-teal-200/15'
          }`}
          animate={!isMobile ? {
            x: [-150, 150, -150],
            y: [-100, 100, -100],
            scale: [0.6, 1.4, 0.6],
            rotate: [0, 360, 720],
          } : {
            x: [-75, 75, -75],
            y: [-50, 50, -50],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: isMobile ? 30 : 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={`absolute top-2/3 right-1/4 w-64 h-64 rounded-full blur-3xl ${
            isDarkMode 
              ? 'bg-gradient-to-bl from-emerald-600/8 via-green-500/10 to-teal-600/6' 
              : 'bg-gradient-to-bl from-emerald-300/10 via-green-200/15 to-teal-300/10'
          }`}
          animate={!isMobile ? {
            x: [100, -100, 100],
            y: [50, -50, 50],
            scale: [1.2, 0.8, 1.2],
            rotate: [0, -360, -720],
          } : {
            x: [50, -50, 50],
            y: [25, -25, 25],
            scale: [1.1, 0.9, 1.1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: isMobile ? 25 : 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Static particles - no animation to prevent layout shift */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              isDarkMode ? 'bg-emerald-400/20' : 'bg-emerald-300/30'
            }`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>
      
      <Header />
      <motion.main
        {...getAnimationConfig(animationConfig.pageTransition)}
        className="container mx-auto px-4 py-16 relative z-20"
        style={performanceUtils.willChange('transform')}
      >
        {children}
      </motion.main>
      <Footer />
      <FloatingNav />
    </div>
  );
};

export default Layout;