import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Users, Mail, Phone, MapPin, Send, AlertCircle, CheckCircle, MessageSquare, User as UserIcon, Sparkles, Heart, Target, Star } from 'lucide-react';
import Card from '../components/ui/Card';
import { heroSectionService, staffMemberService, mapSettingService, contactService } from '../services/api.ts';
import { contactSettingService, ContactSetting } from '../services/contactSettingService';
import { useResponsiveDesign } from '../utils/responsiveDesign';

interface HeroSection {
  title: string;
  description: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  short_bio: string;
  avatar?: string;
}

interface MapSetting {
  embed_url: string;
  location_name?: string;
  address?: string;
}

const AboutUs: React.FC = () => {
  const { isMobile } = useResponsiveDesign();
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [mapSetting, setMapSetting] = useState<MapSetting | null>(null);
  const [contactSettings, setContactSettings] = useState<ContactSetting | null>(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Parallax scroll effect
  const { scrollY } = useScroll();
  // const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  // const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Style iframe after map loads
    if (mapSetting) {
      const style = document.createElement('style');
      style.textContent = `
        .map-container iframe {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
          border-radius: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [mapSetting]);

  const loadData = async () => {
    try {
      setLoading(true);

            // Load hero section
            try {

              const heroResponse: any = await heroSectionService.getActive();

              if (heroResponse && heroResponse.id) {

                setHeroSection(heroResponse);
              } else {

                setHeroSection(null);
              }
            } catch (err) {
              console.error('❌ Error loading hero section:', err);
              setHeroSection(null);
            }

            // Load staff members
            try {
              const staffResponse: any = await staffMemberService.getActive();

              if (staffResponse && Array.isArray(staffResponse)) {

                setStaffMembers(staffResponse);
              } else {

                setStaffMembers([]);
              }
            } catch (err) {
              console.error('Error loading staff members:', err);
              setStaffMembers([]);
            }

            // Load map setting
            try {
              const mapResponse: any = await mapSettingService.getActive();

              if (mapResponse && mapResponse.id) {

                setMapSetting(mapResponse);
              } else {

                setMapSetting(null);
              }
            } catch (err) {
              console.error('Error loading map setting:', err);
              setMapSetting(null);
            }

            // Load contact settings
            try {
              const contactSettingsResponse: any = await contactSettingService.getActive();

              if (contactSettingsResponse) {

                setContactSettings(contactSettingsResponse);
              } else {

                setContactSettings(null);
              }
            } catch (err) {
              console.error('Error loading contact settings:', err);
              setContactSettings(null);
            }

    } catch (err) {
      setError('Failed to load about us content');
      console.error('Error loading about us:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await contactService.sendMessage(formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'An error occurred while sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-emerald-600 mx-auto absolute inset-0"></div>
            <Sparkles className="h-8 w-8 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <motion.p 
            className="text-xl font-semibold text-emerald-600"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading amazing content...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      {heroSection && (
        <motion.section 
          className="relative -mt-8"
          style={{ opacity }}
        >
          <div className="relative bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 dark:from-emerald-600 dark:via-green-700 dark:to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 text-white shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Animated Background Patterns */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
              <motion.div 
                className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                  x: [0, 50, 0],
                  y: [0, -50, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, -90, 0],
                  x: [0, -50, 0],
                  y: [0, 50, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-yellow-200/20 to-transparent rounded-full blur-2xl"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/30 rounded-full"
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
                className="mb-6 inline-block"
              >
                <div className="bg-white/20 dark:bg-white/30 backdrop-blur-md rounded-full px-4 md:px-6 py-2 md:py-3 inline-flex items-center space-x-2 shadow-lg border border-white/30">
                  <Sparkles className="h-4 md:h-5 w-4 md:w-5 animate-pulse" />
                  <span className="text-xs md:text-sm font-semibold tracking-wide">Welcome to Our Story</span>
                </div>
              </motion.div>

              <motion.h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold mb-4 sm:mb-6 md:mb-8 leading-tight px-2 sm:px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-50 to-white">
                {heroSection.title}
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/95 leading-relaxed max-w-4xl mx-auto font-light px-2 sm:px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {heroSection.description}
              </motion.p>

              <motion.div
                className="mt-6 sm:mt-8 md:mt-12 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2 sm:px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="bg-white/10 dark:bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center space-x-2 sm:space-x-3 border border-white/20 shadow-lg hover:bg-white/20 transition-all">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  <div className="text-left">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">500+</p>
                    <p className="text-xs sm:text-sm text-white/80">Happy Clients</p>
                  </div>
                </div>
                <div className="bg-white/10 dark:bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center space-x-2 sm:space-x-3 border border-white/20 shadow-lg hover:bg-white/20 transition-all">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  <div className="text-left">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">100%</p>
                    <p className="text-xs sm:text-sm text-white/80">Satisfaction</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Staff Cards Section */}
      {staffMembers.length > 0 && (
        <section className="relative">
          {/* Section Background - Removed green background */}
          
          <div className="text-center mb-8 sm:mb-12 md:mb-16 px-3 sm:px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 sm:px-4 md:px-5 py-2 rounded-full mb-3 sm:mb-4 md:mb-6 shadow-md backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span className="font-semibold text-xs sm:text-sm">Our Amazing Team</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4 md:mb-6">
                Meet Our Team
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
                Passionate experts dedicated to helping you grow and succeed in every step of your journey
              </p>
            </motion.div>
          </div>
          
          {/* Dynamic grid layout based on number of staff - Perfect Mobile Responsive */}
          <div className={`grid gap-4 sm:gap-6 md:gap-8 px-3 sm:px-4 ${
            staffMembers.length === 1 ? 'grid-cols-1 max-w-sm sm:max-w-md mx-auto' :
            staffMembers.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl sm:max-w-3xl mx-auto' :
            staffMembers.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
            staffMembers.length === 4 ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl sm:max-w-4xl mx-auto' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
          }`}>
            {staffMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="group relative h-full">
                  {/* Card Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/15 to-purple-500/15 dark:from-blue-500/20 dark:to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-105"></div>
                  
                  <Card className="relative h-full text-center transition-all duration-500 p-4 sm:p-6 md:p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-gray-100 dark:border-gray-700/50 group-hover:border-blue-300 dark:group-hover:border-blue-500 group-hover:shadow-3xl group-hover:scale-105 overflow-hidden">
                    {/* Animated Decorative Corner Elements */}
                    <motion.div 
                      className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/60 to-purple-200/60 dark:from-blue-400/40 dark:to-purple-400/40 rounded-bl-full opacity-0 group-hover:opacity-100"
                      animate={{ rotate: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    ></motion.div>
                    <motion.div 
                      className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-pink-200/60 to-orange-200/60 dark:from-pink-400/40 dark:to-orange-400/40 rounded-tr-full opacity-0 group-hover:opacity-100"
                      animate={{ rotate: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    ></motion.div>
                    
                    <div className="relative z-10">
                      <div className="mb-3 sm:mb-4 md:mb-6">
                        <motion.div 
                          className="relative inline-block"
                          whileHover={{ scale: 1.08, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {/* Avatar Glow Effect */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/25 to-purple-500/25 dark:from-blue-500/30 dark:to-purple-600/30 opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500 scale-110"></div>
                          
                      <img 
                        src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=200&background=10b981&color=fff`}
                        alt={member.name}
                            className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full mx-auto object-cover border-2 sm:border-4 border-white dark:border-gray-700 shadow-2xl ring-2 sm:ring-4 ring-gray-200 dark:ring-gray-700/50 group-hover:ring-blue-300 dark:group-hover:ring-blue-500 group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105"
                          />
                          
                          {/* Animated Floating Elements */}
                          <motion.div
                            className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-1.5 sm:p-2 shadow-lg opacity-0 group-hover:opacity-100"
                            animate={{ 
                              rotate: [0, 360],
                              scale: [1, 1.1, 1],
                              y: [0, -5, 0]
                            }}
                            transition={{ 
                              duration: 4, 
                              repeat: Infinity, 
                              ease: "easeInOut" 
                            }}
                          >
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </motion.div>
                          
                          {/* Additional Floating Stars */}
                          <motion.div
                            className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full p-1 sm:p-1.5 shadow-md opacity-0 group-hover:opacity-100"
                            animate={{ 
                              rotate: [0, -360],
                              scale: [0.8, 1.2, 0.8],
                              x: [0, 3, 0]
                            }}
                            transition={{ 
                              duration: 3, 
                              repeat: Infinity, 
                              ease: "easeInOut",
                              delay: 0.5
                            }}
                          >
                            <Star className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                          </motion.div>
                        </motion.div>
                      </div>
                      
                      <motion.h3 
                        className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        {member.name}
                      </motion.h3>
                      
                      <div className="inline-block mb-2 sm:mb-3 md:mb-4 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-gray-100 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/50 rounded-full">
                        <p className="text-gray-700 dark:text-gray-300 font-semibold text-xs sm:text-sm">{member.role}</p>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                        {member.short_bio}
                      </p>

                      {/* Subtle Hover Overlay - Removed problematic overlay */}
                    </div>
                  </Card>
                  </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Contact & Map Section - Combined */}
      <section className="relative py-8 md:py-12">
        {/* Background Decoration - Removed unnecessary backgrounds */}
        
        <div className="text-center mb-12 md:mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/50 text-gray-700 dark:text-gray-300 px-4 md:px-5 py-2 rounded-full mb-4 md:mb-6 shadow-md backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <MessageSquare className="h-4 md:h-5 w-4 md:w-5" />
              <span className="font-semibold text-xs md:text-sm">Let's Connect</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 dark:text-gray-200 mb-4 md:mb-6">
              Get In Touch
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
              Have a question? Visit us or send us a message
            </p>
          </motion.div>
        </div>
        
        {/* Grid Layout: Map (Left) & Contact Form (Right) */}
        <div className={`grid grid-cols-1 gap-6 md:gap-8 mx-auto px-4 ${mapSetting ? 'lg:grid-cols-2 max-w-7xl' : 'max-w-4xl'}`}>
          
          {/* LEFT COLUMN: Map */}
          {mapSetting && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative flex order-2 lg:order-1"
            >
              {/* Map Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-500/20 dark:from-emerald-400/30 dark:to-green-500/30 rounded-3xl blur-2xl"></div>
              
              <Card className="relative overflow-hidden shadow-2xl border-2 border-emerald-100 dark:border-emerald-700/50 rounded-3xl flex-1 backdrop-blur-sm">
                <div className="relative h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[800px] flex flex-col">
                  {/* Header */}
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 p-4 md:p-6 z-10 rounded-t-3xl flex-shrink-0">
                    <div className="flex items-center space-x-2 md:space-x-3 text-white">
                      <div className="bg-white/20 p-1.5 md:p-2 rounded-lg backdrop-blur-sm">
                        <MapPin className="h-4 md:h-6 w-4 md:w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg md:text-xl font-bold">Visit Our Location</h3>
                        {mapSetting.address && (
                          <p className="text-emerald-50 text-xs md:text-sm mt-1 line-clamp-2">{mapSetting.address}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Map Container */}
                  <div className="flex-1 relative overflow-hidden">
                    <div 
                      className="map-container absolute inset-0 w-full h-full"
                      style={{
                        margin: 0,
                        padding: 0
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: mapSetting.embed_url
                      }}
                    />
                    {/* Map Overlay Border */}
                    <div className="absolute inset-0 ring-2 ring-inset ring-emerald-500/20 pointer-events-none"></div>
                    
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* RIGHT COLUMN: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: mapSetting ? 30 : 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex order-1 lg:order-2"
          >
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-500/20 dark:from-emerald-400/30 dark:to-green-500/30 rounded-3xl blur-2xl"></div>
            
            <Card className="relative shadow-2xl border-2 border-emerald-100 dark:border-emerald-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg overflow-hidden flex-1 flex flex-col">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-br from-emerald-100/50 dark:from-emerald-900/30 to-transparent rounded-full -translate-y-16 md:-translate-y-32 translate-x-16 md:translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-tr from-green-100/50 dark:from-green-900/30 to-transparent rounded-full translate-y-16 md:translate-y-32 -translate-x-16 md:-translate-x-32"></div>
              
              <div className="relative z-10 p-6 md:p-8 lg:p-10 flex flex-col h-full">
                <div className="text-center mb-6 md:mb-8 flex-shrink-0">
                  <motion.div
                    className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 rounded-2xl mb-3 md:mb-4 shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Send className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">Send us a Message</h3>
                  <p className="text-emerald-600/80 dark:text-emerald-300/80 text-sm md:text-base">We'll respond within 24 hours</p>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col" noValidate>
                <div className="space-y-4 md:space-y-6 flex-1">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <label htmlFor="name" className="block text-sm font-bold text-emerald-800 dark:text-emerald-200 mb-2 md:mb-3 flex items-center space-x-2">
                    <UserIcon className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Name <span className="text-red-500">*</span></span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Your full name"
                      required
                      className="w-full px-4 md:px-5 py-3 md:py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:border-emerald-300 dark:hover:border-emerald-500 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    <motion.div
                      className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2"
                      animate={{ scale: focusedField === 'name' ? 1.2 : 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <UserIcon className={`h-4 md:h-5 w-4 md:w-5 transition-colors duration-300 ${focusedField === 'name' ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'}`} />
                    </motion.div>
                    {focusedField === 'name' && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-400/10 dark:to-green-400/10 -z-10"
                        layoutId="inputFocus"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </div>
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <label htmlFor="email" className="block text-sm font-bold text-emerald-800 dark:text-emerald-200 mb-2 md:mb-3 flex items-center space-x-2">
                    <Mail className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Email <span className="text-red-500">*</span></span>
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="your.email@example.com"
                      required
                      className="w-full px-4 md:px-5 py-3 md:py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:border-emerald-300 dark:hover:border-emerald-500 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    <motion.div
                      className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2"
                      animate={{ scale: focusedField === 'email' ? 1.2 : 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Mail className={`h-4 md:h-5 w-4 md:w-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'}`} />
                    </motion.div>
                    {focusedField === 'email' && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-400/10 dark:to-green-400/10 -z-10"
                        layoutId="inputFocus"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </div>
                </motion.div>

                {/* Subject Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <label htmlFor="subject" className="block text-sm font-bold text-emerald-800 dark:text-emerald-200 mb-2 md:mb-3 flex items-center space-x-2">
                    <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Subject <span className="text-red-500">*</span></span>
                  </label>
                  <div className="relative group">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                    placeholder="What's this about?"
                    required
                      className="w-full px-4 md:px-5 py-3 md:py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:border-emerald-300 dark:hover:border-emerald-500 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    {focusedField === 'subject' && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-400/10 dark:to-green-400/10 -z-10"
                        layoutId="inputFocus"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                </div>
                </motion.div>

                {/* Message Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label htmlFor="message" className="block text-sm font-bold text-emerald-800 dark:text-emerald-200 mb-2 md:mb-3 flex items-center space-x-2">
                    <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Message <span className="text-red-500">*</span></span>
                  </label>
                  <div className="relative group">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Tell us more about your question or feedback..."
                      rows={3}
                      required
                      className="w-full px-4 md:px-5 py-3 md:py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:border-emerald-300 dark:hover:border-emerald-500 resize-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    {focusedField === 'message' && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-400/10 dark:to-green-400/10 -z-10"
                        layoutId="inputFocus"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </div>
                </motion.div>
                </div>

                {/* Submit Button */}
                <div className="mt-4 md:mt-6 flex-shrink-0">
                  <motion.button
                  type="submit"
                  disabled={isSubmitting}
                    className="relative w-full bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 dark:from-emerald-600 dark:via-green-700 dark:to-teal-700 text-white py-4 md:py-5 px-6 md:px-8 rounded-xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                    {/* Button Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    
                    <div className="relative flex items-center justify-center space-x-2 md:space-x-3">
                  {isSubmitting ? (
                    <>
                          <motion.div 
                            className="w-5 h-5 md:w-6 md:h-6 border-3 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span className="text-sm md:text-base">Sending...</span>
                    </>
                  ) : (
                    <>
                          <Send className="h-5 w-5 md:h-6 md:w-6" />
                          <span className="text-sm md:text-base">Send Message</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="hidden sm:block"
                          >
                            →
                          </motion.div>
                    </>
                  )}
                    </div>
                  </motion.button>
                </div>
              </form>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-8 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl blur-lg"></div>
                  <div className="relative p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl shadow-lg">
                    <div className="flex items-start space-x-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <CheckCircle className="h-7 w-7 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-green-800 mb-1">Message Sent Successfully!</h4>
                        <p className="text-green-700">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-8 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur-lg"></div>
                  <div className="relative p-6 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl shadow-lg">
                    <div className="flex items-start space-x-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <AlertCircle className="h-7 w-7 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-red-800 mb-1">Oops! Something went wrong</h4>
                        <p className="text-red-700">{errorMessage}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="relative py-8 md:py-12">
        {/* Background Decoration - Removed green background */}
        
        <div className="text-center mb-12 md:mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 text-emerald-700 dark:text-emerald-300 px-4 md:px-5 py-2 rounded-full mb-4 md:mb-6 shadow-md backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/50">
              <Phone className="h-4 md:h-5 w-4 md:w-5" />
              <span className="font-semibold text-xs md:text-sm">Stay Connected</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 mb-4 md:mb-6">
              Contact Information
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-emerald-600/90 dark:text-emerald-300/90 max-w-3xl mx-auto font-light">
              Reach out to us through any of these channels
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
          {/* Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="group relative h-full">
              {/* Card Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-green-500/30 dark:from-emerald-400/40 dark:to-green-500/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <Card className="relative h-full text-center p-6 md:p-8 lg:p-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-emerald-100 dark:border-emerald-700/50 group-hover:border-emerald-300 dark:group-hover:border-emerald-500 transition-all duration-500 group-hover:shadow-2xl">
                <motion.div 
                  className="bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:shadow-xl"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Mail className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-3 md:mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Email</h3>
                <a href={`mailto:${contactSettings?.email || 'info@greengroves.com'}`} className="text-base md:text-lg text-emerald-600 dark:text-emerald-300 hover:text-emerald-700 dark:hover:text-emerald-200 transition-colors font-semibold block mb-3 break-all">
              {contactSettings?.email || 'info@greengroves.com'}
            </a>
                <div className="inline-block px-3 md:px-4 py-1.5 md:py-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                  <p className="text-xs md:text-sm text-emerald-700 dark:text-emerald-300 font-medium">Response within 24 hours</p>
                </div>
          </Card>
            </div>
          </motion.div>

          {/* Phone Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="group relative h-full">
              {/* Card Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-teal-500/30 dark:from-green-400/40 dark:to-teal-500/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <Card className="relative h-full text-center p-6 md:p-8 lg:p-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-emerald-100 dark:border-emerald-700/50 group-hover:border-green-300 dark:group-hover:border-green-500 transition-all duration-500 group-hover:shadow-2xl">
                <motion.div 
                  className="bg-gradient-to-br from-green-500 to-teal-600 dark:from-green-600 dark:to-teal-700 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:shadow-xl"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Phone className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-3 md:mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Phone</h3>
                <a href={`tel:${contactSettings?.phone || '+84123456789'}`} className="text-base md:text-lg text-emerald-600 dark:text-emerald-300 hover:text-emerald-700 dark:hover:text-emerald-200 transition-colors font-semibold block mb-3">
              {contactSettings?.phone || '+84 123 456 789'}
            </a>
                <div className="inline-block px-3 md:px-4 py-1.5 md:py-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                  <p className="text-xs md:text-sm text-green-700 dark:text-green-300 font-medium">{contactSettings?.working_hours || 'Mon - Fri: 8:00 - 18:00'}</p>
                </div>
          </Card>
            </div>
          </motion.div>

          {/* Address Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <div className="group relative h-full">
              {/* Card Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400/30 to-gray-500/30 dark:from-gray-400/40 dark:to-gray-500/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <Card className="relative h-full text-center p-6 md:p-8 lg:p-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-100 dark:border-gray-700/50 group-hover:border-gray-300 dark:group-hover:border-gray-500 transition-all duration-500 group-hover:shadow-2xl">
                <motion.div 
                  className="bg-gradient-to-br from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:shadow-xl"
                  whileHover={{ scale: [1, 1.2, 1.2, 1.2, 1], rotate: [0, 0, 5, -5, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  <MapPin className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3 md:mb-4 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">Address</h3>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 font-semibold mb-3 line-clamp-2">
              {contactSettings?.address || mapSetting?.address || 'Ho Chi Minh City, Vietnam'}
            </p>
                <div className="inline-block px-3 md:px-4 py-1.5 md:py-2 bg-gray-100 dark:bg-gray-800/50 rounded-full">
                  <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium">Visit us anytime!</p>
                </div>
          </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
