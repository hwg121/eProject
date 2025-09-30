import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wrench, Star, ArrowRight, Sparkles, Heart, Users, Award, Zap, Hammer, Leaf, PlayCircle, Library } from 'lucide-react';
import Card from '../components/UI/Card';
import Carousel from '../components/UI/Carousel';
import { animationConfig, getAnimationConfig, performanceUtils } from '../utils/animations';

const Home: React.FC = () => {

  const features = [
    {
      icon: <Zap className="h-10 w-10" />,
      title: 'Expert Tips & Techniques',
      description: 'Learn from seasoned gardeners with proven methods and time-tested wisdom',
      link: '/techniques',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Hammer className="h-10 w-10" />,
      title: 'Essential Tools Guide',
      description: 'Discover the right tools for every gardening task and maximize your efficiency',
      link: '/tools',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <Leaf className="h-10 w-10" />,
      title: 'Plant Care Essentials',
      description: 'Everything you need to know about soil, seeds, and nurturing healthy plants',
      link: '/essentials',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <PlayCircle className="h-10 w-10" />,
      title: 'Educational Videos',
      description: 'Visual guides and step-by-step tutorials to master gardening skills',
      link: '/videos',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: <Library className="h-10 w-10" />,
      title: 'Recommended Reading',
      description: 'Curated collection of the best gardening books from expert authors',
      link: '/books',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <Award className="h-10 w-10" />,
      title: 'Product Suggestions',
      description: 'Hand-picked recommendations and reviews for your perfect garden setup',
      link: '/suggestions',
      color: 'from-purple-500 to-violet-500'
    }
  ];

  const stats = [
    { number: '15K+', label: 'Happy Gardeners', icon: '👥', color: 'from-emerald-500 to-green-600' },
    { number: '800+', label: 'Expert Tips', icon: '💡', color: 'from-yellow-500 to-orange-600' },
    { number: '120+', label: 'Video Guides', icon: '🎥', color: 'from-red-500 to-pink-600' },
    { number: '250+', label: 'Plant Varieties', icon: '🌱', color: 'from-green-500 to-emerald-600' }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Urban Gardener",
      text: "Green Groves transformed my tiny balcony into a thriving garden paradise! The step-by-step guides are incredibly detailed and easy to follow.",
      avatar: "👩‍🌾",
      rating: 5,
      location: "New York"
    },
    {
      name: "Mike Chen",
      role: "Organic Farmer",
      text: "The tool recommendations saved me hundreds of dollars and countless hours. This is the most comprehensive gardening resource I've ever found!",
      avatar: "👨‍🌾",
      rating: 5,
      location: "California"
    },
    {
      name: "Emma Davis",
      role: "Garden Enthusiast",
      text: "Best gardening resource on the internet! The videos are incredibly helpful and the community is so supportive and knowledgeable.",
      avatar: "👩‍🦳",
      rating: 5,
      location: "Texas"
    }
  ];

  const featuredContent = [
    {
      id: '1',
      title: 'Container Gardening Mastery',
      description: 'Transform any small space into a thriving garden paradise with our comprehensive container gardening guide.',
      image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
      badge: 'Most Popular',
      link: '/techniques'
    },
    {
      id: '2',
      title: 'Essential Garden Tools 2024',
      description: 'Discover the must-have tools that every gardener needs for successful planting, pruning, and harvesting.',
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
      badge: 'Expert Pick',
      link: '/tools'
    },
    {
      id: '3',
      title: 'Organic Gardening Secrets',
      description: 'Learn the time-tested methods for growing healthy, chemical-free vegetables and herbs in your own backyard.',
      image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
      badge: 'Trending',
      link: '/essentials'
    }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <motion.section
        className="relative text-center py-32 px-8 bg-gradient-to-br from-emerald-600 via-green-600 via-teal-600 to-emerald-700 text-white rounded-3xl shadow-2xl overflow-hidden"
        {...getAnimationConfig(animationConfig.transformOnly)}
        style={performanceUtils.willChange('transform')}
      >
        {/* Simplified background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="relative z-10">
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-white/10 p-6 rounded-full backdrop-blur-sm border border-white/20">
                <Sparkles className="h-16 w-16 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-emerald-200 via-green-200 via-teal-200 to-emerald-200 bg-clip-text text-transparent drop-shadow-2xl">
              Green Groves
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-12 max-w-5xl mx-auto leading-relaxed text-emerald-50 font-light px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Your ultimate destination for gardening wisdom, tools, and inspiration.
            <br />
            <span className="text-white font-semibold">Grow your knowledge and nurture your green thumb with our comprehensive guides.</span>
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                to="/techniques"
                className="group relative bg-white text-emerald-600 px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden flex items-center justify-center space-x-3"
              >
                <span className="relative z-10">Start Gardening Today</span>
                <ArrowRight className="h-6 w-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                to="/tools"
                className="group relative bg-emerald-500/20 backdrop-blur-sm text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 border-2 border-white/30 hover:border-white/60 overflow-hidden flex items-center justify-center space-x-3"
              >
                <span className="relative z-10">Explore Tools</span>
                <Wrench className="h-6 w-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 + index * 0.2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, y: -10 }}
            >
              <div className={`text-4xl sm:text-6xl mb-4 p-4 sm:p-6 rounded-3xl bg-gradient-to-r ${stat.color} text-white shadow-2xl mx-auto w-fit hover:scale-105 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <motion.div 
                className="text-2xl sm:text-4xl font-black text-emerald-800 mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4 + index * 0.2, type: "spring", stiffness: 300 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-emerald-600 font-bold text-sm sm:text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Content Carousel */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-black bg-gradient-to-r from-emerald-800 via-green-700 to-teal-700 bg-clip-text text-transparent mb-6">
            Featured Content
          </h2>
          <p className="text-xl text-emerald-600 max-w-3xl mx-auto">
            Discover our most popular gardening guides and expert recommendations
          </p>
        </motion.div>
        
        <Carousel 
          items={featuredContent}
          autoPlay={true}
          interval={6000}
          showDots={true}
          showArrows={true}
          className="shadow-2xl"
        />
      </motion.section>

      {/* Features Grid */}
      <section className="py-20">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h2 
            className="text-6xl font-black bg-gradient-to-r from-emerald-800 via-green-700 to-teal-700 bg-clip-text text-transparent mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Everything You Need to Grow
          </motion.h2>
          <p className="text-2xl text-emerald-600 max-w-4xl mx-auto leading-relaxed font-light">
            From beginner basics to advanced techniques, we've got your gardening journey covered with 
            <span className="font-bold text-green-700"> expert guidance</span> and 
            <span className="font-bold text-emerald-700"> beautiful inspiration</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              <Link to={feature.link} className="block h-full">
                <Card className="h-full group cursor-pointer" gradient={true} glow={true}>
                  <div className={`text-white mb-8 p-6 bg-gradient-to-r ${feature.color} rounded-3xl w-fit shadow-2xl hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-3xl font-black text-emerald-800 mb-6 group-hover:text-emerald-600 transition-colors duration-500">
                    {feature.title}
                  </h3>
                  <p className="text-emerald-600 leading-relaxed text-lg mb-8 font-medium">
                    {feature.description}
                  </p>
                  
                  {/* Enhanced hover arrow */}
                  <motion.div
                    className="flex items-center text-emerald-500 font-bold text-lg opacity-0 group-hover:opacity-100"
                    initial={{ x: -20 }}
                    whileHover={{ x: 0 }}
                  >
                    <span className="relative z-10">Learn More</span>
                    <motion.div
                      className="ml-3"
                      animate={{ x: [0, 8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </motion.div>
                  </motion.div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.h2 
          className="text-5xl font-black text-center text-emerald-800 mb-20"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          What Our Community Says
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.7 + index * 0.3 }}
            >
              <Card className="text-center h-full relative" gradient={true} glow={true}>
                <motion.div 
                  className="text-8xl mb-6"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {testimonial.avatar}
                </motion.div>
                
                {/* Star rating */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2 + index * 0.3 + i * 0.1 }}
                    >
                      <Star className="h-6 w-6 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                
                <p className="text-emerald-700 italic mb-8 text-xl leading-relaxed font-medium">
                  "{testimonial.text}"
                </p>
                <div className="font-black text-emerald-800 text-xl">{testimonial.name}</div>
                <div className="text-emerald-600 font-semibold">{testimonial.role}</div>
                <div className="text-emerald-500 text-sm mt-2">📍 {testimonial.location}</div>
                
                {/* Decorative quote marks */}
                <div className="absolute top-4 left-4 text-6xl text-emerald-200 font-serif">"</div>
                <div className="absolute bottom-4 right-4 text-6xl text-emerald-200 font-serif rotate-180">"</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Enhanced Call to Action */}
      <motion.section
        className="relative bg-gradient-to-br from-green-500 via-emerald-600 via-teal-600 to-green-700 text-white py-32 px-8 rounded-3xl text-center shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
      >
        {/* Enhanced animated background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        <div className="relative z-10">
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.2, type: "spring", stiffness: 200 }}
          >
            <div className="bg-white/10 p-8 rounded-full backdrop-blur-sm border border-white/20">
              <Heart className="h-20 w-20 text-white" />
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-6xl md:text-7xl font-black mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
          >
            Ready to Transform Your Garden?
          </motion.h2>
          <motion.p 
            className="text-2xl mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.6 }}
          >
            Join <span className="font-bold text-emerald-200">thousands of gardening enthusiasts</span> who have already started their green journey with us. 
            <br />
            Discover the joy of growing your own paradise.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2.8 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/about"
              className="group relative bg-white text-emerald-600 px-16 py-6 rounded-full font-black text-2xl shadow-3xl hover:shadow-4xl transition-all duration-500 inline-flex items-center space-x-4 overflow-hidden"
            >
              <span className="relative z-10">Learn More About Us</span>
              <Users className="h-8 w-8 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;