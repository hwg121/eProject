import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useResponsiveDesign } from '../../utils/responsiveDesign';

interface BeautifulHeroProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badgeText: string;
}

const BeautifulHero: React.FC<BeautifulHeroProps> = ({
  title,
  description,
  icon: Icon,
  badgeText
}) => {
  const { isMobile } = useResponsiveDesign();

  return (
    <motion.section 
      className="relative bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 dark:from-emerald-600 dark:via-green-700 dark:to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 text-white shadow-2xl overflow-hidden backdrop-blur-sm"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div 
          className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-48 sm:w-80 h-48 sm:h-80 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(isMobile ? 10 : 15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-4 sm:mb-6 inline-block"
        >
          <div className="bg-white/20 dark:bg-white/30 backdrop-blur-md rounded-full px-3 sm:px-4 md:px-6 py-2 md:py-3 inline-flex items-center space-x-2 shadow-lg border border-white/30">
            <Icon className="h-3 sm:h-4 md:h-5 w-3 sm:w-4 md:w-5 slow-pulse" />
            <span className="text-xs sm:text-xs md:text-sm font-semibold tracking-wide">{badgeText}</span>
          </div>
        </motion.div>

        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-3 sm:mb-4 md:mb-6 leading-tight px-2 sm:px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-50 to-white">
            {title}
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/95 leading-relaxed max-w-4xl mx-auto font-light px-2 sm:px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.section>
  );
};

export default BeautifulHero;

