import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Users, Target, Award, Mail, Phone, MapPin, 
  Send, CheckCircle, AlertCircle, Leaf, Star, Globe,
  Clock, TrendingUp, BookOpen, Video, Lightbulb
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const About: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save to localStorage for admin dashboard
      const existingMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      const newMessage = {
        id: Date.now().toString(),
        ...formData,
        status: 'unread',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedMessages = [newMessage, ...existingMessages];
      localStorage.setItem('contact_messages', JSON.stringify(updatedMessages));

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Trigger storage event for real-time updates
      window.dispatchEvent(new Event('storage'));
      
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { number: '15K+', label: 'Happy Gardeners', icon: Users, color: 'from-emerald-500 to-green-600' },
    { number: '800+', label: 'Expert Tips', icon: Lightbulb, color: 'from-yellow-500 to-orange-600' },
    { number: '120+', label: 'Video Guides', icon: Video, color: 'from-red-500 to-pink-600' },
    { number: '250+', label: 'Plant Varieties', icon: Leaf, color: 'from-green-500 to-emerald-600' }
  ];

  const team = [
    {
      name: 'Sarah Green',
      role: 'Founder & Master Gardener',
      bio: 'With over 20 years of gardening experience, Sarah founded Green Groves to share her passion for sustainable gardening.',
      avatar: '👩‍🌾',
      specialties: ['Organic Gardening', 'Permaculture', 'Soil Health']
    },
    {
      name: 'Mike Garden',
      role: 'Plant Specialist',
      bio: 'Mike specializes in rare plants and advanced growing techniques, helping gardeners tackle challenging projects.',
      avatar: '👨‍🌾',
      specialties: ['Rare Plants', 'Hydroponics', 'Plant Breeding']
    },
    {
      name: 'Emma Nature',
      role: 'Content Creator',
      bio: 'Emma creates our educational videos and writes comprehensive guides to make gardening accessible to everyone.',
      avatar: '👩‍🦳',
      specialties: ['Education', 'Video Production', 'Writing']
    }
  ];

  const inputClass = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
    isDarkMode 
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;

  const labelClass = `block font-semibold mb-2 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`;

  return (
    <div className="space-y-16">
      <PageHeader
        title="About Green Groves"
        subtitle="Growing knowledge, nurturing nature, creating beautiful spaces together"
        icon={<Heart className="h-10 w-10" />}
      />

      {/* Mission Section */}
      <motion.section
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="max-w-4xl mx-auto" gradient={true} glow={true}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white mb-6">
              <Target className="h-10 w-10" />
            </div>
            <h2 className={`text-4xl font-bold mb-6 ${isDarkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
              Our Mission
            </h2>
          </div>
          <p className={`text-xl leading-relaxed ${isDarkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>
            At Green Groves, we believe that everyone deserves to experience the joy and satisfaction of gardening. 
            Our mission is to provide comprehensive, accessible, and inspiring resources that help gardeners of all 
            levels create thriving, beautiful spaces while promoting sustainable and environmentally-friendly practices.
          </p>
        </Card>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="text-center" hover={true}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} text-white mb-4`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <h3 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                  {stat.number}
                </h3>
                <p className={`font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  {stat.label}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
            Meet Our Team
          </h2>
          <p className={`text-xl ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
            Passionate gardeners dedicated to helping you grow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="text-center h-full" hover={true}>
                <div className="text-8xl mb-6">{member.avatar}</div>
                <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                  {member.name}
                </h3>
                <p className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  {member.role}
                </p>
                <p className={`mb-6 leading-relaxed ${isDarkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>
                  {member.bio}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.specialties.map((specialty, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Form Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <Card>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                Get In Touch
              </h3>
              <p className={`text-lg ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                Have questions? We'd love to hear from you!
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email', value: 'info@greengroves.com' },
                { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
                { icon: MapPin, label: 'Address', value: '123 Garden Street, Green City' }
              ].map((contact, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <contact.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                      {contact.label}
                    </p>
                    <p className={isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}>
                      {contact.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Contact Form */}
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <h3 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
                  Send us a Message
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={inputClass}
                    required
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputClass}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className={labelClass}>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className={`${inputClass} resize-none`}
                  required
                  placeholder="Tell us more about your question or feedback..."
                />
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  className="flex items-center space-x-2 p-4 bg-green-100 border border-green-200 rounded-lg text-green-800"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Thank you! Your message has been sent successfully.</span>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  className="flex items-center space-x-2 p-4 bg-red-100 border border-red-200 rounded-lg text-red-800"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertCircle className="h-5 w-5" />
                  <span>Sorry, there was an error sending your message. Please try again.</span>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </Card>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-emerald-100">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: 'Sustainability',
                description: 'We promote eco-friendly gardening practices that protect and nurture our environment for future generations.'
              },
              {
                icon: Users,
                title: 'Community',
                description: 'We believe in the power of sharing knowledge and supporting each other in our gardening journeys.'
              },
              {
                icon: Award,
                title: 'Excellence',
                description: 'We strive to provide the highest quality content, tools, and resources to help you succeed.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-emerald-100 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.section>
    </div>
  );
};

export default About;