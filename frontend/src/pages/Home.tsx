import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wrench, Star, ArrowRight, Sparkles, Heart, Users, Award, Zap, Hammer, Leaf, PlayCircle, Library, Lightbulb, Video, Sprout, UserCheck } from 'lucide-react';
import Card from '../components/ui/Card';
import Carousel from '../components/ui/Carousel';
import { performanceUtils } from '../utils/animations';
import { useResponsiveDesign } from '../utils/responsiveDesign';
import { publicService } from '../services/api';
import { generateSlug } from '../utils/slug';
import '../styles/statistics.css';
import '../styles/hero-compact.css';

const Home: React.FC = () => {
  const { isMobile } = useResponsiveDesign();
  const [featuredContent, setFeaturedContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedContent = async () => {
      try {
        setLoading(true);
        
        // Fetch articles, videos, and products in parallel
        const [articlesResponse, videosResponse, booksResponse] = await Promise.all([
          publicService.getArticles().catch(() => ({ success: true, data: [] })),
          publicService.getVideos().catch(() => ({ success: true, data: [] })),
          publicService.getBooks().catch(() => ({ success: true, data: [] }))
        ]);

        // Extract data from responses
        const articles = Array.isArray(articlesResponse) ? articlesResponse : 
                        (articlesResponse?.success && articlesResponse?.data) ? articlesResponse.data : [];
        const videos = Array.isArray(videosResponse) ? videosResponse : 
                      (videosResponse?.success && videosResponse?.data) ? videosResponse.data : [];
        const books = Array.isArray(booksResponse) ? booksResponse : 
                     (booksResponse?.success && booksResponse?.data) ? booksResponse.data : [];

        // Create featured content array from real data
        const content = [];
        
        // Add featured articles (first 2)
        articles.slice(0, 2).forEach((article, index) => {
          content.push({
            id: `article-${article.id}`,
            title: article.title,
            description: article.excerpt || article.body?.substring(0, 150) + '...',
            image: article.featured_image || article.cover || '/image.png',
            badge: 'Featured Article',
            link: `/article/${article.slug || generateSlug(article.title)}`
          });
        });

        // Add featured videos (first 2)
        videos.slice(0, 2).forEach((video, index) => {
          content.push({
            id: `video-${video.id}`,
            title: video.title,
            description: video.description?.substring(0, 150) + '...',
            image: video.featured_image || video.thumbnail || '/image.png',
            badge: 'Featured Video',
            link: `/video/${video.slug || generateSlug(video.title)}`
          });
        });

        // Add featured books (first 1)
        books.slice(0, 1).forEach((book, index) => {
          content.push({
            id: `book-${book.id}`,
            title: book.name || book.title,
            description: book.description?.substring(0, 150) + '...',
            image: book.image || book.featured_image || '/image.png',
            badge: 'Featured Book',
            link: `/books`
          });
        });

        // Shuffle and limit to 6 items
        const shuffled = content.sort(() => Math.random() - 0.5);
        setFeaturedContent(shuffled.slice(0, 6));
        
      } catch (error) {
        console.error('Error loading featured content:', error);
        // Fallback to empty array
        setFeaturedContent([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedContent();
  }, []);

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
    { 
      number: '15K+', 
      label: 'Happy Gardeners', 
      icon: <UserCheck className="h-8 w-8" strokeWidth={2.5} />, 
      color: 'from-emerald-500 to-green-600',
      bgColor: 'from-emerald-50 to-green-50',
      iconColor: 'text-emerald-600'
    },
    { 
      number: '800+', 
      label: 'Expert Tips', 
      icon: <Lightbulb className="h-8 w-8" strokeWidth={2.5} />, 
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
      iconColor: 'text-yellow-600'
    },
    { 
      number: '120+', 
      label: 'Video Guides', 
      icon: <Video className="h-8 w-8" strokeWidth={2.5} />, 
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50',
      iconColor: 'text-red-600'
    },
    { 
      number: '250+', 
      label: 'Plant Varieties', 
      icon: <Sprout className="h-8 w-8" strokeWidth={2.5} />, 
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-600'
    }
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


  return (
    <div className="main-container-compact">
      {/* Compact Hero Section - Perfect Mobile Responsive */}
      <motion.section
        className="hero-compact relative text-center responsive-container bg-gradient-to-br from-emerald-600 via-green-600 via-teal-600 to-emerald-700 text-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
        {...(isMobile 
          ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
          : {
              initial: { opacity: 0, y: 50 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.8, ease: "easeOut" }
            }
        )}
        style={!isMobile ? performanceUtils.willChange('transform') : {}}
      >
        {/* Compact background elements */}
        <div className="hero-bg-element absolute inset-0 overflow-hidden">
          <div className={`absolute -top-16 -left-16 w-32 h-32 bg-white/10 rounded-full ${
            isMobile ? 'blur-lg' : 'blur-2xl'
          } slow-pulse`} />
          <div className={`absolute -bottom-16 -right-16 w-40 h-40 bg-white/5 rounded-full ${
            isMobile ? 'blur-lg' : 'blur-2xl'
          } slow-pulse`} style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative z-10">
          <motion.div
            className="hero-icon flex justify-center"
            {...(isMobile 
              ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
              : {
                  initial: { scale: 0.9, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  transition: { duration: 0.4, ease: "easeOut" }
                }
            )}
          >
            <div className="relative">
              <div className={`absolute inset-0 bg-white/20 rounded-full ${
                isMobile ? 'blur-lg' : 'blur-2xl'
              } very-slow-pulse`}></div>
              <div className="hero-icon-compact relative bg-white/10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Sparkles className="text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.h1 
            className="hero-title hero-title-compact font-black leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl px-4 sm:px-6 md:px-8"
            {...(isMobile 
              ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
              : {
                  initial: { opacity: 0, y: 50 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.8, ease: "easeOut" }
                }
            )}
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-emerald-200 via-green-200 via-teal-200 to-emerald-200 bg-clip-text text-transparent drop-shadow-2xl">
              Green Groves
            </span>
          </motion.h1>
          
          <motion.p 
            className="hero-description hero-description-compact max-w-4xl mx-auto text-emerald-50 font-light px-4 text-sm sm:text-base md:text-lg lg:text-xl"
            {...(isMobile 
              ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
              : {
                  initial: { opacity: 0, y: 30 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.5, ease: "easeOut" }
                }
            )}
          >
            Your ultimate destination for gardening wisdom, tools, and inspiration.
            <br />
            <span className="text-white font-semibold">Grow your knowledge and nurture your green thumb with our comprehensive guides.</span>
          </motion.p>
          
          <motion.div
            className="hero-buttons flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center px-4"
            {...(isMobile 
              ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
              : {
                  initial: { opacity: 0, y: 30 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.5, ease: "easeOut" }
                }
            )}
          >
            <motion.div 
              {...(isMobile 
                ? {} 
                : {
                    whileHover: { scale: 1.02, y: -2 },
                    whileTap: { scale: 0.98 },
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }
              )}
            >
              <Link
                to="/essentials"
                className="hero-btn-compact group relative bg-white text-emerald-600 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden flex items-center justify-center space-x-2 sm:space-x-3 rounded-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold min-h-[44px] touch-manipulation"
              >
                <span className="relative z-10">Start Gardening Today</span>
                <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            </motion.div>
            
            <motion.div 
              {...(isMobile 
                ? {} 
                : {
                    whileHover: { scale: 1.02, y: -2 },
                    whileTap: { scale: 0.98 },
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }
              )}
            >
              <Link
                to="/tools"
                className="hero-btn-compact group relative bg-emerald-500/20 backdrop-blur-sm text-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-2 border-white/30 hover:border-white/60 overflow-hidden flex items-center justify-center space-x-2 sm:space-x-3 rounded-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold min-h-[44px] touch-manipulation"
              >
                <span className="relative z-10">Explore Tools</span>
                <Wrench className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="stats-section"
        {...(isMobile 
          ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
          : {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 1, delay: 1 }
            }
        )}
      >
        <div className="stats-container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                {...(isMobile 
                  ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
                  : {
                      initial: { opacity: 0, scale: 0.5, y: 50 },
                      animate: { opacity: 1, scale: 1, y: 0 },
                      transition: { duration: 0.8, delay: 1.2 + index * 0.2, type: "spring", stiffness: 200 },
                      whileHover: { scale: 1.02, y: -3 }
                    }
                )}
              >
                {/* Modern Icon Design với Glassmorphism */}
                <div className={`stat-icon bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm border border-white/20 shadow-lg`}>
                  <div className={`${stat.iconColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {stat.icon}
                  </div>
                  {/* Subtle glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-full blur-xl transition-opacity duration-300`}></div>
                </div>
                
                {/* Number với typography nhất quán */}
                <motion.div 
                  className="stat-number"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.2, type: "spring", stiffness: 300 }}
                >
                  {stat.number}
                </motion.div>
                
                {/* Label with responsive size */}
                <div className="stat-label">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
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
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-emerald-600">Loading featured content...</p>
          </div>
        ) : featuredContent.length > 0 ? (
          <Carousel 
            items={featuredContent}
            autoPlay={true}
            interval={6000}
            showDots={true}
            showArrows={true}
            className="shadow-2xl"
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-emerald-600">No featured content available at the moment.</p>
          </div>
        )}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              <Link to={feature.link} className="block h-full">
                <Card className="h-full group cursor-pointer" gradient={true} glow={true}>
                  <div className={`text-white mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r ${feature.color} rounded-2xl sm:rounded-3xl w-fit shadow-2xl hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-800 mb-4 sm:mb-6 group-hover:text-emerald-600 transition-colors duration-500">
                    {feature.title}
                  </h3>
                  <p className="text-emerald-600 leading-relaxed text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 font-medium">
                    {feature.description}
                  </p>
                  
                  {/* Enhanced hover arrow */}
                  <motion.div
                    className="flex items-center text-emerald-500 font-bold text-sm sm:text-base lg:text-lg opacity-0 group-hover:opacity-100"
                    initial={{ x: -20 }}
                    whileHover={{ x: 0 }}
                  >
                    <span className="relative z-10">Learn More</span>
                    <motion.div
                      className="ml-2 sm:ml-3"
                      animate={{ x: [0, 8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.7 + index * 0.3 }}
            >
              <Card className="text-center h-full relative" gradient={true} glow={true}>
                <motion.div 
                  className="text-6xl sm:text-8xl mb-4 sm:mb-6"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {testimonial.avatar}
                </motion.div>
                
                {/* Star rating */}
                <div className="flex justify-center mb-4 sm:mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2 + index * 0.3 + i * 0.1 }}
                    >
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                
                <p className="text-emerald-700 italic mb-6 sm:mb-8 text-sm sm:text-base lg:text-xl leading-relaxed font-medium">
                  "{testimonial.text}"
                </p>
                <div className="font-black text-emerald-800 text-base sm:text-lg lg:text-xl">{testimonial.name}</div>
                <div className="text-emerald-600 font-semibold text-sm sm:text-base">{testimonial.role}</div>
                <div className="text-emerald-500 text-xs sm:text-sm mt-2">📍 {testimonial.location}</div>
                
                {/* Decorative quote marks */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-4xl sm:text-6xl text-emerald-200 font-serif">"</div>
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-4xl sm:text-6xl text-emerald-200 font-serif rotate-180">"</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Enhanced Call to Action - Perfect Mobile Responsive */}
      <motion.section
        className="relative bg-gradient-to-br from-green-500 via-emerald-600 via-teal-600 to-green-700 text-white py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 rounded-2xl sm:rounded-3xl text-center shadow-2xl overflow-hidden"
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
            className="flex justify-center mb-6 sm:mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.2, type: "spring", stiffness: 200 }}
          >
            <div className="bg-white/10 p-4 sm:p-6 lg:p-8 rounded-full backdrop-blur-sm border border-white/20">
              <Heart className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-white" />
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 lg:mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
          >
            Ready to Transform Your Garden?
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto leading-relaxed font-light"
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
              to="/about-us"
              className="group relative bg-white text-emerald-600 px-6 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-4 lg:py-6 rounded-full font-black text-base sm:text-lg md:text-xl lg:text-2xl shadow-3xl hover:shadow-4xl transition-all duration-500 inline-flex items-center space-x-2 sm:space-x-3 lg:space-x-4 overflow-hidden min-h-[44px] touch-manipulation"
            >
              <span className="relative z-10">Learn More About Us</span>
              <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;