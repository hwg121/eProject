import React, { useState, useEffect } from 'react';
import { Users, Target, Eye, Heart, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Star, Award, CheckCircle, Send, AlertCircle, MessageSquare } from 'lucide-react';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import { publicService, contactService } from '../services/api.ts';

const AboutUs: React.FC = () => {
  const [aboutUs, setAboutUs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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

  useEffect(() => {
    const loadAboutUs = async () => {
      try {
        setLoading(true);
        const data = await publicService.getActiveAboutUs();
        setAboutUs(data);
      } catch (err) {
        setError('Failed to load about us content');
        console.error('Error loading about us:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAboutUs();
  }, []);

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
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-emerald-600">Loading about us...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!aboutUs) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-emerald-800 mb-2">No content found</h3>
        <p className="text-emerald-600">About us content is not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <PageHeader
        title={aboutUs.title}
        subtitle={aboutUs.subtitle}
        icon={<Users className="h-10 w-10" />}
      />

      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{aboutUs.title}</h1>
            <p className="text-xl text-emerald-100 mb-6">{aboutUs.description}</p>
            {aboutUs.image && (
              <div className="mt-8">
                <img 
                  src={aboutUs.image} 
                  alt={aboutUs.title}
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section>
        <Card>
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-line text-emerald-700 leading-relaxed">
              {aboutUs.content}
            </div>
          </div>
        </Card>
      </section>

      {/* Mission, Vision, Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="text-center">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-emerald-800 mb-3">Sứ Mệnh</h3>
          <p className="text-emerald-600">{aboutUs.mission}</p>
        </Card>

        <Card className="text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-emerald-800 mb-3">Tầm Nhìn</h3>
          <p className="text-emerald-600">{aboutUs.vision}</p>
        </Card>

        <Card className="text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-emerald-800 mb-3">Giá Trị Cốt Lõi</h3>
          <p className="text-emerald-600">{aboutUs.values}</p>
        </Card>
      </section>

      {/* Team Members */}
      {aboutUs.team_members && aboutUs.team_members.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-emerald-800 text-center mb-8">Đội Ngũ Của Chúng Tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutUs.team_members.map((member: any, index: number) => (
              <Card key={index} className="text-center">
                <div className="mb-4">
                  <img 
                    src={member.image || '/image.png'} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-emerald-800 mb-2">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-3">{member.position}</p>
                <p className="text-emerald-600 text-sm">{member.description}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {aboutUs.achievements && aboutUs.achievements.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-emerald-800 text-center mb-8">Thành Tựu Của Chúng Tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutUs.achievements.map((achievement: any, index: number) => (
              <Card key={index} className="text-center">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">{achievement.title}</h3>
                <p className="text-emerald-600 text-sm">{achievement.description}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Contact Information */}
      <section>
        <h2 className="text-3xl font-bold text-emerald-800 text-center mb-8">Liên Hệ Với Chúng Tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">Email</h3>
            <p className="text-emerald-600">{aboutUs.contact_email}</p>
          </Card>

          <Card className="text-center">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">Điện Thoại</h3>
            <p className="text-emerald-600">{aboutUs.contact_phone}</p>
          </Card>

          <Card className="text-center">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">Địa Chỉ</h3>
            <p className="text-emerald-600">{aboutUs.address}</p>
          </Card>
        </div>
      </section>

      {/* Social Links */}
      {aboutUs.social_links && (
        <section>
          <h2 className="text-3xl font-bold text-emerald-800 text-center mb-8">Kết Nối Với Chúng Tôi</h2>
          <Card>
            <div className="flex justify-center space-x-6">
              {aboutUs.social_links.facebook && (
                <a 
                  href={aboutUs.social_links.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                  <span>Facebook</span>
                </a>
              )}
              {aboutUs.social_links.instagram && (
                <a 
                  href={aboutUs.social_links.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-pink-600 hover:text-pink-800 transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                  <span>Instagram</span>
                </a>
              )}
              {aboutUs.social_links.youtube && (
                <a 
                  href={aboutUs.social_links.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  <Youtube className="h-6 w-6" />
                  <span>YouTube</span>
                </a>
              )}
              {aboutUs.social_links.tiktok && (
                <a 
                  href={aboutUs.social_links.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-800 hover:text-gray-900 transition-colors"
                >
                  <span className="text-lg">🎵</span>
                  <span>TikTok</span>
                </a>
              )}
            </div>
          </Card>
        </section>
      )}

      {/* Contact Form Section */}
      <section className="mt-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-emerald-800 mb-4">Liên Hệ Với Chúng Tôi</h2>
          <p className="text-xl text-emerald-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy gửi tin nhắn cho chúng tôi!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="p-8 shadow-xl">
              <h3 className="text-3xl font-bold text-emerald-800 mb-8 text-center">Thông Tin Liên Hệ</h3>
              <div className="space-y-8">
                <div className="group flex items-start space-x-6 p-4 rounded-xl hover:bg-emerald-50 transition-all duration-300">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-emerald-800 mb-2">Email</h4>
                    <p className="text-lg text-emerald-600 mb-2">{aboutUs?.contact_email || 'info@greengroves.com'}</p>
                    <p className="text-sm text-gray-500">Chúng tôi sẽ phản hồi trong vòng 24 giờ</p>
                  </div>
                </div>

                <div className="group flex items-start space-x-6 p-4 rounded-xl hover:bg-emerald-50 transition-all duration-300">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-emerald-800 mb-2">Điện Thoại</h4>
                    <p className="text-lg text-emerald-600 mb-2">{aboutUs?.contact_phone || '0123 456 789'}</p>
                    <p className="text-sm text-gray-500">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                  </div>
                </div>

                <div className="group flex items-start space-x-6 p-4 rounded-xl hover:bg-emerald-50 transition-all duration-300">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-emerald-800 mb-2">Địa Chỉ</h4>
                    <p className="text-lg text-emerald-600">{aboutUs?.address || '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh'}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Contact Tips */}
            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200">
              <h4 className="text-xl font-bold text-emerald-800 mb-4">💡 Mẹo Liên Hệ</h4>
              <ul className="space-y-3 text-emerald-700">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Mô tả chi tiết vấn đề của bạn để chúng tôi hỗ trợ tốt nhất</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Để lại số điện thoại nếu bạn muốn được gọi lại</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Chúng tôi phản hồi nhanh nhất qua email</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="relative overflow-hidden shadow-2xl border-2 border-emerald-100">
              {/* Enhanced Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-300 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-300 rounded-full translate-y-16 -translate-x-16 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-teal-300 rounded-full -translate-x-12 -translate-y-12 animate-pulse delay-500"></div>
              </div>

              <div className="relative z-10 p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-4 shadow-lg">
                    <Send className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-emerald-800 mb-2">Send us a Message</h3>
                  <p className="text-emerald-600">Chúng tôi sẽ phản hồi sớm nhất có thể</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-bold text-emerald-800 mb-3 group-focus-within:text-emerald-600 transition-colors">
                      Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-300 text-lg placeholder-gray-400 hover:border-emerald-300"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Users className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-bold text-emerald-800 mb-3 group-focus-within:text-emerald-600 transition-colors">
                      Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-300 text-lg placeholder-gray-400 hover:border-emerald-300"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div className="group">
                    <label htmlFor="subject" className="block text-sm font-bold text-emerald-800 mb-3 group-focus-within:text-emerald-600 transition-colors">
                      Subject *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What's this about?"
                        required
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-300 text-lg placeholder-gray-400 hover:border-emerald-300"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Target className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-bold text-emerald-800 mb-3 group-focus-within:text-emerald-600 transition-colors">
                      Message *
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your question or feedback..."
                        rows={6}
                        required
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-300 text-lg placeholder-gray-400 hover:border-emerald-300 resize-none"
                      />
                      <div className="absolute top-4 right-4">
                        <MessageSquare className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white py-5 px-8 rounded-xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 flex items-center justify-center space-x-3 group"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Enhanced Status Messages */}
                {submitStatus === 'success' && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 text-green-800 rounded-xl flex items-center space-x-3 shadow-lg animate-pulse">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-lg">Cảm ơn bạn đã liên hệ!</p>
                      <p className="text-sm">Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300 text-red-800 rounded-xl flex items-center space-x-3 shadow-lg animate-pulse">
                    <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-lg">Có lỗi xảy ra!</p>
                      <p className="text-sm">{errorMessage}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
