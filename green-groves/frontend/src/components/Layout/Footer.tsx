import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-emerald-900 via-green-900 to-emerald-900 text-white py-16 mt-20 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M50 50c13.807 0 25-11.193 25-25S63.807 0 50 0 25 11.193 25 25s11.193 25 25 25zm0 25c13.807 0 25-11.193 25-25S63.807 50 50 50s-25 11.193-25 25 11.193 25 25 25z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          <div>
            <motion.div 
              className="flex items-center space-x-3 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <Leaf className="h-8 w-8 text-emerald-300 drop-shadow-lg" />
                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-lg opacity-30"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                  Green Groves
                </span>
                <div className="text-xs text-emerald-400 font-medium tracking-wider">GARDENING PARADISE</div>
              </div>
            </motion.div>
            <p className="text-emerald-100 leading-relaxed text-lg">
              Your trusted companion for all things gardening. Growing knowledge, nurturing nature, creating beautiful spaces.
            </p>
            
            {/* Social media icons placeholder */}
            <div className="flex space-x-4 mt-6">
              {['📘', '📷', '🐦', '📺'].map((icon, index) => (
                <motion.div
                  key={index}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm"
                  whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.2)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-lg">{icon}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 text-emerald-300">Quick Links</h3>
            <ul className="space-y-3 text-emerald-100">
              {[
                { href: "/techniques", label: "🌱 Gardening Tips" },
                { href: "/tools", label: "🔧 Tools & Equipment" },
                { href: "/books", label: "📚 Recommended Books" },
                { href: "/videos", label: "🎥 Educational Videos" }
              ].map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <a 
                    href={link.href} 
                    className="hover:text-white transition-all duration-300 hover:drop-shadow-lg flex items-center space-x-2"
                  >
                    <span>{link.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 text-emerald-300">Contact Info</h3>
            <div className="space-y-4 text-emerald-100">
              {[
                { icon: Mail, text: "info@greengroves.com" },
                { icon: Phone, text: "+1 (555) 123-4567" },
                { icon: MapPin, text: "123 Garden Street, Green City" }
              ].map((contact, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <contact.icon className="h-5 w-5 text-emerald-300" />
                  <span className="text-sm">{contact.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <motion.div 
          className="border-t border-emerald-800/50 mt-12 pt-8 text-center text-emerald-200 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-lg">
            &copy; 2025 Green Groves. All rights reserved. Made with 🌱 for gardening enthusiasts.
          </p>
          <motion.div 
            className="mt-4 text-emerald-400"
            animate={{ 
              textShadow: [
                '0 0 5px rgba(16, 185, 129, 0.5)',
                '0 0 20px rgba(16, 185, 129, 0.8)',
                '0 0 5px rgba(16, 185, 129, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ Growing dreams, one garden at a time ✨
          </motion.div>
          </motion.div>
      </div>
    </footer>
  );
};

export default Footer;