import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Mail, Phone, MapPin, Globe, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import { contactSettingService, ContactSetting } from '../../services/contactSettingService';

const Footer: React.FC = () => {
  const [contactSettings, setContactSettings] = useState<ContactSetting | null>(null);

  useEffect(() => {
    loadContactSettings();
  }, []);

  const loadContactSettings = async () => {
    try {
      const data = await contactSettingService.getActive();
      setContactSettings(data);
    } catch (error) {
      console.error('Error loading contact settings:', error);
    }
  };

  return (
    <footer className="bg-gradient-to-r from-emerald-900 via-green-900 to-emerald-900 text-white py-16 mt-20 relative overflow-hidden no-layout-shift">
      {/* Static background pattern - no animation to prevent layout shift */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M50 50c13.807 0 25-11.193 25-25S63.807 0 50 0 25 11.193 25 25s11.193 25 25 25zm0 25c13.807 0 25-11.193 25-25S63.807 50 50 50s-25 11.193-25 25 11.193 25 25 25z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-6 hover:scale-105 transition-transform duration-300">
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
            </div>
            <p className="text-emerald-100 leading-relaxed text-lg">
              Your trusted companion for all things gardening. Growing knowledge, nurturing nature, creating beautiful spaces.
            </p>
            
            {/* Social media icons */}
            <div className="flex space-x-4 mt-6">
              {[
                { url: contactSettings?.facebook, icon: Facebook, color: 'hover:bg-blue-600' },
                { url: contactSettings?.instagram, icon: Instagram, color: 'hover:bg-pink-600' },
                { url: contactSettings?.youtube, icon: Youtube, color: 'hover:bg-red-600' },
                { url: contactSettings?.linkedin, icon: Linkedin, color: 'hover:bg-blue-700' },
                { url: contactSettings?.website, icon: Globe, color: 'hover:bg-emerald-600' }
              ].filter(social => social.url).map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm hover:scale-110 hover:bg-white/20 ${social.color} transition-all duration-300`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="h-5 w-5 text-white" />
                </motion.a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 text-emerald-300">Quick Links</h3>
            <ul className="space-y-3 text-emerald-100">
              {[
                { href: "/techniques", label: "Gardening Tips" },
                { href: "/tools", label: "Tools & Equipment" },
                { href: "/books", label: "Recommended Books" },
                { href: "/videos", label: "Educational Videos" }
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
                { 
                  icon: Mail, 
                  text: contactSettings?.email || "info@greengroves.com",
                  href: `mailto:${contactSettings?.email || "info@greengroves.com"}`
                },
                { 
                  icon: Phone, 
                  text: contactSettings?.phone || "+1 (555) 123-4567",
                  href: `tel:${contactSettings?.phone || "+15551234567"}`
                },
                { 
                  icon: MapPin, 
                  text: contactSettings?.address || "123 Garden Street, Green City",
                  href: null
                }
              ].map((contact, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <contact.icon className="h-5 w-5 text-emerald-300" />
                  {contact.href ? (
                    <a 
                      href={contact.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {contact.text}
                    </a>
                  ) : (
                    <span className="text-sm">{contact.text}</span>
                  )}
                </motion.div>
              ))}
              {contactSettings?.working_hours && (
                <motion.div 
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <div className="h-5 w-5 text-emerald-300 flex items-center justify-center">
                    <span className="text-xs">🕒</span>
                  </div>
                  <span className="text-sm">{contactSettings.working_hours}</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-emerald-800/50 mt-12 pt-8 text-center text-emerald-200 relative z-10">
          <p className="text-lg">
            &copy; 2025 Green Groves. All rights reserved. Made with heart for gardening enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;